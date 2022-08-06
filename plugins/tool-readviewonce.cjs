var {
	downloadContentFromMessage
} =  require('@adiwajshing/baileys');
var handler = async (m, {
	conn
}) => {
	if (!m.quoted) throw 'where\'s message?'
	if (m.quoted.mtype !== 'viewOnceMessage') throw 'Itu bukan pesan viewOnce'
	var buffer = await m.quoted.download()
	var media = m.quoted.mediaMessage[m.quoted.mediaType]
	conn.sendFile(m.chat, buffer, /video/.test(media.mimetype) ? 'video.mp4' : 'image.jpg', media.caption || '', m)
}
handler.help = ['readviewonce']
handler.tags = ['tools']
handler.command = /^readviewonce/i

module.exports = handler
