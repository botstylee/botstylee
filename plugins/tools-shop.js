var items = {
	buy: {
		limit: {
			mp: 1000
		},
		coin: {
			mp: 10000,
		},
		ruby: {
			coin: 5
		},
		tokenpremium: {
			ruby: 20
		},
		tokenfree: {
			ruby: 5
		},
		tokenupgrade: {
			ruby: 50
		}
	},
	sell: {
		mp: {
			exp: 100
		}
	}
}

var handler = async (m, {
	command,
	usedPrefix,
	args
}) => {
	var user = global.db.data.users[m.sender]
	var listItems = Object.fromEntries(Object.entries(items[command.toLowerCase()]).filter(([v]) => v && v in user))
	var info = `
Use Format *${usedPrefix}${command} [item] [count]*
Usage example: *${usedPrefix}${command} potion 10*

📍Items list:
${Object.keys(listItems).map((v) => {
		var paymentMethod = Object.keys(listItems[v]).find(v => v in user)
		return `${v} | ${listItems[v][paymentMethod]} ${paymentMethod}`.trim()
	}).join('\n')}
`.trim()
	var item = (args[0] || '').toLowerCase()
	var total = Math.floor(isNumber(args[1]) ? Math.min(Math.max(parseInt(args[1]), 1), Number.MAX_SAFE_INTEGER) : 1) * 1
	if (!listItems[item]) return m.reply(info)
	if (command.toLowerCase() == 'buy') {
		var paymentMethod = Object.keys(listItems[item]).find(v => v in user)
		if (user[paymentMethod] < listItems[item][paymentMethod] * total) return m.reply(`You don't have enough ${paymentMethod} to buy *${total}* ${item}. You need *${(listItems[item][paymentMethod] * total) - user[paymentMethod]}* more ${paymentMethod} to be able to buy`)
		user[paymentMethod] -= listItems[item][paymentMethod] * total
		user[item] += total
		return m.reply(`You bought *${total}* ${item}`)
	} else {
		if (user[item] < total) return m.reply(`You don't have enough *${item}* to sell, you only have ${user[item]} items`)
		user[item] -= total
		user.exp += listItems[item].exp * total
		return m.reply(`You sold *${total}* ${item}`)
	}
}

handler.help = ['buy', 'sell'].map(v => v + ' [item] [count]')
handler.tags = ['tools']
handler.command = /^(buy|sell)$/i

handler.disabled = false

export default handler

function isNumber(number) {
	if (!number) return number
	number = parseInt(number)
	return typeof number == 'number' && !isNaN(number)
}