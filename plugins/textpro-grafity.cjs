var tp = require("../lib/textpro.cjs")
var axios = require("axios")

var handler = async (m, {
	conn,
	args,
	text,
	usedPrefix: _p,
	command: _c
}) => {
	if (!text) {
		throw `ulangi command tadi, lalu coba seperti ini\n${_p + _c} jawi&jawa`
	}

	// ✅ Pisahkan 2 teks berdasarkan & | ,
	var parts = text.split(/[&|,]/i).map(v => v.trim())
	var t1 = parts[0] || 'jawi'
	var t2 = parts[1] || 'jawa'

	try {
		await m.reply('tunggu sebentar...')

		// ✅ Kirim dua teks ke textpro dalam bentuk array
		var a = await tp("https://textpro.me/create-a-cool-graffiti-text-on-the-wall-1010.html", [t1, t2])
		console.log('[textpro] URL hasil:', a)

		// ✅ Download gambar
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
		console.error('[textpro-grafity] Error:', e.message)
		throw 'emror bruh (scraper error)'
	}
}

handler.help = ['grafity [text]']
handler.tags = ['textpro']
handler.command = /^grafity$/i

module.exports = handler
