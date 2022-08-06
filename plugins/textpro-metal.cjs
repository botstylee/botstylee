var tp = require("../lib/textpro.cjs")
var handler = async (m, {
	conn,
	args
}) => {
	var txt = args.join` `
	if (!txt) return conn.reply(m.chat, 'harap masukan teksnya!!!', m)
	if (txt.length > 15) return conn.reply(m.chat, 'maksimal 15', m)
	var items = ["https://textpro.me/shiny-metal-text-effect-852.html", "https://textpro.me/blue-metal-text-effect-831.html", "https://textpro.me/steel-text-effect-online-921.html", "https://textpro.me/glossy-blue-metal-text-effect-967.html", "https://textpro.me/black-metal-text-effect-829.html", "https://textpro.me/metal-rainbow-text-effect-854.html", "https://textpro.me/3d-chrome-text-effect-827.html", "https://textpro.me/denim-text-effect-online-919.html", "https://textpro.me/3d-glowing-metal-text-effect-828.html"];
	var cewe = items[Math.floor(Math.random() * items.length)]
	var a = await tp(cewe, txt)
	log(a)
	try {
		var buffer = await axios.request(a, {
			method: "GET",
			responseType: "arraybuffer",
			headers: {
				"user-agent": "GoogleBot"
			}
		})
		log(buffer.status)
		m.reply("tunggu sebentar")
		conn.sendFile(m.chat, buffer.data, "", "nih bruh", false)
	} catch (e) {
		if (e.response) {
			console.log(e.response.statusText)
			throw "emror bruh"
		}
	}
}
handler.help = ['metal [text]']
handler.tags = ['textpro']
handler.command = /^metal$/i


module.exports = handler