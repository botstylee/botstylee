var {
	webp2png
} = require('../../lib/webp2mp4.cjs');
var handler = async (m, {
	conn,
	text,
	usedPrefix,
	command,
	isBotAdmin,
	isAdmin,
	isOwner
}) => {
	var q = m.quoted ? m.quoted : m
	var mime = (q.msg || q).mimetype || q.mediaType || ''
	if (!/webp|image/g.test(mime)) throw 'kirim gambar/sticker atau reply gambar/sticker dengan caption #setpp or #setppgroup'
	var img = await q.download?.()
	if (!img) throw 'kirim gambar/sticker atau reply gambar/sticker dengan caption #setpp or #setppgroup'
	var buffer = img
	if (/webp/g.test(mime)) buffer = await getbuffer(await webp2png(img))
	if (m.isGroup && /group/.test(command)) {
		if (isBotAdmin) {
			if (isAdmin) {
				try {
					var c = await conn.updateProfilePicture(m.chat, buffer)
					m.reply('sukses atmin')
				} catch (e) {
					throw "can't update profile picture group"
				}
			}
		}
	} else {
		if (!isOwner) throw 'kamu bukan owner bot'
		try {
			var c = await conn.updateProfilePicture(conn.user.jid, buffer)
			m.reply('sukses atmin')
		} catch (e) {
			throw "can't update profile picture bot"
		}
	}
}
handler.tags = ['group']
handler.command = handler.help = ['setpp','setppgroup']
module.exports = handler