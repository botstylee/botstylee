var {
	webp2png
} = require('../lib/webp2mp4.cjs');
var handler = async (m, {
	conn,
	isBotAdmin,
	isAdmin,
	isROwner,
	usedPrefix,
	command
}) => {
	var q = m.quoted ? m.quoted : m
	var mime = (q.msg || q).mimetype || q.mediaType || ''
	if (m.isGroup) {
		if (!isAdmin) throw 'Only admin can use this command'
		if (!isBotAdmin) throw 'jadiin admin dulu'
	}
	if (!(m.isGroup && isROwner)) throw
	if (/webp|image/g.test(mime)) {
		var img = await q.download?.()
		if (!img) return m.reply(`balas gambar/stiker dengan perintah ${usedPrefix+command}`)
		if (/webp/g.test(mime)) {
			var out = await webp2png(img)
			out = await getbuffer(out)
			await conn.updateProfilePictures(m.isGroup ? m.chat : conn.user.jid, out)
			m.reply('success change the profile picture ' + m.isGroup ? 'Group' : 'Bot')
		} else {
			await conn.updateProfilePictures(m.isGroup ? m.chat : conn.user.jid, img)
			m.reply('success change the profile picture ' + m.isGroup ? 'Group' : 'Bot')
		}
	}
}
handler.command = ['setpp']
handler.help = ['setpp']
handler.tags = ['group', 'owner']
module.exports = handler
