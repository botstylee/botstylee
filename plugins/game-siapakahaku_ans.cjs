var similarity = require('similarity')
var threshold = 0.72
var handler = m => m
handler.before = async function(m) {
	var id = m.chat
	this.siapakahaku = this.siapakahaku || {}
	var game = this.siapakahaku[id]
	if (!game || !m.text) return !0
	var question = game[0]
	if (m.quoted && m.quoted.id !== question?.key?.id) return !0
	var answer = String(game[1]?.jawaban || '').trim().toLowerCase()
	var guess = m.text.trim().toLowerCase()
	if (/^(me)?nyerah|surr?ender$/i.test(guess)) {
		clearTimeout(game[3])
		delete this.siapakahaku[id]
		return m.reply(`Menyerah. Jawabannya: *${answer}*`)
	}
	if (guess === answer) {
		var user = global.db?.data?.users?.[m.sender]
		if (user) user.exp = (Number(user.exp) || 0) + (Number(game[2]) || 0)
		clearTimeout(game[3])
		delete this.siapakahaku[id]
		return m.reply(`*Benar!*\n+${game[2]} XP`)
	}
	if (similarity(guess, answer) >= threshold) return m.reply('*Dikit lagi!*')
	return m.reply('*Salah!*')
}
module.exports = handler
