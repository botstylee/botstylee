var {
	webp2png
} = require('../../lib/webp2mp4.cjs');
var handler = async (m, {
	conn,
	usedPrefix,
	command
}) => {
	var notStickerMessage = `Reply sticker with command *${usedPrefix + command}*`
	if (!m.quoted) throw notStickerMessage
	var q = m.quoted || m
	var mime = q.mediaType || ''
	log(mime)
	if (!/sticker/.test(mime)) throw notStickerMessage
	var media = await q.download()
	var out = await webp2png(media).catch(_ => null) || Buffer.alloc(0)
	await conn.sendFile(m.chat, out, 'out.png', '*DONE*', m)
}
handler.help = ['toimg (reply)']
handler.tags = ['sticker']
handler.command = ['toimg', 'toimg2']

module.exports = handler