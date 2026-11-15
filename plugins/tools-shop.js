const items = {
	buy: {
		limit: { mp: 1000 },
		coin: { mp: 10000 },
		ruby: { coin: 5 },
		tokenpremium: { ruby: 20 },
		tokenfree: { ruby: 5 },
		tokenupgrade: { ruby: 50 }
	},
	sell: {
		mp: { exp: 100 }
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
	const user = global.db?.data?.users?.[m.sender]
	if (!user) throw 'Data pengguna belum tersedia. Coba lagi sebentar.'

	const catalog = items[action]
	if (!catalog) throw 'Perintah toko tidak dikenal.'
	const available = Object.fromEntries(Object.entries(catalog).filter(([item]) => item in user))
	const item = String(args[0] || '').toLowerCase()
	const count = parseCount(args[1])

	if (!Number.isSafeInteger(count)) throw `Jumlah harus bilangan bulat positif. Contoh: *${usedPrefix}${action} ruby 2*`

	if (!item || !available[item]) {
		const list = Object.entries(available).map(([name, costs]) => {
			const [currency, price] = Object.entries(costs)[0] || []
			return currency ? `• ${name}: ${price} ${currency} per item` : `• ${name}`
		}).join('\n')
		return m.reply(`*Format:* ${usedPrefix}${action} <item> <jumlah>\nContoh: ${usedPrefix}${action} ruby 2\n\n*Item tersedia:*\n${list || 'Tidak ada item tersedia.'}`)
	}

	const [currency, price] = Object.entries(available[item])[0] || []
	if (!currency || !Number.isFinite(Number(price)) || Number(price) < 0) throw 'Harga item tidak valid.'

	if (action === 'buy') {
		const cost = Number(price) * count
		const balance = Number(user[currency])
		if (!Number.isFinite(balance) || balance < cost) {
			throw `Saldo ${currency} tidak cukup. Dibutuhkan ${cost} ${currency}, saldo kamu ${Number.isFinite(balance) ? balance : 0}.`
		}
		user[currency] = balance - cost
		user[item] = (Number(user[item]) || 0) + count
		return m.reply(`Berhasil membeli ${count} ${item}.\nSisa ${currency}: ${user[currency]}`)
	}

	const inventory = Number(user[item]) || 0
	if (inventory < count) throw `Persediaan ${item} tidak cukup. Kamu memiliki ${inventory}.`
	user[item] = inventory - count
	user[currency] = (Number(user[currency]) || 0) + Number(price) * count
	return m.reply(`Berhasil menjual ${count} ${item}.\nSaldo ${currency}: ${user[currency]}`)
}

handler.help = ['buy <item> <jumlah>', 'sell <item> <jumlah>']
handler.tags = ['tools']
handler.command = /^(buy|sell)$/i
handler.disabled = false
export default handler
