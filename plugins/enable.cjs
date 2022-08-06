var handler = async (m, {
	conn,
	usedPrefix,
	command,
	args,
	isOwner,
	isAdmin,
	isROwner
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
			break
		case 'detect':
			if (!m.isGroup) {
				if (!isOwner) {
					global.dfail('group', m, conn)
					throw false
				}
			} else if (!isAdmin) {
				global.dfail('admin', m, conn)
				throw false
			}
			if (chat.detect && isEnable) {
				throw "detect telah aktif di chat ini"
			} else if (!chat.detect && isEnable == false) {
				throw "detect belum aktif di chat ini"
			} else {
				chat.detect = isEnable
			}
			break
		case 'delete':
		case 'antidelete':
			if (m.isGroup) {
				if (!(isAdmin || isOwner)) {
					global.dfail('admin', m, conn)
					throw false
				}
			}
			if (chat.delete && isEnable) {
				throw "delete telah aktif di chat ini"
			} else if (!chat.delete && isEnable == false) {
				throw "delete belum aktif di chat ini"
			} else {
				chat.delete = isEnable
			}
			break
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
			break
		case 'restrict':
			isAll = true
			if (!isROwner) {
				global.dfail('rowner', m, conn)
				throw false
			}
			if (bot.restrict && isEnable) {
				throw "restrict telah aktif pada bot ini."
			} else if (!bot.restrict && isEnable == false) {
				throw "restrict belum aktif pada bot ini."
			} else {
				bot.restrict = isEnable
			}
			break
		case 'pconly':
		case 'onlypc':
		case 'pc':
			isAll = true
			if (!isROwner) {
				global.dfail('rowner', m, conn)
				throw false
			}
			if (bot.pconly && isEnable) {
				throw "pconly telah aktif pada bot ini."
			} else if (!bot.pconly && isEnable == false) {
				throw "pconly belum aktif pada bot ini."
			} else {
				bot.pconly = isEnable
			}
			break
		case 'autosticker':
		case 'autostick':
		case 'autostik':
			if (m.isGroup) {
				if (!(isAdmin || isOwner)) {
					global.dfail('admin', m, conn)
					throw false
				}
			}
			if (chat.stiker && isEnable) {
				throw "autostiker telah aktif di chat ini"
			} else if (!chat.stiker && isEnable == false) {
				throw "autostiker belum aktif di chat ini"
			} else {
				chat.stiker = isEnable
			}
			break
		case 'autolevelup':
			isUser = true
			if (user.autolevelup && isEnable) {
				throw "autolevelup telah aktif"
			} else if (!user.autolevelup && isEnable == false) {
				throw "autolevelup belum aktif"
			} else {
				user.autolevelup = isEnable
			}
			break
			case 'simi':
			case 'simsimi':
			if (m.isGroup) {
				if (!(isAdmin || isOwner)) {
					global.dfail('admin', m, conn)
					throw false
				}
			}
			if (chat.simi && isEnable) {
				throw "simsimi telah aktif di chat ini"
			} else if (!chat.simi && isEnable == false) {
				throw "simsimi belum aktif di chat ini"
			} else {
				chat.simi = isEnable
			}
			break
		default:
			if (!/[01]/.test(command)) return m.reply(`
List option:
| welcome
| detect
| delete
| public
| restrict
| simi
| pconly
| autosticker
| autolevelup
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