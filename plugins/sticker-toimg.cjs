var fs = require('fs');
owo = fs.readFileSync('./src/gambar/l.jpg')
var {
	webp2png
} = require('../lib/webp2mp4.cjs');
var handler = async (m, {
	conn,
	usedPrefix,
	command
}) => {
	if (!m.quoted) throw `balas stiker dengan caption *${usedPrefix + command}*`
	var mime = m.quoted.mimetype || ''
	if (!/webp/.test(mime)) throw `balas stiker dengan caption *${usedPrefix + command}*`
	var media = await m.quoted.download()
	var out = owo
	if (/webp/.test(mime)) {
		out = await webp2png(media)
	}
	await conn.sendFile(m.chat, out, 'out.jpeg', '*kemlar*', m, false, {
		thumbnail: fs.readFileSync('./src/gambar/l.jpg')
	})
}
handler.help = ['toimg (reply)']
handler.tags = ['sticker']
handler.command = ['toimg']

module.exports = handler