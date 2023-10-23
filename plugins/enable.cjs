var handler = async (m, {
	conn,
	usedPrefix,
	command,
	args,
	isOwner,
	isAdmin,
	isROwner,
	isPrems
}) => {
	var isEnable = /true|enable|(turn)?on|1/i.test(command)
	var chat = db.data.chats[m.chat]
	var user = db.data.users[m.sender]
	var bot = db.data.settings[conn.user.jid]
	var type = (args[0] || '').toLowerCase()
	log(isEnable)
	var isAll = false
	var isUser = false
	switch (type) {
		case 'welcome':
			if (!m.isGroup) {
				if (!isOwner) {
					global.dfail('group', m, conn)
					throw false
				}
			} else if (!isAdmin) {
				global.dfail('admin', m, conn)
				throw false
			}
			if (chat.welcome && isEnable) {
				throw "welcome telah aktif di chat ini"
			} else if (!chat.welcome && isEnable == false) {
				throw "welcome belum aktif di chat ini"
			} else {
				chat.welcome = isEnable
			}
			break;
		case 'public':
			isAll = true
			if (!isROwner) {
				global.dfail('rowner', m, conn)
				throw false
			}
			if (!bot.self && isEnable) {
				throw "public telah diaktifkan pada bot ini."
			} else if (bot.self && isEnable == false) {
				throw "public telah matikan pada bot ini."
			} else {
				bot.self = !isEnable
			}
			break;
		default:
			if (!/[01]/.test(command)) return m.reply(`
List option:
| welcome
| public
Contoh:
${usedPrefix}enable welcome
${usedPrefix}disable welcome
`.trim())
			throw false
			break
	}
	m.reply(`
*${type}* berhasil di *${isEnable ? 'nyala' : 'mati'}kan* ${isAll ? 'untuk bot ini' : isUser ? '' : 'untuk chat ini'}
`.trim())
}
handler.help = ['en', 'dis'].map(v => v + 'able *option*')
handler.tags = ['group', 'owner']
handler.command = /^((en|dis)able|(tru|fals)e|(turn)?o(n|ff)|[01])$/i

module.exports = handler