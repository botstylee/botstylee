var similarity = require('similarity')
var threshold = 0.72
var handler = m => m
handler.before = async function(m) {
	var id = m.chat
	this.tebakgambar = this.tebakgambar || {}
	var game = this.tebakgambar[id]
	if (!game || !m.text) return !0
	var quotedText = m.quoted?.text || m.quoted?.contentText || ''
	if (!m.quoted || !m.quoted.fromMe || !/^.*Ketik .*hint/i.test(quotedText) || m.quoted.id !== game[0]?.key?.id) return !0

	if (/^(me)?nyerah|surr?ender$/i.test(m.text.trim())) {
		clearTimeout(game[3])
		delete this.tebakgambar[id]
		return m.reply('*Yah, menyerah :( !*')
	}
	var answer = String(game[1]?.jawaban || '').trim().toLowerCase()
	var guess = m.text.trim().toLowerCase()
	if (!answer) return m.reply('Data jawaban tidak tersedia.')
	if (guess === answer) {
		var user = global.db?.data?.users?.[m.sender]
		if (user) user.exp = (Number(user.exp) || 0) + (Number(game[2]) || 0)
		clearTimeout(game[3])
		delete this.tebakgambar[id]
		return m.reply(`*Benar!*\n+${game[2]} XP`)
	}
	if (similarity(guess, answer) >= threshold) return m.reply('*Dikit lagi!*')
	return m.reply('*Salah!*\nKetik .hint untuk petunjuk atau .nyerah untuk menyerah.')
}
module.exports = handler
