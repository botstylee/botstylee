var similarity = require('similarity')
var threshold = 0.72
var handler = m => m
handler.before = async function(m) {
	this.game = this.game ? this.game : {}
	var id = 'family100_' + m.chat
	if (!(id in this.game))
		return !0
	var room = this.game[id]
	var text = m.text.toLowerCase().replace(/[^\w\s\-]+/, '')
	var isSurrender = /^((me)?nyerah|surr?ender)$/i.test(m.text)
	if (!isSurrender) {
		var index = room.jawaban.indexOf(text)
		if (index < 0) {
			if (Math.max(...room.jawaban.filter((_, index) => !room.terjawab[index]).map(jawaban => similarity(jawaban, text))) >= threshold)
				m.reply('Dikit lagi!')
			return !0
		}
		if (room.terjawab[index])
			return !0
		var users = db.data.users[m.sender]
		room.terjawab[index] = m.sender
		users.exp += room.winScore
	}
	var isWin = room.terjawab.length === room.terjawab.filter(v => v).length
	var caption = `
*Soal:* ${room.soal}
Terdapat *${room.jawaban.length}* jawaban${room.jawaban.find(v => v.includes(' ')) ? `
(beberapa jawaban terdapat spasi)
` : ''}
${isWin ? `*SEMUA JAWABAN TERJAWAB*` : isSurrender ? '*MENYERAH!*' : ''}
${Array.from(room.jawaban, (jawaban, index) => {
        return isSurrender || room.terjawab[index] ? `(${index + 1}) ${jawaban} ${room.terjawab[index] ? '@' + room.terjawab[index].split('@')[0] : ''}`.trim() : false
    }).filter(v => v).join('\n')}
${isSurrender ? '' : `+${room.winScore} XP tiap jawaban benar`}
    `.trim()
	var msg = await this.sendButton(m.chat, caption, author, null, [
		[`${(isWin || isSurrender) ? 'Family 100' : 'Nyerah'}`, `${(isWin || isSurrender) ? '.family100' : 'nyerah'}`]
	], null, {
		mentions: this.parseMention(caption)
	})
	room.msg = msg
	if (isWin || isSurrender)
		delete this.game[id]
	return !0
}

module.exports = handler