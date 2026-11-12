var similarity = require('similarity')
var threshold = 0.72
var handler = m => m
handler.before = async function(m) {
	var id = m.chat
	this.caklontong = this.caklontong || {}
	var game = this.caklontong[id]
	if (!game || !m.text) return !0
	var quotedId = game[0]?.key?.id || game[0]?.id
	if (m.quoted && quotedId && m.quoted.id !== quotedId) return !0

	var answer = String(game[1]?.jawaban || '').trim().toLowerCase()
	var text = m.text.trim().toLowerCase()
	if (/^(me)?nyerah$|^surr?ender$/i.test(text)) {
		clearTimeout(game[3])
		delete this.caklontong[id]
		return m.reply(`Menyerah. Jawabannya: *${answer}*\n${game[1]?.deskripsi || ''}`)
	}
	if (text === answer) {
		var user = global.db?.data?.users?.[m.sender]
		if (user) user.exp = (Number(user.exp) || 0) + (Number(game[2]) || 0)
		clearTimeout(game[3])
		delete this.caklontong[id]
		return m.reply(`*Benar!* +${game[2]} XP\n${game[1]?.deskripsi || ''}`)
	}
	return m.reply(similarity(text, answer) >= threshold ? '*Dikit lagi!*' : '*Salah!*')
}
module.exports = handler
