var fetch = require('node-fetch')

var handler = async (m, { conn }) => {
	try {
		// ✅ Endpoint baru yang aktif
		var url = 'https://botstylee-ben-production.up.railway.app/api/randomimage/loli'
		var res = await fetch(url)

		if (!res.ok) {
			return conn.reply(m.chat, `Gagal mengambil gambar (HTTP ${res.status})`, m)
		}

		var json = await res.json()

		// ✅ Cek beberapa kemungkinan struktur respons
		// (result, url, data, atau langsung string)
		var imageUrl = json.result || json.url || json.data || (typeof json === 'string' ? json : null)

		if (!imageUrl) {
			return conn.reply(m.chat, 'API tidak mengembalikan URL gambar.', m)
		}

		// ✅ Kirim sebagai gambar dengan caption
		await conn.sendMessage(m.chat, {
			image: { url: imageUrl },
			caption: 'Ini lolinya kak'
		}, { quoted: m })

	} catch (e) {
		console.error('[loli] Error:', e)
		await conn.reply(m.chat, 'Terjadi kesalahan: ' + (e.message || e), m)
	}
}

handler.help = ['loli']
handler.tags = ['anime']
handler.command = /^(loli)$/i

module.exports = handler
