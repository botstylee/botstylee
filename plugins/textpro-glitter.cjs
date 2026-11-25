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
		"https://textpro.me/blue-glitter-text-effect-841.html",
		"https://textpro.me/purple-glitter-text-effect-840.html",
		"https://textpro.me/pink-glitter-text-effect-839.html",
		"https://textpro.me/green-glitter-text-effect-838.html",
		"https://textpro.me/silver-glitter-text-effect-837.html",
		"https://textpro.me/gold-glitter-text-effect-836.html",
		"https://textpro.me/bronze-glitter-text-effect-835.html",
		"https://textpro.me/hexa-golden-text-effect-842.html"
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
		console.error('[textpro-glitter] Error:', e.message)
		throw 'emror bruh (scraper error)'
	}
}

handler.help = ['glitter [text]']
handler.tags = ['textpro']
handler.command = /^glitter$/i

module.exports = handler
