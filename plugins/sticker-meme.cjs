var {
	sticker
} = require('../lib/sticker.cjs');
var uploadFile = require('../lib/uploadFile.cjs');
var uploadImage = require('../lib/uploadImage.cjs');
var {
	webp2png
} = require('../lib/webp2mp4.cjs');

var handler = async (m, {
	conn,
	args,
	usedPrefix,
	command,
	text
}) => {
	var stiker = false
	try {
		var q = m.quoted ? m.quoted : m
		var mime = (q.msg || q).mimetype || q.mediaType || ''
		var [text1, text2] = text.split('|')
		if (!text1) text1 = '-'
		if (!text2) text2 = ''
		if (/webp|image/g.test(mime)) {
			var img = await q.download?.()
			if (!img) return m.reply(`balas gambar/video/stiker dengan perintah\n\ncontoh: ${usedPrefix + command} text1|text2`)
			var out
			try {
				if (/webp/g.test(mime)) out = await webp2png(img)
				else if (/image/g.test(mime)) out = await uploadImage(img)
				if (typeof out !== 'string') out = await uploadImage(img)
				var meme
				meme = await fetch(API('https://api.memegen.link', `/images/custom/${encodeURIComponent(text1)}/${encodeURIComponent(text2)}.png`, {
					background: out
				}))
				meme = (await meme.arrayBuffer()).toBuffer()
				stiker = await sticker(meme, packname, author)
			} catch (e) {
				console.error(e)
			} finally {
				if (!stiker) stiker = await sticker(meme, packname, author)
			}
		}
	} catch (e) {
		console.error(e)
		if (!stiker) stiker = e
	} finally {
		if (stiker) conn.sendFile(m.chat, stiker, 'sticker.webp', '', m)
		else throw 'Conversion failed'
	}
}
handler.help = ['memegen *teks|teks*']
handler.tags = ['sticker']
handler.command = /^memegen$/i
handler.limit = true
module.exports = handler

var isUrl = (text) => {
	return text.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)(jpe?g|gif|png)/, 'gi'))
}