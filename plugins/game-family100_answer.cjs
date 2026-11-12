var similarity = require('similarity')
var threshold = 0.72
var handler = m => m
handler.before = async function(m) {
	this.game = this.game || {}
	var id = 'family100_' + m.chat
	var room = this.game[id]
	if (!room || typeof m.text !== 'string' || !m.text.trim()) return !0

	var text = m.text.toLowerCase().trim().replace(/[^\p{L}\p{N}\s-]+/gu, '').replace(/\s+/g, ' ')
	var isSurrender = /^(me)?nyerah$|^surr?ender$/i.test(text)
	if (!isSurrender) {
		var index = room.jawaban.findIndex(answer => String(answer).toLowerCase().trim().replace(/\s+/g, ' ') === text)
		if (index < 0) {
			var unanswered = room.jawaban.filter((_, answerIndex) => !room.terjawab[answerIndex])
			if (unanswered.length && Math.max(...unanswered.map(answer => similarity(String(answer).toLowerCase(), text))) >= threshold) await m.reply('Dikit lagi!')
			return !0
		}
		if (room.terjawab[index]) return !0
		var user = global.db?.data?.users?.[m.sender]
		if (user) user.exp = (Number(user.exp) || 0) + (Number(room.winScore) || 0)
		room.terjawab[index] = m.sender
	}

	var isWin = room.terjawab.every(Boolean)
	var caption = `*Soal:* ${room.soal}\nTerdapat *${room.jawaban.length}* jawaban\n${isWin ? '*SEMUA JAWABAN TERJAWAB*' : isSurrender ? '*MENYERAH!*' : ''}\n${room.jawaban.map((answer, answerIndex) => isSurrender || room.terjawab[answerIndex] ? `(${answerIndex + 1}) ${answer} ${room.terjawab[answerIndex] ? '@' + room.terjawab[answerIndex].split('@')[0] : ''}`.trim() : null).filter(Boolean).join('\n')}\n${isSurrender ? '' : `+${room.winScore} XP tiap jawaban benar`}`.trim()
	room.msg = await this.reply(m.chat, caption, m, { mentions: this.parseMention(caption) })
	if (isWin || isSurrender) delete this.game[id]
	return !0
}
module.exports = handler
