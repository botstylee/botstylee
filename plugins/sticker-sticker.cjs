var { sticker } = require('../lib/sticker.cjs')
var uploadFile = require('../lib/uploadFile.cjs')
var uploadImage = require('../lib/uploadImage.cjs')
var { webp2png } = require('../lib/webp2mp4.cjs')

var handler = async (m, { conn, args = [], usedPrefix, command, text = '' }) => {
	var quoted = m.quoted || m
	var mime = (quoted.msg || quoted).mimetype || quoted.mediaType || ''
	var parts = text.split('|').map(value => value.trim())
	var packname = parts[0] || global.packname || 'Sticker'
	var author = parts[1] || global.author || ''
	var output

	if (/^(image|video|webp)\//i.test(mime)) {
		if (/^video\//i.test(mime) && Number((quoted.msg || quoted).seconds) > 10)
			return m.reply('Durasi video maksimal 10 detik.')
		var media = await quoted.download?.()
		if (!media) return m.reply(`Balas gambar/video/stiker dengan perintah ${usedPrefix + command}.`)

		try {
			if (/^image\/webp$/i.test(mime)) {
				try { output = await webp2png(media) } catch {}
			}
			if (!output && /^video\//i.test(mime)) {
				try { output = await uploadFile(media) } catch {}
			}
			if (!output) output = await uploadImage(media)
			output = await sticker(output, packname, author || `© ${await conn.getName(m.sender)}`)
		} catch (error) {
			console.error('Sticker conversion failed:', error)
			throw 'Gagal mengubah media menjadi sticker.'
		}
	} else {
		var source = args[0]
		if (!source) return m.reply(`Kirim atau balas gambar/video/stiker, atau berikan URL gambar.\nContoh: ${usedPrefix + command} https://example.com/image.jpg`)
		try {
			var url = new URL(source)
			if (!['http:', 'https:'].includes(url.protocol) || !/\.(jpe?g|png|gif|webp)$/i.test(url.pathname))
				return m.reply('URL tidak valid. Gunakan URL gambar dengan ekstensi JPG, PNG, GIF, atau WEBP.')
			output = await sticker(source, packname, author)
		} catch (error) {
			if (error instanceof TypeError) return m.reply('URL tidak valid.')
			throw error
		}
	}

	if (!output) throw 'Konversi sticker gagal.'
	return conn.sendFile(m.chat, output, 'sticker.webp', '', m)
}
handler.help = ['stiker (caption|reply media)', 'stiker *url*', 'stikergif (caption|reply media)', 'stikergif *url*']
handler.tags = ['sticker']
handler.command = /^s(tic?ker)?(gif)?$/i
module.exports = handler
