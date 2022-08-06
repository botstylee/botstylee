var similarity = require('similarity');
var threshold = 0.72
var handler = m => m
handler.before = async function(m) {
	var id = m.chat
	if (!m.quoted || !m.quoted.fromMe || !m.quoted.isBaileys || !/Ketik.*who|hint/i.test(m.quoted.text)) return !0
	this.siapakahaku = this.siapakahaku ? this.siapakahaku : {}
	if (!(id in this.siapakahaku)) return conn.sendButton(m.chat, 'Soal itu telah berakhir', author, ['siapakahaku', '/siapakahaku'], m)
	if (m.quoted.id == this.siapakahaku[id][0].id) {
		var json = JSON.parse(JSON.stringify(this.siapakahaku[id][1]))
		// m.reply(JSON.stringify(json, null, '\t'))
		if (m.text.toLowerCase() == json.jawaban.toLowerCase().trim()) {
			db.data.users[m.sender].
			exp += this.siapakahaku[id][2]
			conn.sendButton(m.chat, `*Benar!*\n+${this.siapakahaku[id][2]} XP`, author, ['siapakahaku', '/siapakahaku'], m)
			clearTimeout(this.siapakahaku[id][3])
			delete this.siapakahaku[id]
		} else if (similarity(m.text.toLowerCase(), json.jawaban.toLowerCase().trim()) >= threshold) m.reply(`*Dikit Lagi!*`)
		else m.reply(`*Salah!*`)
	}
	return !0
}

module.exports = handler