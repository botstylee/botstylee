const {
	fs
} = require('fs');
owo = fs.readFileSync('./src/gambar/l.jpg')
const {
	webp2png
} = require('../lib/webp2mp4.cjs');
let handler = async (m, {
	conn,
	usedPrefix,
	command
}) => {
  if (!m.quoted) throw `balas stiker dengan caption *${usedPrefix + command}*`
  let mime = m.quoted.mimetype || ''
  if (!/webp/.test(mime)) throw `balas stiker dengan caption *${usedPrefix + command}*`
  let media = await m.quoted.download()
  let out = owo
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
