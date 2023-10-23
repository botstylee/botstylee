var {
	sticker
} = require('../../lib/sticker.cjs');
var uploadFile = require('../../lib/uploadFile.cjs');
var uploadImage = require('../../lib/uploadImage.cjs');
var {
	webp2png
} = require('../../lib/webp2mp4.cjs');

var handler = async (m, {
	conn,
	text
}) => {
	var stiker = false
	try {
		var [packname, ...author] = text.split('|')
		author = (author || []).join('|')
		var q = m.quoted ? m.quoted : m
		var mime = (q.msg || q).mimetype || q.mediaType || ''
		if (/webp|image|video/g.test(mime)) {
			if (/video/g.test(mime))
				if ((q.msg || q).seconds > 11) return m.reply('Maksimal 10 detik!')
			var img = await q.download?.()
			if (!img) return m.reply(`balas gambar/video/stiker dengan perintah ${usedPrefix + command}`)
			var out
			try {
				if (/webp/g.test(mime)) out = await webp2png(img)
				else if (/video/g.test(mime)) out = await uploadFile(img)
				if (!out || typeof out !== 'string') out = await uploadImage(img)
				stiker = await sticker(out, packname || '', author || '')
			} catch (e) {
				console.error(e)
			} finally {
				if (!stiker) stiker = await sticker(img, packname || '', author || '')
			}
		}
	} catch (e) {
		console.error(e)
		if (Buffer.isBuffer(e)) stiker = e
	} finally {
		if (stiker) conn.sendFile(m.chat, stiker, 'wm.webp', '', m, false, {
			asSticker: true
		})
		else throw 'Conversion failed'
	}
}
handler.help = ['wm *packname|author*']
handler.tags = ['sticker']
handler.command = ['wm', 'swm']

module.exports = handler