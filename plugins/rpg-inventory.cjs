// plugins/rpg-inventory.cjs
// Fitur: Tampilkan inventory user (tools, items, crates, pets, cooldowns)

var daily = require('./rpg-daily.cjs')
var monthly = require('./rpg-monthly.cjs')
var adventure = require('./rpg-adventure.cjs')

var inventory = {
	others: {
		health: true,
		money: true,
		exp: true
	},
	items: {
		potion: true,
		trash: true,
		wood: true,
		rock: true,
		string: true,
		emerald: true,
		diamond: true,
		gold: true,
		iron: true
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
		axe: {
			'0': '❌',
			'1': 'Wooden Axe',
			'2': 'Stone Axe',
			'3': 'Iron Axe',
			'4': 'Gold Axe',
			'5': 'Copper Axe',
			'6': 'Diamond Axe',
			'7': 'Emerald Axe',
			'8': 'Obsidian Axe',
			'9': 'Netherite Axe',
			'10': 'Modern War Axe',
			'11': 'Hacker Axe'
		},
		bow: {
			'0': '❌',
			'1': 'Wooden Bow',
			'2': 'Stone Bow',
			'3': 'Iron Bow',
			'4': 'Gold Bow',
			'5': 'Copper Bow',
			'6': 'Diamond Bow',
			'7': 'Emerald Bow',
			'8': 'Obsidian Bow',
			'9': 'Netherite Bow',
			'10': 'Quick Blood Bow',
			'11': 'Hacker Bow'
		},
		fishingrod: {
			'0': '❌',
			'1': 'Wooden Fising Rod',
			'2': 'Stone Fising Rod',
			'3': 'Iron Fising Rod',
			'4': 'Gold Fising Rod',
			'5': 'Copper Fising Rod',
			'6': 'Diamond Fising Rod',
			'7': 'Emerald Fising Rod',
			'8': 'Obsidian Fising Rod',
			'9': 'Netherite Fising Rod',
			'10': 'Pull Everything Fising Rod',
			'11': 'Hacker Fising Rod'
		}
	},
	crates: {
		common: true,
		uncommon: true,
		mythic: true,
		legendary: true,
		pet: true
	},
	pets: {
		horse: 10,
		cat: 10,
		fox: 10,
		dog: 10
	},
	cooldowns: {
		lastclaim: {
			name: 'claim',
			time: daily.cooldown || 86400000
		},
		lastmonthly: {
			name: 'monthly',
			time: monthly.cooldown || 2592000000
		},
		lastadventure: {
			name: 'adventure',
			time: adventure.cooldown || 300000
		}
	}
}

var handler = async (m, {
	conn
}) => {
	// Guard: user harus terdaftar
	var user = db.data.users[m.sender]
	if (!user) return m.reply('Kamu belum terdaftar di database.')

	// Helper: emoticon
	var emot = (v) => {
		if (typeof global.rpg?.emoticon === 'function') return global.rpg.emoticon(v)
		return ''
	}

	// Helper: nama user (handle Promise)
	var name = conn.getName(m.sender)
	if (name instanceof Promise) name = await name

	// Tools
	var tools = Object.keys(inventory.tools).map(v => {
		if (!user[v]) return null
		var nama = typeof inventory.tools[v] === 'object'
			? inventory.tools[v][user[v]?.toString()] || user[v]
			: `Level(s) ${user[v]}`
		return `*${emot(v)}${v}:* ${nama}`
	}).filter(Boolean).join('\n').trim()

	// Items
	var items = Object.keys(inventory.items).map(v => {
		if (!user[v]) return null
		return `*${emot(v)}${v}:* ${user[v]}`
	}).filter(Boolean).join('\n').trim()

	// Crates
	var crates = Object.keys(inventory.crates).map(v => {
		if (!user[v]) return null
		return `*${emot(v)}${v}:* ${user[v]}`
	}).filter(Boolean).join('\n').trim()

	// Pets
	var pets = Object.keys(inventory.pets).map(v => {
		if (!user[v]) return null
		return `*${emot(v)}${v}:* ${user[v] >= inventory.pets[v] ? 'Max Levels' : `Level(s) ${user[v]}`}`
	}).filter(Boolean).join('\n').trim()

	// Cooldowns
	var cooldowns = Object.entries(inventory.cooldowns).map(([cd, { name, time }]) => {
		if (!(cd in user)) return null
		var ready = (new Date() - user[cd]) >= time
		return `*⌛${name}*: ${ready ? '✅' : '❌'}`
	}).filter(Boolean).join('\n').trim()

	// Others (health, money, exp)
	var others = Object.keys(inventory.others).map(v => {
		if (!user[v]) return null
		return `*${emot(v)}${v}:* ${user[v]}`
	}).filter(Boolean).join('\n')

	// Total items & crates (hindari NaN)
	var totalItems = Object.keys(inventory.items).reduce((a, b) => a + (user[b] || 0), 0)
	var totalCrates = Object.keys(inventory.crates).reduce((a, b) => a + (user[b] || 0), 0)

	// Susun caption
	var caption = `
Inventory *${name}*

${others}${tools ? `


*📍 Tools*
${tools}` : ''}${items ? `


*📍 Items*
${items}
*🎒 Total Items:* ${totalItems} Items` : ''}${crates ? `


*📍 Crates*
${crates}
*🎒 Total Crates:* ${totalCrates} Crates` : ''}${pets ? `


*📍 Pets*
${pets}` : ''}${cooldowns ? `

*⌚ Cooldowns*
${cooldowns}` : ''}
`.trim()

	await m.reply(caption)
}

handler.help = ['inventory', 'inv']
handler.tags = ['rpg']
handler.command = /^(inv(entory)?|bal(ance)?|money|e?xp)$/i

module.exports = handler
