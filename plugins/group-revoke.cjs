var handler = async (m, {
	conn,
	text,
	usedPrefix,
	command
}) => {
	var code = await conn.groupRevokeInvite(m.chat)
	conn.reply(m.chat, "New group code: https://chat.whatsapp.com/" + code, m)
}
handler.help = ['revoke']
handler.tags = ['group']
handler.command = /^revoke$/i
handler.group = true
handler.botAdmin = true
handler.admin = true
module.exports = handler