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
	// === [BOTSTYLEE] Created by Benniismael ===
	// === https://github.com/botstylee/botstylee ===
	// === Dilarang menghapus atau mengklaim sebagai milik sendiri ===
	const _sig = 'Benniismael@botstylee'

	var isEnable = /true|enable|(turn)?on|1/i.test(command)
	var type = (args[0] || '').toLowerCase()
	var isAll = false
	var isUser = false

	if (!db.data.chats) db.data.chats = {}
	if (!db.data.chats[m.chat]) db.data.chats[m.chat] = {}
	var chat = db.data.chats[m.chat]

	if (!db.data.settings) db.data.settings = {}
	if (!db.data.settings[conn.user.jid]) db.data.settings[conn.user.jid] = {}
	var bot = db.data.settings[conn.user.jid]

	if (!db.data.users) db.data.users = {}
	if (!db.data.users[m.sender]) db.data.users[m.sender] = {}
	var user = db.data.users[m.sender]

	console.log('[enable]', { type, isEnable, chat: m.chat })

	switch (type) {
		case 'welcome':
			if (!m.isGroup) { if (!isOwner) { global.dfail('group', m, conn); throw false } }
			else if (!isAdmin) { global.dfail('admin', m, conn); throw false }
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

		case 'antilink':
			if (!m.isGroup) { global.dfail('group', m, conn); throw false }
			if (!(isAdmin || isOwner)) { global.dfail('admin', m, conn); throw false }
			if (chat.antiLink && isEnable) throw "antiLink telah aktif di chat ini"
			if (!chat.antiLink && isEnable === false) throw "antiLink belum aktif di chat ini"
			chat.antiLink = isEnable
			break

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

		// === FITUR KEAMANAN TANPA KICK ===
		case 'antiflood':
			if (!m.isGroup) { global.dfail('group', m, conn); throw false }
			if (!(isAdmin || isOwner)) { global.dfail('admin', m, conn); throw false }
			if (chat.antiFlood && isEnable) throw "antiFlood telah aktif di chat ini"
			if (!chat.antiFlood && isEnable === false) throw "antiFlood belum aktif di chat ini"
			chat.antiFlood = isEnable
			break

		case 'antimedia':
			if (!m.isGroup) { global.dfail('group', m, conn); throw false }
			if (!(isAdmin || isOwner)) { global.dfail('admin', m, conn); throw false }
			if (chat.antiMedia && isEnable) throw "antiMedia telah aktif di chat ini"
			if (!chat.antiMedia && isEnable === false) throw "antiMedia belum aktif di chat ini"
			chat.antiMedia = isEnable
			break

		case 'antitagsw':
			if (!m.isGroup) { global.dfail('group', m, conn); throw false }
			if (!(isAdmin || isOwner)) { global.dfail('admin', m, conn); throw false }
			if (chat.antiTagSW && isEnable) throw "antiTagSW telah aktif di chat ini"
			if (!chat.antiTagSW && isEnable === false) throw "antiTagSW belum aktif di chat ini"
			chat.antiTagSW = isEnable
			break

		// === FITUR KEAMANAN DENGAN KICK ===
		case 'antikudeta':
			if (!m.isGroup) { global.dfail('group', m, conn); throw false }
			if (!(isAdmin || isOwner)) { global.dfail('admin', m, conn); throw false }
			if (!isEnable && !isOwner) throw "Hanya owner yang bisa mematikan fitur antiKudeta"
			if (chat.antiKudeta && isEnable) throw "antiKudeta telah aktif di chat ini"
			if (!chat.antiKudeta && isEnable === false) throw "antiKudeta belum aktif di chat ini"
			chat.antiKudeta = isEnable
			break

		case 'antihidetag':
			if (!m.isGroup) { global.dfail('group', m, conn); throw false }
			if (!(isAdmin || isOwner)) { global.dfail('admin', m, conn); throw false }
			if (chat.antiHidetag && isEnable) throw "antiHidetag telah aktif di chat ini"
			if (!chat.antiHidetag && isEnable === false) throw "antiHidetag belum aktif di chat ini"
			chat.antiHidetag = isEnable
			break

		case 'antifakeadmin':
			if (!m.isGroup) { global.dfail('group', m, conn); throw false }
			if (!(isAdmin || isOwner)) { global.dfail('admin', m, conn); throw false }
			if (chat.antiFakeAdmin && isEnable) throw "antiFakeAdmin telah aktif di chat ini"
			if (!chat.antiFakeAdmin && isEnable === false) throw "antiFakeAdmin belum aktif di chat ini"
			chat.antiFakeAdmin = isEnable
			break

		case 'antiphishing':
			if (!m.isGroup) { global.dfail('group', m, conn); throw false }
			if (!(isAdmin || isOwner)) { global.dfail('admin', m, conn); throw false }
			if (chat.antiPhishing && isEnable) throw "antiPhishing telah aktif di chat ini"
			if (!chat.antiPhishing && isEnable === false) throw "antiPhishing belum aktif di chat ini"
			chat.antiPhishing = isEnable
			break

		case 'antiviruslink':
			if (!m.isGroup) { global.dfail('group', m, conn); throw false }
			if (!(isAdmin || isOwner)) { global.dfail('admin', m, conn); throw false }
			if (chat.antiVirusLink && isEnable) throw "antiVirusLink telah aktif di chat ini"
			if (!chat.antiVirusLink && isEnable === false) throw "antiVirusLink belum aktif di chat ini"
			chat.antiVirusLink = isEnable
			break

		case 'antispamcall':
			if (!m.isGroup) { global.dfail('group', m, conn); throw false }
			if (!(isAdmin || isOwner)) { global.dfail('admin', m, conn); throw false }
			if (chat.antiSpamCall && isEnable) throw "antiSpamCall telah aktif di chat ini"
			if (!chat.antiSpamCall && isEnable === false) throw "antiSpamCall belum aktif di chat ini"
			chat.antiSpamCall = isEnable
			break

		case 'antiforceclose':
			if (!m.isGroup) { global.dfail('group', m, conn); throw false }
			if (!(isAdmin || isOwner)) { global.dfail('admin', m, conn); throw false }
			if (chat.antiForceClose && isEnable) throw "antiForceClose telah aktif di chat ini"
			if (!chat.antiForceClose && isEnable === false) throw "antiForceClose belum aktif di chat ini"
			chat.antiForceClose = isEnable
			break

		case 'antimetaai':
			if (!m.isGroup) { global.dfail('group', m, conn); throw false }
			if (!(isAdmin || isOwner)) { global.dfail('admin', m, conn); throw false }
			if (chat.antiMetaAI && isEnable) throw "antiMetaAI telah aktif di chat ini"
			if (!chat.antiMetaAI && isEnable === false) throw "antiMetaAI belum aktif di chat ini"
			chat.antiMetaAI = isEnable
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
| antiflood
| antimedia
| antitagsw
| antikudeta (owner-only disable)
| antihidetag
| antifakeadmin
| antiphishing
| antiviruslink
| antispamcall
| antiforceclose
| antimetaai
Contoh:
${usedPrefix}enable welcome
${usedPrefix}disable welcome
`.trim())
			throw false
	}

	m.reply(`
*${type}* berhasil di *${isEnable ? 'nyala' : 'mati'}kan* ${isAll ? 'untuk bot ini' : isUser ? '' : 'untuk chat ini'}

_Fitur keamanan oleh Benniismael_
`.trim())
}
handler.help = ['en', 'dis'].map(v => v + 'able *option*')
handler.tags = ['group', 'owner']
handler.command = /^((en|dis)able|(tru|fals)e|(turn)?o(n|ff)|[01])$/i

module.exports = handler
