var handler = m => m
handler.before = async function(m) {
	var id = m.chat
	this.math = this.math || {}
	var game = this.math[id]
	if (!game || !m.text || !/^-?\d+(\.\d+)?$/.test(m.text.trim())) return !0
	var quotedText = m.quoted?.text || m.quoted?.contentText || ''
	if (m.quoted && !/^Berapa hasil dari/i.test(quotedText)) return !0
	var math = game[1]
	if (Number(m.text.trim()) === Number(math.result)) {
		var user = global.db?.data?.users?.[m.sender]
		if (user) user.exp = (Number(user.exp) || 0) + (Number(math.bonus) || 0)
		clearTimeout(game[3])
		delete this.math[id]
		await this.reply(m.chat, `*Jawaban benar!*\n+${math.bonus} XP`, m)
	} else if (--game[2] <= 0) {
		clearTimeout(game[3])
		delete this.math[id]
		await this.reply(m.chat, `*Kesempatan habis!*\nJawaban: *${math.result}*`, m)
	} else await m.reply(`*Jawaban salah!*\nMasih ada ${game[2]} kesempatan.`)
	return !0
}
module.exports = handler
