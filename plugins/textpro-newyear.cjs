var tp = require("../lib/textpro.cjs")
var axios = require("axios")

var handler = async (m, {
	conn,
	args
}) => {
	var txt = args.join(' ')
	if (!txt) return conn.reply(m.chat, 'harap masukan teksnya!!!', m)
	if (txt.length > 15) return conn.reply(m.chat, 'maksimal 15', m)

	try {
		await m.reply('tunggu sebentar...')

		// ✅ Ambil URL hasil dari textpro
		var a = await tp("https://textpro.me/happ-new-year-card-firework-gif-959.html", txt)
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
		console.error('[textpro-newyear] Error:', e.message)
		throw 'emror bruh (scraper error)'
	}
}

handler.help = ['newyear [text]']
handler.tags = ['textpro']
handler.command = /^newyear$/i

module.exports = handler
