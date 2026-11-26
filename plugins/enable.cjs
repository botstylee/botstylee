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
	var type = (args[0] || '').toLowerCase()
	var isAll = false
	var isUser = false

	// ✅ Pastikan db.data.chats[m.chat] ada
	if (!db.data.chats) db.data.chats = {}
	if (!db.data.chats[m.chat]) db.data.chats[m.chat] = {}
	var chat = db.data.chats[m.chat]

	// ✅ Pastikan db.data.settings ada
	if (!db.data.settings) db.data.settings = {}
	if (!db.data.settings[conn.user.jid]) db.data.settings[conn.user.jid] = {}
	var bot = db.data.settings[conn.user.jid]

	// ✅ Pastikan db.data.users[m.sender] ada
	if (!db.data.users) db.data.users = {}
	if (!db.data.users[m.sender]) db.data.users[m.sender] = {}
	var user = db.data.users[m.sender]

	console.log('[enable]', { type, isEnable, chat: m.chat })

	switch (type) {
		case 'welcome':
			if (!m.isGroup) {
				if (!isOwner) { global.dfail('group', m, conn); throw false }
			} else if (!isAdmin) {
				global.dfail('admin', m, conn); throw false
			}
			if (chat.welcome && isEnable) throw "welcome telah aktif di chat ini"
			if (!chat.welcome && isEnable === false) throw "welcome belum aktif di chat ini"
			chat.welcome = isEnable
			break

		case 'autosticker':
		case 'autostick':
		case 'autostik':
			if (m.isGroup && !(isAdmin || isOwner)) { global.dfail('admin', m, conn); throw false }
			if (chat.stiker && isEnable) throw "autostiker telah aktif di chat ini"
			if (!chat.stiker && isEnable === false) throw "autostiker belum aktif di chat ini"
			chat.stiker = isEnable
			break

		case 'simi':
		case 'simsimi':
			if (m.isGroup && !(isAdmin || isOwner)) { global.dfail('admin', m, conn); throw false }
			if (chat.simi && isEnable) throw "simsimi telah aktif di chat ini"
			if (!chat.simi && isEnable === false) throw "simsimi belum aktif di chat ini"
			chat.simi = isEnable
			break

		// ✅ TAMBAHAN: antilink
		case 'antilink':
			if (!m.isGroup) { global.dfail('group', m, conn); throw false }
			if (!(isAdmin || isOwner)) { global.dfail('admin', m, conn); throw false }
			if (chat.antiLink && isEnable) throw "antiLink telah aktif di chat ini"
			if (!chat.antiLink && isEnable === false) throw "antiLink belum aktif di chat ini"
			chat.antiLink = isEnable
			break

		// ✅ TAMBAHAN: antiswgrup
		case 'antiswgrup':
		case 'antisw':
		case 'antiswgroup':
			if (!m.isGroup) { global.dfail('group', m, conn); throw false }
			if (!(isAdmin || isOwner)) { global.dfail('admin', m, conn); throw false }
			if (chat.antiSwGrup && isEnable) throw "antiSwGrup telah aktif di chat ini"
			if (!chat.antiSwGrup && isEnable === false) throw "antiSwGrup belum aktif di chat ini"
			chat.antiSwGrup = isEnable
			break

		case 'public':
			isAll = true
			if (!isROwner) { global.dfail('rowner', m, conn); throw false }
			if (!bot.self && isEnable) throw "public telah diaktifkan pada bot ini."
			if (bot.self && isEnable === false) throw "public telah dimatikan pada bot ini."
			bot.self = !isEnable
			break

		default:
			if (!/[01]/.test(command)) return m.reply(`
List option:
| welcome
| autosticker
| simi
| antilink
| antiswgrup
| public
Contoh:
${usedPrefix}enable welcome
${usedPrefix}disable welcome
${usedPrefix}enable antilink
${usedPrefix}enable antiswgrup
`.trim())
			throw false
	}

	m.reply(`
*${type}* berhasil di *${isEnable ? 'nyala' : 'mati'}kan* ${isAll ? 'untuk bot ini' : isUser ? '' : 'untuk chat ini'}
`.trim())
}
handler.help = ['en', 'dis'].map(v => v + 'able *option*')
handler.tags = ['group', 'owner']
handler.command = /^((en|dis)able|(tru|fals)e|(turn)?o(n|ff)|[01])$/i

module.exports = handler
