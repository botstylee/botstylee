var tp = require("../lib/textpro.cjs")
var axios = require("axios")

var handler = async (m, {
	conn,
	args
}) => {
	var txt = args.join(' ')
	if (!txt) return conn.reply(m.chat, 'harap masukan teksnya!!!', m)
	if (txt.length > 15) return conn.reply(m.chat, 'maksimal 15 karakter', m)

	try {
		await m.reply('tunggu sebentar...')

		// Ambil URL hasil dari textpro
		var a = await tp("https://textpro.me/wood-text-effect-856.html", txt)
		console.log('[textpro-kayu] URL hasil:', a)

		if (!a) throw new Error('URL hasil kosong dari scraper')

		// Download gambar hasil
		var buffer = await axios.request(a, {
			method: "GET",
			responseType: "arraybuffer",
			headers: {
				"user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
			}
		})
		console.log('[textpro-kayu] Status download:', buffer.status)

		// Kirim gambar
		await conn.sendFile(m.chat, buffer.data, '', 'nih bruh', m)

	} catch (e) {
		console.error('[textpro-kayu] Error:', e.message)
		await conn.reply(m.chat, 'emror bruh (scraper error)', m)
	}
}

handler.help = ['kayu [text]']
handler.tags = ['textpro']
handler.command = /^kayu$/i

module.exports = handler
