var tp = require("../lib/textpro.cjs")

var handler = async (m, {
	conn,
	args
}) => {
	var txt = args.join` `
	if (!txt) return conn.reply(m.chat, 'harap masukan teksnya!!!', m)
	if (txt.length > 15) return conn.reply(m.chat, 'maksimal 15 karakter', m)

	try {
		// textproScraper mengembalikan URL gambar (string)
		var imageUrl = await tp("https://textpro.me/create-3d-neon-light-text-effect-online-1028.html", txt)
		console.log('[neonlight] image url:', imageUrl)

		if (!imageUrl) throw new Error('Gagal mendapatkan URL gambar')

		m.reply("tunggu sebentar...")

		// Download gambar hasil
		var buffer = await axios.request(imageUrl, {
			method: "GET",
			responseType: "arraybuffer",
			headers: {
				"user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
			}
		})

		await conn.sendFile(m.chat, buffer.data, "", "nih bruh", m)
	} catch (e) {
		console.error('[neonlight] Error:', e)
		conn.reply(m.chat, `Gagal memproses: ${e.message || e}`, m)
	}
}

handler.help = ['neonlight [text]']
handler.tags = ['textpro']
handler.command = /^neonlight$/i

module.exports = handler
