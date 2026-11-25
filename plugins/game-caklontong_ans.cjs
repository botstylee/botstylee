var similarity = require('similarity')
var threshold = 0.72

var handler = m => m
handler.before = async function(m) {
	var id = m.chat

	// ✅ Guard lengkap — cek m.quoted dengan aman
	if (!m.quoted || !m.quoted.fromMe || !m.quoted.isBaileys) return !0

	// ✅ Ambil teks dari quoted dengan aman (bisa object / string)
	var quotedText = typeof m.quoted.text === 'string' ? m.quoted.text : (m.quoted.text?.text || m.quoted.text?.conversation || '')
	if (!/Ketik.*calo/i.test(quotedText)) return !0

	this.caklontong = this.caklontong ? this.caklontong : {}

	if (!(id in this.caklontong))
		return m.reply('Soal itu telah berakhir')

	if (m.quoted.id == this.caklontong[id][0].id) {
		var json = JSON.parse(JSON.stringify(this.caklontong[id][1]))

		if (m.text.toLowerCase() == json.jawaban.toLowerCase().trim()) {
			db.data.users[m.sender].exp += this.caklontong[id][2]
			await this.reply(m.chat, `*Benar!* +${this.caklontong[id][2]} XP\n${json.deskripsi}\n\nKetik .caklontong untuk soal baru`, m)
			clearTimeout(this.caklontong[id][3])
			delete this.caklontong[id]
		} else if (similarity(m.text.toLowerCase(), json.jawaban.toLowerCase().trim()) >= threshold) {
			m.reply(`*Dikit Lagi!*`)
		} else {
			m.reply(`*Salah!*`)
		}
	}
	return !0
}

module.exports = handler
