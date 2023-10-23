var {
	areJidsSameUser
} = require('@adiwajshing/baileys')
var handler = async (m, {
	conn,
	participants
}) => {
	var users = m.mentionedJid.filter(u => !areJidsSameUser(u, conn.user.id))
	var promoteUser = []
	for (var user of users)
		if (user.endsWith('@s.whatsapp.net') && !(participants.find(v => areJidsSameUser(v.id, user)) || {
				admin: true
			}).admin) {
			var res = await conn.groupParticipantsUpdate(m.chat, [user], 'promote')
			await delay(1 * 1000)
		}
	m.reply('Succes')

}
handler.help = ['promote @tag']
handler.tags = ['group']
handler.command = /^(promote)$/i

handler.admin = true
handler.group = true
handler.botAdmin = true

module.exports = handler