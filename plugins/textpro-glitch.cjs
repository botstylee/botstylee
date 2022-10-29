var tp = require("../lib/textpro.cjs")
var handler = async (m, {
	conn,
	args
}) => {
	var txt = args.join` `
	if (!txt) return conn.reply(m.chat, 'harap masukan teksnya!!!', m)
	if (txt.length > 35) return conn.reply(m.chat, 'maksimal 35', m)
  if (!txt2) return conn.reply(m.chat, 'gunakan command seperti ini\m*Contoh*:\n'+`${usedPrefix+command} benni|ganteng`, m)
	if (txt2.length > 35) return conn.reply(m.chat, 'maksimal 35', m)
	var a = await tp("https://textpro.me/create-a-glitch-text-effect-online-free-1026.html", txt1,txt2)
	console.log(a)
	try {
		var buffer = await axios.request(a, {
			method: "GET",
			responseType: "arraybuffer",
			headers: {
				"user-agent": "GoogleBot"
			}
		})
		console.log(buffer.status)
		m.reply("tunggu sebentar")
		conn.sendFile(m.chat, buffer.data, "", "nih bruh", false)
	} catch (e) {
		if (e.response) {
			console.log(e.response.statusText)
			throw "emror bruh"
		}
	}
}
handler.help = ['glitch [teks]|[text2]']
handler.tags = ['textpro']
handler.command = /^glitch$/i


module.exports = handler
