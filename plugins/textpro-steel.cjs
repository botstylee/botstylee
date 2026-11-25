var tp = require("../lib/textpro.cjs")
var axios = require("axios")

var handler = async (m, {
	conn,
	args
}) => {
	var txt = args.join(' ')
	if (!txt) return conn.reply(m.chat, 'harap masukan teksnya!!!', m)
	if (txt.length > 15) return conn.reply(m.chat, 'maksimal 15 karakter', m)

	var items = [
		"https://textpro.me/pink-sparkling-jewelry-text-effect-899.html",
		"https://textpro.me/blue-sparkling-jewelry-text-effect-898.html",
		"https://textpro.me/green-sparkling-jewelry-text-effect-897.html",
		"https://textpro.me/purple-sparkling-jewelry-text-effect-896.html",
		"https://textpro.me/gold-sparkling-jewelry-text-effect-895.html",
		"https://textpro.me/red-sparkling-jewelry-text-effect-894.html",
		"https://textpro.me/cyan-sparkling-jewelry-text-effect-893.html",
		"https://textpro.me/3d-luxury-gold-text-effect-online-1003.html",
		"https://textpro.me/peridot-stone-text-effect-916.html"
	]
	var cewe = items[Math.floor(Math.random() * items.length)]

	try {
		await m.reply('tunggu sebentar...')

		// Ambil URL hasil dari textpro (URL acak dari items)
		var a = await tp(cewe, txt)
		console.log('[textpro-steel] URL efek:', cewe)
		console.log('[textpro-steel] URL hasil:', a)

		if (!a) throw new Error('URL hasil kosong dari scraper')

		// Download gambar hasil
		var buffer = await axios.request(a, {
			method: "GET",
			responseType: "arraybuffer",
			headers: {
				"user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
			}
		})
		console.log('[textpro-steel] Status download:', buffer.status)

		// Kirim gambar
		await conn.sendFile(m.chat, buffer.data, '', 'nih bruh', m)

	} catch (e) {
		console.error('[textpro-steel] Error:', e.message)
		await conn.reply(m.chat, 'emror bruh (scraper error)', m)
	}
}

handler.help = ['steel [text]']
handler.tags = ['textpro']
handler.command = /^steel$/i

module.exports = handler
