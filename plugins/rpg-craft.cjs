var handler = async (m, {
	command,
	usedPrefix,
	args
}) => {
	var type = (args[0] || '').toLowerCase()
	var _type = (args[0] || '').toLowerCase()
	var user = db.data.users[m.sender]
	user.pickaxe = user.pickaxe || 0
	user.pedang = user.pedang || 0
	user.fishingrod = user.fishingrod || 0
	user.axe = user.axe || 0
	var sections = [{
		title: "List Featured",
		rows: [{
			title: "PICKAXE ⛏️",
			rowId: ".craft pickaxe",
			description: "Crafting Pickaxe"
		}, {
			title: "AXE 🪓",
			rowId: ".craft axe",
			description: "Crafting Axe"
		}, {
			title: "SWORD ⚔️",
			rowId: ".craft sword",
			description: "Crafting Sword"
		}, {
			title: "FISHING ROD 🎣",
			rowId: ".craft fishingrod",
			description: "Crafting Fishing Rod"
		}, {
			title: "Stick 🦯",
			rowId: ".craft stick",
			description: "Craft Stick"
		}, ]
	}, {
		title: `-------✦ BURN ✦-------`,
		rows: [{
			title: "Glass 🪞",
			rowId: ".burn glass",
			description: "Burning Sand To Get Glass"
		}, {
			title: "Brick 🧱",
			rowId: ".burn glass",
			description: "Burning Clay To Get Brick"
		}]
	}]

	var list = `
▧ Pickaxe ⛏️
 〉 Need 15 Iron⛓️ & 10 Stick🦯
▧ Axe 🪓
 〉 Need 15 Iron⛓️ & 10 Stick🦯
▧ Sword ⚔️ 
 〉 Need 10 Iron⛓️ & 5 Stick🦯
▧ Fishing Rod 🎣
 〉 Need 20 String🕸️ & 10 Stick🦯
 
▧ Stick 🦯
 〉 Need 1 Wood 🪵

「 *B U R N I N G* 」

▧ Glass🪞 
 〉 Need 1 Coal🕳️ & 6 Sand🌑 to get 3 Glass🪞
▧ Brick 🧱  
 〉 Need 1 Coal🕳️ & 6 Clay🌕 to get 3 Brick🧱
`
	try {
		if (/craft|Crafting/i.test(command)) {
			var count = args[2] && args[2].length > 0 ? Math.min(9999, Math.max(parseInt(args[2]), 1)) : !args[2] || args.length < 4 ? 1 : Math.min(1, count)
			switch (type) {
				case 'pickaxe':
					if (user.stick < 10 || user.iron < 15) return m.reply(`Anda tidak memiliki item untuk membuat pickaxe. anda butuh : 10 stick & 15 iron`)
					user.stick -= 10
					user.iron -= 15
					user.pickaxe += 1
					user.pickaxedurability += 20
					m.reply("Sukses crafting pickaxe")
					break
				case 'axe':
					if (user.stick < 10 || user.iron < 15) return m.reply(`Anda tidak memiliki item untuk membuat axe. anda butuh : 10 stick & 15 iron`)
					user.stick -= 10
					user.iron -= 15
					user.axe += 1
					user.axedurability += 20
					m.reply("Sukses crafting axe")
					break
				case 'sword':
					if (user.stick < 5 || user.iron < 10) return m.reply(`Anda tidak memiliki item untuk membuat sword. anda butuh : 5 stick & 10 iron `)
					user.stick -= 5
					user.iron -= 10
					user.sword += 1
					user.sworddurabiliry += 20
					m.reply("Sukses crafting sword")
					break
				case 'fishingrod':
					if (user.stick < 10 || user.string < 20) return m.reply(`Anda tidak memiliki item untuk membuat fishing rod. anda butuh :10 stick & 20 String`)
					user.stick -= 10
					user.string -= 20
					user.fishingrod += 1
					user.fishingroddurability += 20
					m.reply("Sukses crafting fishing rod")
					break
				case 'stick':
					if (user.wood < 1) return m.reply(`Anda tidak memiliki item untuk membuat ${count * 2} stick`)
					user.stick += 2 * count
					user.wood -= 1 * count
					m.reply("success crafting ${count * 2} stick")
					break
				default:
					await conn.sendMessage(m.chat, {
						text: list,
						footer: author,
						title: '「 *C R A F T I N G* 」',
						buttonText: "R E P A I R",
						sections
					})
			}
		} else if (/burning|burn|bakar/i.test(command)) {
			var count = args[2] && args[2].length > 0 ? Math.min(9999, Math.max(parseInt(args[2]), 1)) : !args[2] || args.length < 4 ? 1 : Math.min(1, count)
			switch (_type) {
				case 'glass':
					if (user.sand < 6 || user.coal < 1) return m.reply(`Anda tidak memiliki item untuk membakar ${count} glass\nanda butuh ${count * 6} sand and ${count * 1} coal`)
					user.sand -= 6 * count
					user.coal -= 1 * count
					user.glass += 3 * count
					m.reply("success burning ${count} glass")
					break
				case 'brick':
					if (user.clay < 6 || user.coal < 1) return m.reply(`Anda tidak memiliki item untuk membakar ${count} brick\nanda butuh ${count * 6} clay and ${count * 1} coal`)
					user.brick += 3 * count
					user.clay -= 6 * count
					user.coal -= 1 * count
					m.reply("success burning ${count} glass")
				default:
					await conn.sendMessage(m.chat, {
						text: list,
						footer: author,
						title: '「 *C R A F T I N G* 」',
						buttonText: "R E P A I R",
						sections
					})
			}
		}
	} catch (err) {
		m.reply("Error\n\n\n" + err.stack)
	}
}

handler.help = ['craft']
handler.tags = ['rpg']
handler.command = /^(craft|crafting)/i

module.exports = handler