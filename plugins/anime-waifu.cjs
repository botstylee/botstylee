var fetch = require('node-fetch')

var handler = async (m, { conn }) => {
	try {
		// ✅ Endpoint waifu.pics (masih aktif, tanpa API key)
		var res = await fetch('https://api.waifu.pics/sfw/waifu')

		if (!res.ok) {
			return conn.reply(m.chat, `Gagal mengambil gambar (HTTP ${res.status})`, m)
		}

		var json = await res.json()

		if (!json.url) {
			return conn.reply(m.chat, 'API tidak mengembalikan URL gambar.', m)
		}

		// ✅ Kirim sebagai gambar
		await conn.sendMessage(m.chat, {
			image: { url: json.url },
			caption: 'istri gweh'
		}, { quoted: m })

	} catch (e) {
		console.error('[waifu] Error:', e)
		await conn.reply(m.chat, 'Terjadi kesalahan: ' + (e.message || e), m)
	}
}

handler.help = ['waifu']
handler.tags = ['anime']
handler.command = /^(waifu)$/i
handler.limit = true

module.exports = handler
