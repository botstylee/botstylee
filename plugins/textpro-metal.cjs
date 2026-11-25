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
		"https://textpro.me/shiny-metal-text-effect-852.html",
		"https://textpro.me/blue-metal-text-effect-831.html",
		"https://textpro.me/steel-text-effect-online-921.html",
		"https://textpro.me/glossy-blue-metal-text-effect-967.html",
		"https://textpro.me/black-metal-text-effect-829.html",
		"https://textpro.me/metal-rainbow-text-effect-854.html",
		"https://textpro.me/3d-chrome-text-effect-827.html",
		"https://textpro.me/denim-text-effect-online-919.html",
		"https://textpro.me/3d-glowing-metal-text-effect-828.html"
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
		console.error('[textpro-metal] Error:', e.message)
		throw 'emror bruh (scraper error)'
	}
}

handler.help = ['metal [text]']
handler.tags = ['textpro']
handler.command = /^metal$/i

module.exports = handler
