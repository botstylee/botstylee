var tp = require("../lib/textpro.cjs")
var axios = require("axios")

var handler = async (m, {
	conn,
	args,
	usedPrefix,
	command
}) => {
	// ✅ Ambil input, pisahkan berdasarkan tanda |
	var input = args.join(' ')
	var [txt1, txt2] = input.split('|').map(v => v.trim())

	if (!txt1 || !txt2) {
		return conn.reply(m.chat, `gunakan command seperti ini\n*Contoh*:\n${usedPrefix + command} benni|ganteng`, m)
	}
	if (txt1.length > 35 || txt2.length > 35) {
		return conn.reply(m.chat, 'maksimal 35 karakter per teks', m)
	}

	try {
		await m.reply('tunggu sebentar...')

		// ✅ Kirim dua teks ke textpro
		var a = await tp("https://textpro.me/create-a-glitch-text-effect-online-free-1026.html", txt1, txt2)
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
		console.error('[textpro-glitch] Error:', e.message)
		throw 'emror bruh (scraper error)'
	}
}

handler.help = ['glitch [teks]|[text2]']
handler.tags = ['textpro']
handler.command = /^glitch$/i

module.exports = handler
