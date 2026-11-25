var similarity = require('similarity');
var threshold = 0.72

var handler = m => m
handler.before = async function(m) {
	var id = m.chat

	// ✅ Guard lengkap — cek m.quoted dengan aman
	if (!m.quoted || !m.quoted.fromMe || !m.quoted.isBaileys) return !0

	// ✅ Ambil teks dari quoted dengan aman (bisa object / string)
	var quotedText = typeof m.quoted.text === 'string' ? m.quoted.text : (m.quoted.text?.text || m.quoted.text?.conversation || '')
	if (!/Ketik.*who|hint/i.test(quotedText)) return !0

	this.siapakahaku = this.siapakahaku ? this.siapakahaku : {}

	if (!(id in this.siapakahaku)) {
		await this.sendMessage(m.chat, {
			text: `Soal itu telah berakhir.\n\n_Ketik #siapakahaku untuk main lagi._`
		}, { quoted: m })
		return !0
	}

	if (m.quoted.id == this.siapakahaku[id][0].id) {
		var json = JSON.parse(JSON.stringify(this.siapakahaku[id][1]))

		if (m.text.toLowerCase() == json.jawaban.toLowerCase().trim()) {
			db.data.users[m.sender].exp += this.siapakahaku[id][2]
			await this.sendMessage(m.chat, {
				text: `✅ *Benar!*\n+${this.siapakahaku[id][2]} XP\n\n_Ketik #siapakahaku untuk main lagi._`
			}, { quoted: m })
			clearTimeout(this.siapakahaku[id][3])
			delete this.siapakahaku[id]
		} else if (similarity(m.text.toLowerCase(), json.jawaban.toLowerCase().trim()) >= threshold) {
			m.reply(`*Dikit Lagi!*`)
		} else {
			m.reply(`*Salah!*`)
		}
	}
	return !0
}

module.exports = handler
