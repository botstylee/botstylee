// plugins/rpg-open.cjs
// Fitur: Buka crate untuk dapat reward random

var rewards = {
	common: {
		money: 101,
		exp: 201,
		trash: 11,
		potion: [0, 1, 0, 1, 0, 0, 0, 0, 0],
		common: [0, 1, 0, 1, 0, 0, 0, 0, 0, 0],
		uncommon: [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	},
	uncommon: {
		money: 201,
		exp: 401,
		trash: 31,
		potion: [0, 1, 0, 0, 0, 0, 0],
		diamond: [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		common: [0, 1, 0, 0, 0, 0, 0, 0],
		uncommon: [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
		mythic: [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		wood: [0, 1, 0, 0, 0, 0],
		rock: [0, 1, 0, 0, 0, 0],
		string: [0, 1, 0, 0, 0, 0]
	},
	mythic: {
		money: 301,
		exp: 551,
		trash: 61,
		potion: [0, 1, 0, 0, 0, 0],
		emerald: [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		diamond: [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
		gold: [0, 1, 0, 0, 0, 0, 0, 0, 0],
		iron: [0, 1, 0, 0, 0, 0, 0, 0],
		common: [0, 1, 0, 0, 0, 0],
		uncommon: [0, 1, 0, 0, 0, 0, 0, 0],
		mythic: [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
		legendary: [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		pet: [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		wood: [0, 1, 0, 0, 0],
		rock: [0, 1, 0, 0, 0],
		string: [0, 1, 0, 0, 0]
	},
	legendary: {
		money: 401,
		exp: 601,
		trash: 101,
		potion: [0, 1, 0, 0, 0],
		emerald: [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
		diamond: [0, 1, 0, 0, 0, 0, 0, 0, 0],
		gold: [0, 1, 0, 0, 0, 0, 0, 0],
		iron: [0, 1, 0, 0, 0, 0, 0],
		common: [0, 1, 0, 0],
		uncommon: [0, 1, 0, 0, 0, 0],
		mythic: [0, 1, 0, 0, 0, 0, 0, 0, 0],
		legendary: [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
		pet: [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
		wood: [0, 1, 0, 0],
		rock: [0, 1, 0, 0],
		string: [0, 1, 0, 0]
	}
}

var handler = async (m, {
	command,
	args,
	usedPrefix
}) => {
	// Guard: user harus terdaftar
	var user = db.data.users[m.sender]
	if (!user) return m.reply('Kamu belum terdaftar di database.')

	// Emoticon helper
	var emot = (v) => {
		if (typeof global.rpg?.emoticon === 'function') return global.rpg.emoticon(v)
		return ''
	}

	// Filter crate yang ada di user
	var listCrate = Object.fromEntries(Object.entries(rewards).filter(([v]) => v && v in user))

	// Info kalau tipe salah
	var info = `
Use Format *${usedPrefix}${command} [crate] [count]*
Usage example: *${usedPrefix}${command} common 10*

📍Crate list: 
${Object.keys(listCrate).map((v) => `${emot(v)}${v}`).join('\n')}
`.trim()

	var type = (args[0] || '').toLowerCase()
	var count = isNumber(args[1]) ? Math.max(parseInt(args[1]), 1) : 1

	// Guard: tipe valid
	if (!(type in listCrate)) return m.reply(info)

	// Guard: crate cukup
	if (user[type] < count) {
		return m.reply(`Your *${emot(type)}${type} crate* is not enough!, you only have ${user[type]} *${emot(type)}${type} crate*\ntype *${usedPrefix}buy ${type} ${count - user[type]}* to buy`)
	}

	// Proses buka crate
	var crateReward = {}
	for (var i = 0; i < count; i++) {
		for (var [reward, value] of Object.entries(listCrate[type])) {
			// value adalah array, jadi pakai pickRandom
			var total = pickRandom(value)
			if (total) {
				user[reward] = (user[reward] || 0) + total
				crateReward[reward] = (crateReward[reward] || 0) + total
			}
		}
	}

	// Kurangi crate
	user[type] -= count

	// Susun output umum
	var umum = Object.keys(crateReward)
		.filter(v => v && crateReward[v] && !/legendary|pet|mythic|diamond|emerald/i.test(v))
		.map(reward => `*${emot(reward)}${reward}:* ${crateReward[reward]}`)
		.join('\n')

	// Kirim hasil umum
	await m.reply(`You have opened *${count}* ${emot(type)}${type} crate and got:\n${umum || '_Tidak ada reward umum_'}`)

	// Kirim rare item
	var { diamond, mythic, pet, legendary, emerald } = crateReward
	if (mythic || diamond) {
		var rare = [
			diamond ? `*${diamond}* ${emot('diamond')}diamond` : '',
			mythic ? `*${mythic}* ${emot('mythic')}mythic` : ''
		].filter(Boolean).join(' and ')
		await m.reply(`Congrats you got a rare item, which is ${rare}`)
	}

	// Kirim epic item
	if (pet || legendary || emerald) {
		var epic = [
			pet ? `*${pet}* ${emot('pet')}pet` : '',
			legendary ? `*${legendary}* ${emot('legendary')}legendary` : '',
			emerald ? `*${emerald}* ${emot('emerald')}emerald` : ''
		].filter(Boolean).join(', ')
		await m.reply(`Congrats you got a epic item, which is ${epic}`)
	}
}

handler.help = ['open', 'gacha'].map(v => v + ' *crate count*')
handler.tags = ['rpg']
handler.command = /^(open|buka|gacha)$/i

module.exports = handler

/**
 * Ambil elemen acak dari array
 * @param {any[]} list
 * @returns {any}
 */
function pickRandom(list) {
	return list[Math.floor(Math.random() * list.length)]
}

/**
 * Cek apakah nilai adalah number valid
 * @param {any} number
 * @returns {boolean}
 */
function isNumber(number) {
	if (!number) return false
	number = parseInt(number)
	return typeof number === 'number' && !isNaN(number)
}
