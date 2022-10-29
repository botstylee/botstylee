var {
	sticker
} = require('../lib/sticker.cjs');
var handler = m => m
handler.all = async function(m) {
	var chat = db.data.chats[m.chat]
	var user = db.data.users[m.sender]

	if (chat.stiker && !chat.isBanned && !user.banned && !m.isBaileys) {
		var q = m
		var stiker = false
		var mime = (q.msg || q).mimetype || ''
		if (/webp/.test(mime)) return
		if (/image/.test(mime)) {
			var img = await q.download()
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