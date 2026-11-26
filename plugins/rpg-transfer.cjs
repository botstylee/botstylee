// plugins/rpg-transfer.cjs
// Fitur: Transfer item/money ke user lain

var items = [
	'money', 'potion', 'trash', 'wood',
	'rock', 'string', 'petFood', 'emerald',
	'diamond', 'gold', 'iron', 'common',
	'uncommon', 'mythic', 'legendary', 'pet'
]

var confirmation = {}

async function handler(m, {
	conn,
	args,
	usedPrefix,
	command
}) {
	// Guard: masih ada transfer berjalan
	if (confirmation[m.sender]) return m.reply('Kamu sedang melakukan transfer!')

	// Guard: user harus terdaftar
	var user = db.data.users[m.sender]
	if (!user) return m.reply('Kamu belum terdaftar di database.')

	// Emoticon helper
	var emot = (v) => {
		if (typeof global.rpg?.emoticon === 'function') return global.rpg.emoticon(v)
		return ''
	}

	// Filter item yang ada di user
	var item = items.filter(v => v in user && typeof user[v] === 'number')

	// Info kalau tipe salah
	var lol = `Use format ${usedPrefix}${command} [type] [value] [number]
example ${usedPrefix}${command} money 9999 @621927237001

📍 Transferable items
${item.map(v => `${emot(v)}${v}`).join('\n')}
`.trim()

	var type = (args[0] || '').toLowerCase()
	if (!item.includes(type)) return m.reply(lol)

	// Parse count
	var count = isNumber(args[1]) ? Math.max(parseInt(args[1]), 1) : 1

	// Tentukan target
	var who = ''
	if (m.mentionedJid && m.mentionedJid[0]) {
		who = m.mentionedJid[0]
	} else if (args[2]) {
		who = args[2].replace(/[@ .+-]/g, '') + '@s.whatsapp.net'
	}
	if (!who) return m.reply('Tag salah satu, atau ketik Nomernya!!')

	// Guard: target terdaftar
	if (!(who in db.data.users)) return m.reply(`User ${who} not in database`)

	// Guard: item cukup
	if (user[type] < count) {
		return m.reply(`Your *${emot(type)}${type}${special(type)}* is less *${count - user[type]}*`)
	}

	// Simpan konfirmasi
	var confirmText = `Are you sure you want to transfer *${count}* ${emot(type)}${type}${special(type)} to *@${who.replace(/@s\.whatsapp\.net/g, '')}*\n\nTimeout *60* detik\n\nKetik *y* untuk ya, *n* untuk tidak.`

	confirmation[m.sender] = {
		sender: m.sender,
		to: who,
		message: m,
		type,
		count,
		timeout: setTimeout(() => {
			if (m.sender in confirmation) {
				m.reply('Timeout')
				delete confirmation[m.sender]
			}
		}, 60 * 1000)
	}

	return conn.sendMessage(m.chat, {
		text: confirmText,
		mentions: [who]
	}, { quoted: m })
}

// before di module.exports, bukan handler.before
handler.before = async function (m) {
	if (m.isBaileys) return
	if (!(m.sender in confirmation)) return
	if (!m.text) return

	var { timeout, sender, message, to, type, count } = confirmation[m.sender]

	// Guard: pesan yang sama
	if (message && m.id === message.id) return

	var user = db.data.users[sender]
	var _user = db.data.users[to]
	if (!user || !_user) {
		clearTimeout(timeout)
		delete confirmation[sender]
		return
	}

	var txt = m.text.toLowerCase()

	// Tolak
	if (/^no?$/i.test(txt)) {
		clearTimeout(timeout)
		delete confirmation[sender]
		return m.reply('Reject')
	}

	// Terima
	if (/^y(es)?$/i.test(txt)) {
		var previous = user[type] || 0
		var _previous = _user[type] || 0

		// Guard: item cukup
		if (previous < count) {
			clearTimeout(timeout)
			delete confirmation[sender]
			return m.reply('Item kamu tidak cukup untuk transfer.')
		}

		user[type] = previous - count
		_user[type] = _previous + count

		// Verifikasi
		if (user[type] === previous - count && _user[type] === _previous + count) {
			m.reply(`Succes transfer *${count}* ${global.rpg?.emoticon?.(type) || ''}${type}${special(type)} to *@${(to || '').replace(/@s\.whatsapp\.net/g, '')}*`)
		} else {
			// Rollback
			user[type] = previous
			_user[type] = _previous
			m.reply(`Failed to transfer *${count}* ${global.rpg?.emoticon?.(type) || ''}${type}${special(type)} to *@${(to || '').replace(/@s\.whatsapp\.net/g, '')}*`)
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

/**
 * Cek special item (crate)
 * @param {string} type
 * @returns {string}
 */
function special(type) {
	var b = type.toLowerCase()
	return ['common', 'uncommon', 'mythic', 'legendary', 'pet'].includes(b) ? ' Crate' : ''
}

/**
 * Cek apakah nilai adalah number valid
 * @param {any} x
 * @returns {boolean}
 */
function isNumber(x) {
	if (x === undefined || x === null || x === '') return false
	var n = parseInt(x)
	return !isNaN(n)
}
