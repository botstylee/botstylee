var similarity = require('similarity')
var threshold = 0.72

var handler = m => m
handler.before = async function(m) {
	var id = m.chat

	// ✅ Guard lengkap — cek m.quoted dengan aman
	if (!m.quoted || !m.quoted.fromMe || !m.quoted.isBaileys) return !0

	// ✅ Ambil teks dari quoted dengan aman (bisa object / string)
	var quotedText = typeof m.quoted.text === 'string' ? m.quoted.text : (m.quoted.text?.text || m.quoted.text?.conversation || '')
	if (!/Ketik.*hint/i.test(quotedText)) return !0

	this.tebakgambar = this.tebakgambar ? this.tebakgambar : {}

	if (!(id in this.tebakgambar)) {
		await this.sendMessage(m.chat, {
			text: `Soal itu telah berakhir.\n\n_Ketik #tebakgambar untuk main lagi._`
		}, { quoted: m })
		return !0
	}

	if (m.quoted.id == this.tebakgambar[id][0].id) {
		var isSurrender = /^((me)?nyerah|surr?ender)$/i.test(m.text)

		if (isSurrender) {
			clearTimeout(this.tebakgambar[id][3])
			var jawaban = this.tebakgambar[id]?.[1]?.jawaban || '...'
			delete this.tebakgambar[id]
			await this.sendMessage(m.chat, {
				text: `😔 *Yah Menyerah :(*\n\nJawabannya adalah *${jawaban}*\n\n_Ketik #tebakgambar untuk main lagi._`
			}, { quoted: m })
			return !0
		}

		var json = JSON.parse(JSON.stringify(this.tebakgambar[id][1]))

		if (m.text.toLowerCase() == json.jawaban.toLowerCase().trim()) {
			db.data.users[m.sender].exp += this.tebakgambar[id][2]
			await this.sendMessage(m.chat, {
				text: `✅ *Benar!*\n+${this.tebakgambar[id][2]} XP\n\n_Ketik #tebakgambar untuk main lagi._`
			}, { quoted: m })
			clearTimeout(this.tebakgambar[id][3])
			delete this.tebakgambar[id]
		} else if (similarity(m.text.toLowerCase(), json.jawaban.toLowerCase().trim()) >= threshold) {
			m.reply(`*Dikit Lagi!*`)
		} else {
			await this.sendMessage(m.chat, {
				text: `❌ *Salah!*\n\n_Ketik #hint untuk hint, atau *nyerah* untuk menyerah._`
			}, { quoted: m })
		}
	}
	return !0
}

module.exports = handler
