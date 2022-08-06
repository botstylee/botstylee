var tp = require("../lib/textpro.cjs")
var handler = async (m, {
	conn,
	args
}) => {
	var txt = args.join` `
	if (!txt) return conn.reply(m.chat, 'harap masukan teksnya!!!', m)
	if (txt.length > 15) return conn.reply(m.chat, 'maksimal 15', m)
	var a = await tp("https://textpro.me/create-a-magma-hot-text-effect-online-1030.html", txt)
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
handler.help = ['magma [text]']
handler.tags = ['textpro']
handler.command = /^magma$/i


module.exports = handler
