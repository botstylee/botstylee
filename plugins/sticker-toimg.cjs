var {
	webp2png
} = require('../lib/webp2mp4.cjs');

var handler = async (m, {
	conn,
	usedPrefix,
	command
}) => {
	var notStickerMessage = `Reply sticker with command *${usedPrefix + command}*`
	if (!m.quoted) throw notStickerMessage
	var q = m.quoted || m
	var mime = q.mediaType || ''
	if (!/sticker/.test(mime)) throw notStickerMessage

	var media = await q.download()
	var out = await webp2png(media).catch(_ => null) || Buffer.alloc(0)

	// Cek kalau hasil convert kosong, jangan kirim apa-apa
	if (out.length === 0) {
		return conn.reply(m.chat, 'Gagal convert sticker ke gambar.', m)
	}

	// Kirim sebagai IMAGE, bukan document
	await conn.sendMessage(m.chat, {
		image: out,
		caption: '*DONE*'
	}, { quoted: m })
}

handler.help = ['toimg (reply)']
handler.tags = ['sticker']
handler.command = ['toimg', 'toimg2']

module.exports = handler
