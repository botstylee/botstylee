var tp = require("../lib/textpro.cjs")
var axios = require("axios")

var handler = async (m, {
	conn,
	args
}) => {
	var txt = args.join(' ')
	if (!txt) return conn.reply(m.chat, 'harap masukan teksnya!!!', m)
	if (txt.length > 15) return conn.reply(m.chat, 'maksimal 15', m)

	var items = [
		"https://textpro.me/ultra-gloss-text-effect-online-920.html",
		"https://textpro.me/decorate-green-text-effect-918.html",
		"https://textpro.me/decorate-purple-text-effect-917.html",
		"https://textpro.me/yellow-glass-text-effect-913.html",
		"https://textpro.me/purple-glass-text-effect-912.html",
		"https://textpro.me/orange-glass-text-effect-911.html",
		"https://textpro.me/green-glass-text-effect-910.html",
		"https://textpro.me/cyan-glass-text-effect-909.html",
		"https://textpro.me/blue-glass-text-effect-908.html",
		"https://textpro.me/red-glass-text-effect-907.html",
		"https://textpro.me/purple-shiny-glass-text-effect-906.html",
		"https://textpro.me/decorative-glass-text-effect-891.html",
		"https://textpro.me/purple-glass-text-effect-online-892.html"
	]
	var cewe = items[Math.floor(Math.random() * items.length)]

	try {
		await m.reply('tunggu sebentar...')

		// ✅ Ambil URL hasil dari textpro
		var a = await tp(cewe, txt)
		console.log('[textpro] URL hasil:', a)

		// ✅ Download gambar hasil
		var buffer = await axios.request(a, {
			method: "GET",
			responseType: "arraybuffer",
			headers: {
				"user-agent": "GoogleBot"
			}
		})
		console.log('[textpro] Status download:', buffer.status)

		// ✅ Kirim gambar
		await conn.sendFile(m.chat, buffer.data, 'textpro.jpg', 'nih bruh', m)

	} catch (e) {
		console.error('[textpro-glossy] Error:', e.message)
		throw 'emror bruh (scraper error)'
	}
}

handler.help = ['glossy [text]']
handler.tags = ['textpro']
handler.command = /^glossy$/i

module.exports = handler
