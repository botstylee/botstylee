var items = [
	'money', 'potion', 'trash', 'wood',
	'rock', 'string', 'petFood', 'emerald',
	'diamond', 'gold', 'iron', 'common',
	'uncommon', 'mythic', 'legendary', 'pet',
]
var confirmation = {}
async function handler(m, {
	conn,
	args,
	usedPrefix,
	command
}) {
	if (confirmation[m.sender]) return m.reply('Kamu sedang melakukan transfer!')
	var user = db.data.users[m.sender]
	var item = items.filter(v => v in user && typeof user[v] == 'number')
	var lol = `Use format ${usedPrefix}${command} [type] [value] [number]
example ${usedPrefix}${command} money 9999 @621927237001

📍 Transferable items
${item.map(v => `${rpg.emoticon(v)}${v}`.trim()).join('\n')}
`.trim()
	var type = (args[0] || '').toLowerCase()
	if (!item.includes(type)) return m.reply(lol)
	var count = Math.min(Number.MAX_SAFE_INTEGER, Math.max(1, (isNumber(args[1]) ? parseInt(args[1]) : 1))) * 1
	var who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : args[2] ? (args[2].replace(/[@ .+-]/g, '') + '@s.whatsapp.net') : ''
	if (!who) return m.reply('Tag salah satu, atau ketik Nomernya!!')
	if (!(who in db.data.users)) return m.reply(`User ${who} not in database`)
	if (user[type] * 1 < count) return m.reply(`Your *${rpg.emoticon(type)}${type}${special(type)}* is less *${count - user[type]}*`)
	var confirm = `
Are you sure you want to transfer *${count}* ${rpg.emoticon(type)}${type}${special(type)} to *@${(who || '').replace(/@s\.whatsapp\.net/g, '')}*
Timeout *60* detik
`.trim()
	var c = '©games-wabot'
	conn.sendButton(m.chat, confirm, c, null, [
		['y'],
		['n']
	], m, {
		mentions: [who]
	})
	confirmation[m.sender] = {
		sender: m.sender,
		to: who,
		message: m,
		type,
		count,
		timeout: setTimeout(() => (m.reply('Timeout'), delete confirmation[m.sender]), 60 * 1000)
	}
}

handler.before = async m => {
	if (m.isBaileys) return
	if (!(m.sender in confirmation)) return
	if (!m.text) return
	var {
		timeout,
		sender,
		message,
		to,
		type,
		count
	} = confirmation[m.sender]
	if (m.id === message.id) return
	var user = db.data.users[sender]
	var _user = db.data.users[to]
	if (/no?/g.test(m.text.toLowerCase())) {
		clearTimeout(timeout)
		delete confirmation[sender]
		return m.reply('Reject')
	}
	if (/y(es)?/g.test(m.text.toLowerCase())) {
		var previous = user[type] * 1
		var _previous = _user[type] * 1
		user[type] -= count * 1
		_user[type] += count * 1
		if (previous > user[type] * 1 && _previous < _user[type] * 1) m.reply(`Succes transfer *${count}* ${rpg.emoticon(type)}${type}${special(type)} to *@${(to || '').replace(/@s\.whatsapp\.net/g, '')}*`, null, {
			mentions: [to]
		})
		else {
			user[type] = previous
			_user[type] = _previous
			m.reply(`Failted to transfer *${count}* ${rpg.emoticon(type)}${type}${special(type)} to *@${(to || '').replace(/@s\.whatsapp\.net/g, '')}*`, null, {
				mentions: [to]
			})
		}
		clearTimeout(timeout)
		delete confirmation[sender]
	}
}

handler.help = ['transfer', 'tf'].map(v => v + ' *type jumlah @tag*')
handler.tags = ['rpg']
handler.command = /^(transfer|tf)$/i

handler.disabled = false

module.exports = handler

function special(type) {
	var b = type.toLowerCase()
	var special = (['common', 'uncommon', 'mythic', 'legendary', 'pet'].includes(b) ? ' Crate' : '')
	return special
}

function isNumber(x) {
	return !isNaN(x)
}