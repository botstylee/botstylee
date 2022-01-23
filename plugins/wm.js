let { sticker } = require('../lib/sticker')
let uploadFile = require('../lib/uploadFile')
let uploadImage = require('../lib/uploadImage')
let { webp2png } = require('../lib/webp2mp4')

let handler = async (m, { conn, text }) => {
	let stiker = false
	try {
		if (!m.quoted) return m.reply('Reply stikernya')
		await m.reply('Loading...')
		let [packname, ...author] = text.split`|`
		author = (author || []).join`|`
		let q = m.quoted ? m.quoted : m
		let mime = m.quoted.mimetype || ''
		if (/webp/.test(mime)) {
			let img = await q.download()
			let out = await webp2png(img)
			if (!img) return m.reply(`Reply stiker dengan perintah ${usedPrefix + command} <packname>|<author>`)
			stiker = await sticker(0, out, packname || '', author || '')
		} else if (/image/.test(mime)) {
			let img = await q.download()
			let link = await uploadImage(img)
			if (!img) return m.reply(`Reply gambar dengan perintah ${usedPrefix + command} <packname>|<author>`)
			stiker = await sticker(0, link, packname || '', author || '')
		} else if (/video/.test(mime)) {
			if ((q.msg || q).seconds > 11) return m.reply('Maksimal 10 detik!')
			let img = await q.download()
			let link = await uploadFile(img)
			if (!img) return m.reply(`Reply video dengan perintah ${usedPrefix + command} <packname>|<author>`)
			stiker = await sticker(0, link, packname || '', author || '')
		}
	} finally {
		if (stiker) await conn.sendMessage(m.chat, stiker, 'stickerMessage', { quoted: m })
		//else return m.reply('Reply stikernya!')
	}
}

handler.help = ['wm <packname>|<author>']
handler.tags = ['sticker']
handler.command = /^wm$/i

module.exports = handler
