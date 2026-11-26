// plugins/rpg-shop.cjs
// Fitur: Buy & sell item (potion, gold, diamond, dll.)

var items = {
	buy: {
		limit: { exp: 1000 },
		gold: { money: 2000 },
		string: { money: 500 },
		rock: { money: 500 },
		wood: { money: 500 },
		iron: { money: 800 },
		potion: { money: 250 },
		diamond: { money: 3000 },
		common: { money: 200 },
		uncommon: { money: 600 },
		mythic: { money: 2500 },
		legendary: { money: 7500 },
		horse: { gold: 200 },
		cat: { gold: 200 },
		fox: { gold: 400 },
		wolf: { gold: 650 },
		rhinoceros: { gold: 650 },
		lion: { gold: 650 },
		phonix: { gold: 1000 },
		centaur: { gold: 1000 },
		griffin: { gold: 1000 },
		naga: { gold: 1000 },
		foodPet: { money: 1000 },
		dog: { gold: 200 },
		trash: { money: 4 },
		seedkangkung: { money: 50 },
		seedwortel: { money: 50 },
		seedtomat: { money: 50 },
		seedbrokoli: { money: 50 },
		seedlabu: { money: 50 },
		seedkentang: { money: 50 },
		seedjagung: { money: 50 },
		seedbayam: { money: 50 },
		seedkubis: { money: 50 }
	},
	sell: {
		potion: { money: 125 },
		gold: { money: 1500 },
		string: { money: 250 },
		rock: { money: 250 },
		wood: { money: 250 },
		iron: { money: 500 },
		diamond: { money: 2000 },
		common: { money: 100 },
		uncommon: { money: 400 },
		mythic: { money: 2000 },
		legendary: { money: 5000 },
		kangkung: { money: 500 },
		wortel: { money: 500 },
		tomat: { money: 500 },
		brokoli: { money: 500 },
		labu: { money: 500 },
		kentang: { money: 500 },
		jagung: { money: 500 },
		bayam: { money: 500 },
		kubis: { money: 500 },
		trash: { money: 2 },
		// Hasil berburu
		kepiting: { money: 20000 },
		lobster: { money: 20000 },
		udang: { money: 20000 },
		cumi: { money: 20000 },
		gurita: { money: 2000 },
		buntal: { money: 2000 },
		dory: { money: 2000 },
		orca: { money: 2000 },
		lumba: { money: 2000 },
		paus: { money: 2000 },
		hiu: { money: 2000 },
		banteng: { money: 2000 },
		harimau: { money: 2000 },
		gajah: { money: 2000 },
		kambing: { money: 2000 },
		panda: { money: 2000 },
		buaya: { money: 2000 },
		kerbau: { money: 2000 },
		sapi: { money: 2000 },
		monyet: { money: 2000 },
		babihutan: { money: 2000 },
		babi: { money: 2000 },
		ayam: { money: 2000 }
	}
}

var handler = async (m, {
	conn,
	command,
	usedPrefix,
	args
}) => {
	// Guard: user harus terdaftar
	var user = db.data.users[m.sender]
	if (!user) return m.reply('Kamu belum terdaftar di database.')

	// Emoticon helper
	var emot = (v) => {
		if (typeof global.rpg?.emoticon === 'function') return global.rpg.emoticon(v)
		return ''
	}

	// Mode: buy / sell
	var mode = command.toLowerCase()
	var listItems = Object.fromEntries(Object.entries(items[mode]).filter(([v]) => v && v in user))

	// Info kalau item salah
	var info = `
Use Format *${usedPrefix}${command} [item] [count]*
Usage example: *${usedPrefix}${command} potion 10*
    
📍Items list: 
${Object.keys(listItems).map((v) => {
	var paymentMethod = Object.keys(listItems[v]).find(p => p in user)
	return `${emot(v)}${v} | ${listItems[v][paymentMethod]} ${emot(paymentMethod)}${paymentMethod}`
}).join('\n')}
`.trim()

	var item = (args[0] || '').toLowerCase()
	var total = isNumber(args[1]) ? Math.max(parseInt(args[1]), 1) : 1

	// Guard: item valid
	if (!listItems[item]) return m.reply(info)

	// === BUY ===
	if (mode === 'buy') {
		var paymentMethod = Object.keys(listItems[item]).find(p => p in user)
		if (!paymentMethod) return m.reply('Metode pembayaran tidak ditemukan.')

		// Pastikan field ada
		if (typeof user[paymentMethod] !== 'number') user[paymentMethod] = 0
		if (typeof user[item] !== 'number') user[item] = 0

		var harga = listItems[item][paymentMethod] * total
		if (user[paymentMethod] < harga) {
			return m.reply(`You don't have enough ${emot(paymentMethod)}${paymentMethod} to buy *${total}* ${emot(item)}${item}. You need *${harga - user[paymentMethod]}* more ${paymentMethod} to be able to buy`)
		}

		user[paymentMethod] -= harga
		user[item] += total
		return m.reply(`You bought *${total}* ${emot(item)}${item}`)
	}

	// === SELL ===
	if (mode === 'sell') {
		if (typeof user[item] !== 'number') user[item] = 0
		if (typeof user.money !== 'number') user.money = 0

		if (user[item] < total) {
			return m.reply(`You don't have enough *${emot(item)}${item}* to sell, you only have ${user[item]} items`)
		}

		user[item] -= total
		user.money += listItems[item].money * total
		return m.reply(`You sold *${total}* ${emot(item)}${item}`)
	}
}

handler.help = ['buy', 'sell'].map(v => v + ' *item count*')
handler.tags = ['rpg']
handler.command = /^(buy|sell)$/i
handler.register = true
handler.disabled = false

module.exports = handler

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
