var handler = async (m, {
	conn,
	text,
	usedPrefix,
	command
}) => {
	if (!text) {
		return conn.reply(m.chat, `*${usedPrefix}${command} <nama hewan>*
contoh:
*${usedPrefix}${command} dog*

┌─「 Opsi 」─⬣
│⬡  dog
│⬡  cat
│⬡  panda
│⬡  fox
│⬡  red_panda
│⬡  koala
│⬡  bird
│⬡  raccoon
│⬡  kangaroo
│⬡  whale
│ 
└────`.trim(), m)
	}

	try {
		var animal = text.toLowerCase()
		// ✅ Pastikan URL sesuai format endpoint yang valid
		var url = `https://some-random-api.com/animal/${animal}`
		var res = await fetch(url)

		if (!res.ok) {
			// Memberikan pesan error yang lebih jelas jika hewan tidak ditemukan
			return conn.reply(m.chat, `Gagal mengambil data (HTTP ${res.status}). Pastikan nama hewannya benar dan ada di daftar.`, m)
		}

		var json = await res.json()

		if (json.image) {
			await conn.sendMessage(m.chat, {
				image: { url: json.image },
				caption: json.fact || ''
			}, { quoted: m })
		} else {
			return conn.reply(m.chat, 'API tidak mengembalikan gambar. Coba hewan lain.', m)
		}
	} catch (e) {
		console.error('[animal] Error:', e)
		await conn.reply(m.chat, 'Terjadi kesalahan: ' + (e.message || e), m)
	}
}

handler.help = ["animal"].map((v) => v + " <hewan>")
handler.tags = ["internet"]
handler.command = /^(animal|animalfact)$/i

module.exports = handler
