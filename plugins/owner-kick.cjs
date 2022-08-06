var {
	areJidsSameUser
} = require('@adiwajshing/baileys');
var handler = async (m, {
	conn,
	participants
}) => {
	var users = m.mentionedJid.filter(u => !areJidsSameUser(u, conn.user.id))
	console.log(users)
	if (!users) return m.reply("tag orangnya dong bang")
	var kickedUser = []
	for (var user of users)
		if (user.endsWith('@s.whatsapp.net') && !(participants.find(v => areJidsSameUser(v.id, user)) || {
				admin: true
			}).admin) {
			var res = await conn.groupParticipantsUpdate(m.chat, [user], 'remove')
			kickedUser.concat(res)
			await delay(1 * 1000)
		}
	m.reply(`Succes kick ${kickedUser.map(v => '@' + v.split('@')[0])}`, null, {
		mentions: kickedUser
	})

}
handler.help = ['kick', '-'].map(v => 'o' + v + ' @user')
handler.tags = ['owner']
handler.command = /^(okick|o-)$/i

handler.owner = true
handler.group = true
handler.botAdmin = true

module.exports = handler

var delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))