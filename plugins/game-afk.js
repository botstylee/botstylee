var handler = async (m, {
	conn,
	text
}) => {
	try {
		var users = global.db.data.users[m.sender]
		users.afk = +new Date
		users.afkReason = text
		users.afkObj = m
		var tag = m.sender.split`@` [0]
		return conn.reply(m.chat, `*🚩 @${tag} is now AFK!*`, m, {
			mentions: [m.sender]
		})
	} catch (e) {
		conn.reply(m.chat, 'error', m)
		log(e)
	}
}
handler.help = ['afk']
handler.command = ['afk']
handler.tags = ['main']
export default handler