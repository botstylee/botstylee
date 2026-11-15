const items = {
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

const parseCount = value => {
	if (value == null || value === '') return 1
	if (!/^\d+$/.test(String(value))) return NaN
	const count = Number(value)
	return Number.isSafeInteger(count) && count > 0 ? count : NaN
}

const handler = async (m, { command, usedPrefix = '.', args = [] }) => {
	const action = String(command || '').toLowerCase()
	const user = db.data?.users?.[m.sender]
	if (!user) throw 'Data pengguna belum tersedia. Coba lagi sebentar.'

	const catalog = items[action]
	if (!catalog) throw 'Perintah toko tidak dikenal.'
	const available = Object.fromEntries(Object.entries(catalog).filter(([item]) => item in user))
	const item = String(args[0] || '').toLowerCase()
	const count = parseCount(args[1])
	if (!Number.isSafeInteger(count)) throw `Jumlah harus bilangan bulat positif. Contoh: *${usedPrefix}${action} potion 2*`

	if (!item || !available[item]) {
		const list = Object.entries(available).map(([name, costs]) => {
			const [currency, price] = Object.entries(costs)[0] || []
			const emoji = global.rpg?.emoticon?.(name) || ''
			return currency ? `• ${emoji}${name}: ${price} ${global.rpg?.emoticon?.(currency) || ''}${currency} per item` : `• ${emoji}${name}`
		}).join('\n')
		return m.reply(`*Format:* ${usedPrefix}${action} <item> <jumlah>\nContoh: ${usedPrefix}${action} potion 2\n\n*Item tersedia:*\n${list || 'Tidak ada item tersedia.'}`)
	}

	const [currency, priceValue] = Object.entries(available[item])[0] || []
	const price = Number(priceValue)
	if (!currency || !Number.isFinite(price) || price < 0) throw 'Harga item tidak valid.'

	if (action === 'buy') {
		const balance = Number(user[currency]) || 0
		const cost = price * count
		if (balance < cost) throw `Saldo ${currency} tidak cukup. Dibutuhkan ${cost}, saldo kamu ${balance}.`
		user[currency] = balance - cost
		user[item] = (Number(user[item]) || 0) + count
		return m.reply(`Berhasil membeli ${count} ${item}.\nSisa ${currency}: ${user[currency]}`)
	}

	const inventory = Number(user[item]) || 0
	if (inventory < count) throw `Persediaan ${item} tidak cukup. Kamu memiliki ${inventory}.`
	user[item] = inventory - count
	user.money = (Number(user.money) || 0) + price * count
	return m.reply(`Berhasil menjual ${count} ${item}.\nSaldo money: ${user.money}`)
}

handler.help = ['buy <item> <jumlah>', 'sell <item> <jumlah>']
handler.tags = ['rpg']
handler.command = /^(buy|sell)$/i
handler.register = true
handler.disabled = false
module.exports = handler
