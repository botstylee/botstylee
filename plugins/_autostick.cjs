const {
	sticker
} = require('../lib/sticker.cjs');
let handler = m => m
handler.all = async function(m) {
	let chat = db.data.chats[m.chat]
	let user = db.data.users[m.sender]

	if (chat.stiker && !chat.isBanned && !user.banned && !m.isBaileys) {
		let q = m
		let stiker = false
		let mime = (q.msg || q).mimetype || ''
		if (/webp/.test(mime)) return
		if (/image/.test(mime)) {
			let img = await q.download()
			if (!img) return
			stiker = await sticker(img, false, packname, author)
		}
		if (stiker) {
			await this.sendFile(m.chat, stiker, '', '', m)
		}
	}
	return !0
}
module.exports = handler