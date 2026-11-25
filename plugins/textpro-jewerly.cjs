var tp = require("../lib/textpro.cjs")
var axios = require("axios")

var handler = async (m, {
	conn,
	args
}) => {
	var txt = args.join(' ')
	if (!txt) return conn.reply(m.chat, 'harap masukan teksnya!!!', m)
	if (txt.length > 15) return conn.reply(m.chat, 'maksimal 15', m)

	// ✅ URL yang valid (sebelumnya kosong)
	var items = [
		"https://textpro.me/online-gold-jewelry-text-effect-884.html",
		"https://textpro.me/create-gold-jewelry-text-effect-online-883.html",
		"https://textpro.me/diamond-text-effect-online-880.html"
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
		console.error('[textpro-jewerly] Error:', e.message)
		throw 'emror bruh (scraper error)'
	}
}

handler.help = ['jewerly [text]']
handler.tags = ['textpro']
handler.command = /^jewerly$/i

module.exports = handler
