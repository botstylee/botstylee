var fetch = require('node-fetch')

var handler = async (m, {
	conn,
	text
}) => {
	if (!text) return conn.reply(m.chat, 'Masukkan judul anime!\nContoh: *.anime one piece*', m)

	try {
		// ✅ Endpoint Jikan v4 (gratis, tanpa API key)
		var url = `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(text)}&limit=1`
		var res = await fetch(url)

		if (!res.ok) {
			return conn.reply(m.chat, `Gagal mengambil data (HTTP ${res.status})`, m)
		}

		var json = await res.json()

		// ✅ Jikan v4 membungkus hasil dalam properti `data`
		if (!json.data || !json.data.length) {
			return conn.reply(m.chat, `Anime *${text}* tidak ditemukan.`, m)
		}

		var anime = json.data[0]

		// ✅ Sesuaikan field dengan struktur Jikan v4
		var title = anime.title || '-'
		var episodes = anime.episodes || '-'
		var startDate = anime.aired?.from ? new Date(anime.aired.from).toLocaleDateString('id-ID') : '-'
		var endDate = anime.aired?.to ? new Date(anime.aired.to).toLocaleDateString('id-ID') : '-'
		var type = anime.type || '-'
		var rating = anime.rating || '-'
		var score = anime.score || '-'
		var members = anime.members || '-'
		var synopsis = anime.synopsis || '-'
		var imageUrl = anime.images?.jpg?.image_url || ''
		var animeUrl = anime.url || ''

		var animeingfo = `✨️ *Title:* ${title}
🎆️ *Episodes:* ${episodes}
➡️ *Start date:* ${startDate}
🔚 *End date:* ${endDate}
💬 *Show Type:* ${type}
💌️ *Rating:* ${rating}
❤️ *Score:* ${score}
👥 *Members:* ${members}
💚️ *Synopsis:* ${synopsis}
🌐️ *URL*: ${animeUrl}`

		// ✅ Kirim gambar + caption
		if (imageUrl) {
			await conn.sendMessage(m.chat, {
				image: { url: imageUrl },
				caption: animeingfo
			}, { quoted: m })
		} else {
			await conn.reply(m.chat, animeingfo, m)
		}

	} catch (e) {
		console.error('[anime] Error:', e)
		await conn.reply(m.chat, 'Terjadi kesalahan: ' + (e.message || e), m)
	}
}

handler.help = ['anime <judul>']
handler.tags = ['anime']
handler.command = /^(anime|animeinfo)$/i
handler.limit = 3

module.exports = handler
