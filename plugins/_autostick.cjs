const { sticker } = require('../lib/sticker.cjs')

const handler = m => m
handler.all = async function (m) {
	if (!m?.message || m.isBaileys || !m.chat || !m.sender) return

	const chats = db.data?.chats
	const users = db.data?.users
	const chat = chats?.[m.chat]
	const user = users?.[m.sender]
	if (!chat?.stiker || chat.isBanned || user?.banned) return

	const mime = (m.msg || m).mimetype || m.mediaType || ''
	if (!/^image\//i.test(mime)) return

	try {
		const image = await m.download?.()
		if (!image) return
		const stickerBuffer = await sticker(image, false, packname, author)
		if (stickerBuffer) await this.sendFile(m.chat, stickerBuffer, '', '', m)
	} catch (error) {
		this.logger?.error?.({ err: error, chat: m.chat }, 'Autosticker gagal memproses gambar')
	}
}

module.exports = handler
