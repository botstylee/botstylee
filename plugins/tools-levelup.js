import levelling from '../lib/levelling.js'

// ✅ Variabel style yang sebelumnya tidak terdefinisi
var sa = '╭───────'
var sb = '╰───────'
var kki = '[ Level Up ]'
var kka = ''
var gy = '│'

var handler = async (m, {
	conn,
	usedPrefix
}) => {
	var pp = 'https://telegra.ph/file/e891ab641d5d71c70d938.png'
	var who = m.sender
	var name = conn.getName(m.sender)
	var discriminator = who.substring(9, 13)
	
	try {
		pp = await conn.profilePictureUrl(who, 'image')
	} catch (e) {} finally {
		// ✅ Fallback db dan multiplier agar tidak crash
		var user = (global.db?.data?.users?.[m.sender]) || {}
		if (!user.level) user.level = 0
		if (!user.exp) user.exp = 0
		if (!user.limit) user.limit = 0
		if (!user.coin) user.coin = 0
		if (!user.mp) user.mp = 0
		if (!user.ruby) user.ruby = 0

		var multiplier = global.multiplier || 1

		var users = Object.entries(global.db?.data?.users || {}).map(([key, value]) => {
			return {
				...value,
				jid: key
			}
		})
		var sortedLevel = users.map(toNumber('level')).sort(sort('level'))
		var usersLevel = sortedLevel.map(enumGetKey)
		
		var {
			min,
			xp,
			max
		} = levelling.xpRange(user.level, multiplier)
		
		if (!levelling.canLevelUp(user.level, user.exp, multiplier)) {
			await conn.reply(m.chat, `${sa}${kki} To Level Up ${kka}\n${gy} Nama: *${name}*\n${gy} Level: *${user.level}*\n${gy} Exp: ( *${user.exp - min}/${xp}* )\n${gy} Kurang *${max - user.exp}* Exp lagi levelup!\n${sb}`.trim(), m)
			return // ✅ Tambah return agar berhenti jika belum bisa level up
		}
		
		var before = user.level * 1
		
		function generateRandomNumber(min, max) {
			return Math.floor(Math.random() * (max - min + 1)) + min;
		}
		
		while (levelling.canLevelUp(user.level, user.exp, multiplier)) user.level++
		
		if (before !== user.level) {
			if (user.level < 50) {
				user.exp += generateRandomNumber(50, 1000)
			} else if (user.level > 50 && user.level < 100) {
				user.exp += generateRandomNumber(500, 3000)
			} else {
				user.exp += generateRandomNumber(3000, 10000)
			}
			
			if (user.level % 30 === 0) {
				user.coin += Math.floor(user.level / 30) * 5
				user.limit += 3 + (Math.floor(user.level / 30) * 2)
				user.mp += 2000 + (Math.floor(user.level / 30) * 3000)
				conn.reply(m.chat, `${sa}${kki} Level Up ${kka}\n${gy} Nama: *${name}*\n${gy} Level sebelumnya: *${before}*\n${gy} Level sekarang: *${user.level}*\n${sb}\n\n${sa}${kki} Bonus Extra ${kka}\n${gy} limit: + *${3 + (Math.floor(user.level / 30) * 2)}*\n${gy} coin: + *${Math.floor(user.level / 30) * 5}*\n${gy} mp: + *${2000 + (Math.floor(user.level / 30) * 3000)}*\n${sb}\n\nBanyak berinteraksi dengan *BOT* semakin mudah naik level!`, m)
			} else if (user.level % 60 === 0) {
				user.ruby += Math.floor(user.level / 60) * 1
				user.coin += Math.floor(user.level / 60) * 8
				user.limit += 8 + (Math.floor(user.level / 60) * 4)
				user.mp += 2000 + (Math.floor(user.level / 60) * 5000)
				conn.reply(m.chat, `${sa}${kki} Level Up ${kka}\n${gy} Nama: *${name}*\n${gy} Level sebelumnya: *${before}*\n${gy} Level sekarang: *${user.level}*\n${sb}\n\n${sa}${kki} Bonus Extra ${kka}\n${gy} limit: + *${8 + (Math.floor(user.level / 60) * 4)}*\n${gy} ruby: + *${Math.floor(user.level / 60) * 1}*\n${gy} coin: + *${Math.floor(user.level / 60) * 8}*\n${gy} mp: + *${2000 + (Math.floor(user.level / 60) * 5000)}*\n${sb}\n\nBanyak berinteraksi dengan *BOT* semakin mudah naik level!`, m)
			} else {
				user.limit += 3
				user.mp += 1000 + (user.level * 100)
				conn.reply(m.chat, `${sa}${kki} Level Up ${kka}\n${gy} Nama: *${name}*\n${gy} Level sebelumnya: *${before}*\n${gy} Level sekarang: *${user.level}*\n${sb}\n\n${sa}${kki} Bonus ${kka}\n${gy} limit: + *3*\n${gy} mp: + *${1000 + (user.level * 100)}*\n${sb}\n\nBanyak berinteraksi dengan *BOT* semakin mudah naik level!\n\n! [ note ]\nDi Level tertentu kamu akan mendapatkan bonus extra!`, m)
			}
		}
	}
}

handler.help = ['levelup']
handler.tags = ['tools']
handler.command = /^levelup$/i

export default handler

function sort(property, ascending = true) {
	if (property) return (...args) => args[ascending & 1][property] - args[!ascending & 1][property]
	else return (...args) => args[ascending & 1] - args[!ascending & 1]
}

function toNumber(property, _default = 0) {
	if (property) return (a, i, b) => {
		return {
			...b[i],
			[property]: a[property] === undefined ? _default : a[property]
		}
	}
	else return a => a === undefined ? _default : a
}

function enumGetKey(a) {
	return a.jid
}
