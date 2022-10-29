var tp = require("../lib/textpro.cjs")
var handler = async (m, {
	conn,
	args, 
	text, 
	usedPrefix: _p, 
	command: _c
}) => {
if(!text) throw 'ulangi command tadi, lalu coba seperti ini\n'+ _p+_c+ ' jawi&jawa'
var [t1, t2] = text.split(/[&|,]/i).trim()
if(!(t1, t2)){
t1 = 'jawi'
t2 = 'jawa'
}
	var a = await tp("https://textpro.me/create-cool-wall-graffiti-text-effect-online-1009.html", [t1, t2])
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
handler.help = ['grafity3 [text]']
handler.tags = ['textpro']
handler.command = /^grafity3$/i


module.exports = handler
