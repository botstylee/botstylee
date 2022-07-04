const items = {
	buy: {
		limit: {
			exp: 1000
		},
		gold: {
			money: 2000
		},
		string: {
			money: 500
		},
		rock: {
			money: 500
		},
		wood: {
			money: 500
		},
		iron: {
			money: 800
		},
		potion: {
			money: 250
		},
		diamond: {
			money: 3000
		},
		common: {
			money: 200
		},
		uncommon: {
			money: 600
		},
		mythic: {
			money: 2500
		},
		legendary: {
			money: 7500
		},
		horse: {
			gold: 200
		},
		cat: {
			gold: 200
		},
		fox: {
			gold: 200
		},
		dog: {
			gold: 200
		},
		trash: {
			money: 4,
		}
	},
	sell: {
		potion: {
			money: 125,
		},
		gold: {
			money: 1500
		},
		string: {
			money: 250
		},
		rock: {
			money: 250
		},
		wood: {
			money: 250
		},
		iron: {
			money: 500
		},
		potion: {
			money: 100
		},
		diamond: {
			money: 2000
		},
		common: {
			money: 100
		},
		uncommon: {
			money: 400
		},
		mythic: {
			money: 2000
		},
		legendary: {
			money: 5000
		},
		trash: {
			money: 2
		},
		/*=========| SELL HASIL BERBURU |==============*/
	kepiting: {
			money:20000
		}, 
	lobster: {
			money:20000
		}, 
	udang: {
			money:20000
		}, 
	cumi: {
			money:20000
		}, 
	gurita: {
			money:2000
		}, 
	buntal: {
			money:2000
		}, 
	dory: {
			money:2000
		}, 
	orca: {
			money:2000
		}, 
	lumba: {
			money:2000
		}, 
	paus: {
			money:2000
		}, 
	hiu: {
			money:2000
		}, 
	banteng: {
			money:2000
		}, 
	harimau: {
			money:2000
		}, 
	gajah: {
			money:2000
		}, 
	kambing: {
			money:2000
		}, 
	panda: {
			money:2000
		}, 
	buaya: {
			money:2000
		}, 
	kerbau: {
			money:2000
		}, 
	sapi: {
			money:2000
		}, 
	monyet: {
			money:2000
		}, 
	babihutan: {
			money:2000
		}, 
	babi: {
			money:2000
		}, 
	ayam: {
			money:2000
		}
	}
}

let handler = async (m, {
	command,
	usedPrefix,
	args
}) => {
	let user = db.data.users[m.sender]
	const listItems = Object.fromEntries(Object.entries(items[command.toLowerCase()]).filter(([v]) => v && v in user))
	const info = `
Use Format *${usedPrefix}${command} [crate] [count]*
Usage example: *${usedPrefix}${command} potion 10*
    
📍Items list: 
${Object.keys(listItems).map((v) => {
        let paymentMethod = Object.keys(listItems[v]).find(v => v in user)
        return `${global.rpg.emoticon(v)}${v} | ${listItems[v][paymentMethod]} ${global.rpg.emoticon(paymentMethod)}${paymentMethod}`.trim()
    }).join('\n')}
`.trim()
	const item = (args[0] || '').toLowerCase()
	const total = Math.floor(isNumber(args[1]) ? Math.min(Math.max(parseInt(args[1]), 1), Number.MAX_SAFE_INTEGER) : 1) * 1
	if (!listItems[item]) return m.reply(info)
	if (command.toLowerCase() == 'buy') {
		let paymentMethod = Object.keys(listItems[item]).find(v => v in user)
		if (user[paymentMethod] < listItems[item][paymentMethod] * total) return m.reply(`You don't have enough ${global.rpg.emoticon(paymentMethod)}${paymentMethod} to buy *${total}* ${global.rpg.emoticon(item)}${item}. You need *${(listItems[item][paymentMethod] * total) - user[paymentMethod]}* more ${paymentMethod} to be able to buy`)
		user[paymentMethod] -= listItems[item][paymentMethod] * total
		user[item] += total
		return m.reply(`You bought *${total}* ${global.rpg.emoticon(item)}${item}`)
	} else {
		if (user[item] < total) return m.reply(`You don't have enough *${global.rpg.emoticon(item)}${item}* to sell, you only have ${user[item]} items`)
		user[item] -= total
		user.money += listItems[item].money * total
		return m.reply(`You sold *${total}* ${global.rpg.emoticon(item)}${item}`)
	}
}

handler.help = ['buy', 'sell'].map(v => v + ' *item count*')
handler.tags = ['rpg']
handler.command = /^(buy|sell)$/i

handler.disabled = false

module.exports = handler

function isNumber(number) {
	if (!number) return number
	number = parseInt(number)
	return typeof number == 'number' && !isNaN(number)
}
