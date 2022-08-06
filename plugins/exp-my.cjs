var daily = require('./rpg-daily.cjs');
var weekly = require('./rpg-weekly.cjs');
var monthly = require('./rpg-monthly.cjs');
var adventure = require('./rpg-adventure.cjs');

var inventory = {
	others: {
		health: true,
		money: true,
		exp: true,
		limit: true,
	},
	items: {
		health: true,
		money: true,
		exp: true,
		level: true,
		limit: true,
	},
	tools: {
		armor: {
			'0': '❌',
			'1': 'Leather Armor',
			'2': 'Iron Armor',
			'3': 'Gold Armor',
			'4': 'Diamond Armor',
			'5': 'Emerald Armor',
			'6': 'Crystal Armor',
			'7': 'Obsidian Armor',
			'8': 'Netherite Armor',
			'9': 'Wither Armor',
			'10': 'Dragon Armor',
			'11': 'Hacker Armor'
		},
		sword: {
			'0': '❌',
			'1': 'Wooden Sword',
			'2': 'Stone Sword',
			'3': 'Iron Sword',
			'4': 'Gold Sword',
			'5': 'Copper Sword',
			'6': 'Diamond Sword',
			'7': 'Emerald Sword',
			'8': 'Obsidian Sword',
			'9': 'Netherite Sword',
			'10': 'Samurai Slayer Green Sword',
			'11': 'Hacker Sword'
		},
		pickaxe: {
			'0': '❌',
			'1': 'Wooden Pickaxe',
			'2': 'Stone Pickaxe',
			'3': 'Iron Pickaxe',
			'4': 'Gold Pickaxe',
			'5': 'Copper Pickaxe',
			'6': 'Diamond Pickaxe',
			'7': 'Emerlad Pickaxe',
			'8': 'Crystal Pickaxe',
			'9': 'Obsidian Pickaxe',
			'10': 'Netherite Pickaxe',
			'11': 'Hacker Pickaxe'
		},
		fishingrod: true,

	},
	crates: {
		common: true,
		uncommon: true,
		mythic: true,
		legendary: true,
		pet: true,
	},
	pets: {
		horse: 10,
		cat: 10,
		fox: 10,
		dog: 10,
	},
	cooldowns: {
		lastclaim: {
			name: 'claim',
			time: daily.cooldown
		},
		lastweekly: {
			name: 'weekly',
			time: weekly.cooldown
		},
		lastmonthly: {
			name: 'monthly',
			time: monthly.cooldown
		},
		lastadventure: {
			name: 'adventure',
			time: adventure.cooldown
		}
	}
}
var handler = async (m, {
	conn
}) => {
	var user = db.data.users[m.sender]
	var tools = Object.keys(inventory.tools).map(v => user[v] && `*${global.rpg.emoticon(v)}${v}:* ${typeof inventory.tools[v] === 'object' ? inventory.tools[v][user[v]?.toString()] : `Level(s) ${user[v]}`}`).filter(v => v).join('\n').trim()
	var items = Object.keys(inventory.items).map(v => user[v] && `*${global.rpg.emoticon(v)}${v}:* ${user[v]}`).filter(v => v).join('\n│ ').trim()
	var crates = Object.keys(inventory.crates).map(v => user[v] && `*${global.rpg.emoticon(v)}${v}:* ${user[v]}`).filter(v => v).join('\n').trim()
	var pets = Object.keys(inventory.pets).map(v => user[v] && `*${global.rpg.emoticon(v)}${v}:* ${user[v] >= inventory.pets[v] ? 'Max Levels' : `Level(s) ${user[v]}`}`).filter(v => v).join('\n').trim()
	var cooldowns = Object.entries(inventory.cooldowns).map(([cd, {
		name,
		time
	}]) => cd in user && `*✧ ${name}*: ${new Date() - user[cd] >= time ? '✅' : '❌'}`).filter(v => v).join('\n').trim()
	var caption = `
⃝▣「 *S T A T U S  U S E R* 」
│ 📛 *Name:* ${user.registered ? user.name : conn.getName(m.sender)}
│ ${items}
│ 🏅 *Role:* ${user.role}
│ 🌟 *Status:* ${user.premium ? 'Premium' : 'Free'}
│ 📑 *Registered:* ${user.registered ? 'Yes':'No'}
▣──···
`.trim()
	conn.sendButton(m.chat, caption, global.wm, null, [`Inventory`, '.inv'], m)
}
handler.help = ['my']
handler.tags = ['xp']
handler.command = /^(my)$/i

handler.register = false
module.exports = handler