var similarity = require('similarity')
var threshold = 0.72

var handler = m => m
handler.before = async function(m) {
	var id = m.chat

	// ✅ Guard lengkap — cegah error jika m.quoted undefined
	if (!m.quoted || !m.quoted.fromMe || !m.quoted.isBaileys || !/Ketik.*teka/i.test(m.quoted.text || ''))
		return !0

	this.tebakkata = this.tebakkata ? this.tebakkata : {}

	if (!(id in this.tebakkata)) {
		// ✅ Ganti sendButton → sendMessage, pakai this
		await this.sendMessage(m.chat, {
			text: `Soal itu telah berakhir.\n\n_Ketik #tebakkata untuk main lagi._`
		}, { quoted: m })
		return !0
	}

	if (m.quoted.id == this.tebakkata[id][0].id) {
		// ✅ Tambah logika nyerah
		var isSurrender = /^((me)?nyerah|surr?ender)$/i.test(m.text)
		if (isSurrender) {
			clearTimeout(this.tebakkata[id][3])
			var jawaban = this.tebakkata[id][1]?.jawaban || '...'
			delete this.tebakkata[id]
			await this.sendMessage(m.chat, {
				text: `😔 *Yah Menyerah :(*\n\nJawabannya adalah *${jawaban}*\n\n_Ketik #tebakkata untuk main lagi._`
			}, { quoted: m })
			return !0
		}

		var json = JSON.parse(JSON.stringify(this.tebakkata[id][1]))

		if (m.text.toLowerCase() == json.jawaban.toLowerCase().trim()) {
			db.data.users[m.sender].exp += this.tebakkata[id][2]
			await this.sendMessage(m.chat, {
				text: `✅ *Benar!*\n+${this.tebakkata[id][2]} XP\n\n_Ketik #tebakkata untuk main lagi._`
			}, { quoted: m })
			clearTimeout(this.tebakkata[id][3])
			delete this.tebakkata[id]
		} else if (similarity(m.text.toLowerCase(), json.jawaban.toLowerCase().trim()) >= threshold) {
			m.reply(`*Dikit Lagi!*`)
		} else {
			m.reply(`*Salah!*`)
		}
	}
	return !0
}

module.exports = handler
