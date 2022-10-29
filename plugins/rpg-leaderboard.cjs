var {
	areJidsSameUser
} = require('@adiwajshing/baileys');

var leaderboards = [
	'level',
	'exp',
	'limit',
	'money',
	'iron',
	'gold',
	'diamond',
	'emerald',
	'trash',
	'potion',
	'petFood',
	'wood',
	'rock',
	'string',
	'common',
	'uncommon',
	'mythic',
	'legendary',
	'pet'
]
var handler = async (m, {
	conn,
	args,
	participants,
	usedPrefix,
	command
}) => {
	var users = Object.entries(db.data.users).map(([key, value]) => {
		return {
			...value,
			jid: key
		}
	})
	var leaderboard = leaderboards.filter(v => v && users.filter(user => user && user[v]).length)
	var type = (args[0] || '').toLowerCase()
	var getPage = (item) => Math.ceil((users.filter(user => user && user[item]).length) / 25)
	var wrong = `
Use format *${usedPrefix}${command} [type] [page]*
example *${usedPrefix}${command} money 1*

📍 Type list
${leaderboard.map(v => `
${rpg.emoticon(v)}${v}
`.trim()).join('\n')}
`.trim()
	if (!leaderboard.includes(type)) return m.reply(wrong)
	var page = isNumber(args[1]) ? Math.min(Math.max(parseInt(args[1]), 0), getPage(type)) : 0
	var sortedItem = users.map(toNumber(type)).sort(sort(type))
	var userItem = sortedItem.map(enumGetKey)
	// var len = args[0] && args[0].length > 0 ? Math.min(100, Math.max(parseInt(args[0]), 5)) : Math.min(5, sortedExp.length)
	var text = `
• *${rpg.emoticon(type)}${type} Leaderboard page ${page} of ${getPage(type)}* •
You: *${userItem.indexOf(m.sender) + 1}* of *${userItem.length}*

${sortedItem.slice(page * 25, page * 25 + 25).map((user, i) => `${i + 1}. ${participants.some(p => areJidsSameUser(user.jid, p.id)) ? `(${conn.getName(user.jid)}) wa.me/` : '@'}${user.jid.split`@`[0]} *${user[type]} ${rpg.emoticon(type)}${type}*`).join`\n`}
`.trim()
	return m.reply(text, null, {
		mentions: [...userItem.slice(page * 25, page * 25 + 25)].filter(v => !participants.some(p => areJidsSameUser(v, p.id)))
	})
}
handler.help = ['leaderboard *jumlah user*', 'lb *jumlah user*']
handler.tags = ['xp']
handler.command = /^(leaderboard|lb)$/i

module.exports = handler

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


/**
 * Detect Number
 * @param {Number} x 
 */
function isNumber(number) {
	if (!number) return number
	number = parseInt(number)
	return typeof number == 'number' && !isNaN(number)
}
