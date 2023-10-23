var {
	areJidsSameUser
} = require('@adiwajshing/baileys')
var handler = async (m, {
	conn,
	participants
}) => {
	var users = m.mentionedJid.filter(u => !areJidsSameUser(u, conn.user.id))
	var user = m.mentionedJid && m.mentionedJid[0]
	await conn.groupParticipantsUpdate(m.chat, [user], 'demote')

	m.reply('Succes')

}
handler.help = ['demote @tag']
handler.tags = ['group']
handler.command = /^(demote)$/i

handler.admin = true
handler.group = true
handler.botAdmin = true

module.exports = handler