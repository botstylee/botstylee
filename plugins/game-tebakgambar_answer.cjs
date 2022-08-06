var similarity = require('similarity')
var threshold = 0.72
var handler = m => m
handler.before = async function(m) {
	var id = m.chat
	if (!m.quoted || !m.quoted.fromMe || !m.quoted.isBaileys || !/Ketik.*hint/i.test(m.quoted.text))
		return !0
	this.tebakgambar = this.tebakgambar ? this.tebakgambar : {}
	if (!(id in this.tebakgambar))
		return conn.sendButton(m.chat, 'Soal itu telah berakhir', author, null, buttonTebakgambar, m)
	if (m.quoted.id == this.tebakgambar[id][0].id) {
		var isSurrender = /^((me)?nyerah|surr?ender)$/i.test(m.text)
		if (isSurrender) {
			clearTimeout(this.tebakgambar[id][3])
			delete this.tebakgambar[id]
			return conn.sendButton(m.chat, '*Yah Menyerah :( !*', author, null, buttonTebakgambar, m)
		}
		var json = JSON.parse(JSON.stringify(this.tebakgambar[id][1]))
		// m.reply(JSON.stringify(json, null, '\t'))
		if (m.text.toLowerCase() == json.jawaban.toLowerCase().trim()) {
			db.data.users[m.sender].exp += this.tebakgambar[id][2]
			conn.sendButton(m.chat, `*Benar!*\n+${this.tebakgambar[id][2]} XP`, author, null, buttonTebakgambar, m)
			clearTimeout(this.tebakgambar[id][3])
			delete this.tebakgambar[id]
		} else if (similarity(m.text.toLowerCase(), json.jawaban.toLowerCase().trim()) >= threshold)
			m.reply(`*Dikit Lagi!*`)
		else
			conn.sendButton(m.chat, `*Salah!*`, author, null, [
				['hint', '/hint'],
				['nyerah', 'menyerah']
			], m)
	}

	// var isSurrender = /^((me)?nyerah|surr?ender)$/i.test(m.text)
	// if (isSurrender) {
	//     clearTimeout(this.tebakgambar[id][3])
	//     delete this.tebakgambar[id]
	//     return conn.sendButton(m.chat, '*Yah Menyerah :( !*', author, null, buttonTebakgambar, m)
	// }
	// var json = JSON.parse(JSON.stringify(this.tebakgambar[id][1]))
	// // m.reply(JSON.stringify(json, null, '\t'))
	// if (m.text.toLowerCase() == json.jawaban.toLowerCase().trim()) {
	//     db.data.users[m.sender].exp += this.tebakgambar[id][2]
	//     conn.sendButton(m.chat, `*Benar!*\n+${this.tebakgambar[id][2]} XP`, author, null, buttonTebakgambar, m)
	//     clearTimeout(this.tebakgambar[id][3])
	//     delete this.tebakgambar[id]
	// } else if (similarity(m.text.toLowerCase(), json.jawaban.toLowerCase().trim()) >= threshold) m.reply(`*Dikit Lagi!*`)
	// else if (m.quoted.id == this.tebakgambar[id][0].id) conn.sendButton(m.chat, `*Salah!*`, author, null, [
	//     ['hint', '/hint'],
	//     ['nyerah', 'menyerah']
	// ], m)
	return !0
}
module.exports = handler

var buttonTebakgambar = [
	['tebakgambar', '/tebakgambar']
]