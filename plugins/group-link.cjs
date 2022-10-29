var {
	areJidsSameUser
} = require('@adiwajshing/baileys');
var handler = async (m, {
	conn,
	args
}) => {
	var group = m.chat
	if (/^[0-9]{5,16}-?[0-9]+@g\.us$/.test(args[0])) group = args[0]
	if (!/^[0-9]{5,16}-?[0-9]+@g\.us$/.test(group)) throw 'Hanya bisa dibuka di grup'
	var groupMetadata = await conn.groupMetadata(group)
	if (!groupMetadata) throw 'groupMetadata is undefined :\\'
	if (!('participants' in groupMetadata)) throw 'participants is not defined :('
	var me = groupMetadata.participants.find(user => areJidsSameUser(user.id, conn.user.id))
	if (!me) throw 'Aku tidak ada di grup itu :('
	if (!me.admin) throw 'Aku bukan admin T_T'
	m.reply('https://chat.whatsapp.com/' + await conn.groupInviteCode(group))
}
handler.help = ['linkgroup']
handler.tags = ['group']
handler.command = /^link(gro?up)?$/i
handler.group = true
handler.botAdmin = true
module.exports = handler