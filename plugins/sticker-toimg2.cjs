const {
	webp2png
} = require('../lib/webp2mp4.cjs');
let handler = async (m, {
	conn,
	usedPrefix,
	command
}) => {
	const notStickerMessage = `Reply sticker with command *${usedPrefix + command}*`
	if (!m.quoted) throw notStickerMessage
	const q = m.quoted || m
	let mime = q.mediaType || ''
	if (!/sticker/.test(mime)) throw notStickerMessage
	let media = await q.download()
	let out = await webp2png(media).catch(_ => null) || Buffer.alloc(0)
	await conn.sendFile(m.chat, out, 'out.png', '*DONE*', m)
}
handler.help = ['toimg2 (reply)']
handler.tags = ['sticker']
handler.command = ['toimg2']

module.exports = handler