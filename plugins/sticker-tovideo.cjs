var {
	webp2mp4
} = require('../lib/webp2mp4.cjs')
var {
	ffmpeg
} = require('../lib/converter.cjs')

var handler = async (m, {
	conn
}) => {
	if (!m.quoted) throw 'Reply sticker atau audio!'
	var mime = m.quoted.mimetype || ''
	if (!/webp|audio/.test(mime)) throw 'Reply sticker atau audio!'

	try {
		await m.reply('tunggu sebentar...')
		var media = await m.quoted.download()
		var out = Buffer.alloc(0)

		if (/webp/.test(mime)) {
			out = await webp2mp4(media)
		} else if (/audio/.test(mime)) {
			// Untuk audio, kita butuh video background statis.
			// Filter 'color' harus punya sumber video (misal 'color=c=black:s=640x480:d=...').
			out = await ffmpeg(media, [
				'-f', 'lavfi',
				'-i', 'color=c=black:s=640x480:d=1',
				'-i', media,
				'-shortest',
				'-c:v', 'libx264',
				'-c:a', 'aac',
				'-pix_fmt', 'yuv420p'
			], 'mp3', 'mp4')
		}

		if (!out || out.length === 0) {
			return conn.reply(m.chat, 'Gagal mengonversi media.', m)
		}

		await conn.sendMessage(m.chat, {
			video: out,
			mimetype: 'video/mp4',
			caption: 'nih bruh'
		}, { quoted: m })

	} catch (e) {
		console.error('[tovideo] Error:', e)
		await conn.reply(m.chat, 'Gagal memproses: ' + (e.message || e), m)
	}
}

handler.help = ['tovideo']
handler.tags = ['sticker']
handler.command = ['tovideo']

module.exports = handler
