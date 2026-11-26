// plugins/rpg-craft.cjs
// Fitur: Crafting item & burning (glass, brick)

var handler = async (m, {
	conn,
	command,
	usedPrefix,
	args
}) => {
	// Guard: user harus terdaftar
	var user = db.data.users[m.sender]
	if (!user) return m.reply('Kamu belum terdaftar di database.')

	// Inisialisasi field yang dibutuhkan
	var fields = ['pickaxe', 'axe', 'sword', 'fishingrod', 'stick', 'iron', 'wood', 'string', 'sand', 'coal', 'clay', 'glass', 'brick', 'pickaxedurability', 'axedurability', 'sworddurability', 'fishingroddurability']
	for (var f of fields) {
		if (typeof user[f] !== 'number') user[f] = 0
	}

	var type = (args[0] || '').toLowerCase()

	// Parse count (jumlah item)
	var count = 1
	if (args[2] && args[2].length > 0) {
		var parsed = parseInt(args[2])
		if (!isNaN(parsed)) count = Math.min(9999, Math.max(parsed, 1))
	}

	// Teks daftar craft (untuk default)
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

*Cara pakai:*
${usedPrefix}craft pickaxe
${usedPrefix}craft axe
${usedPrefix}craft sword
${usedPrefix}craft fishingrod
${usedPrefix}craft stick <jumlah>
${usedPrefix}burn glass <jumlah>
${usedPrefix}burn brick <jumlah>
`.trim()

	try {
		// === CRAFT ===
		if (/craft|crafting/i.test(command)) {
			switch (type) {
				case 'pickaxe':
					if (user.stick < 10 || user.iron < 15) {
						return m.reply('Anda tidak memiliki item untuk membuat pickaxe. Anda butuh: 10 stick & 15 iron')
					}
					user.stick -= 10
					user.iron -= 15
					user.pickaxe += 1
					user.pickaxedurability += 20
					return m.reply('✅ Sukses crafting pickaxe')

				case 'axe':
					if (user.stick < 10 || user.iron < 15) {
						return m.reply('Anda tidak memiliki item untuk membuat axe. Anda butuh: 10 stick & 15 iron')
					}
					user.stick -= 10
					user.iron -= 15
					user.axe += 1
					user.axedurability += 20
					return m.reply('✅ Sukses crafting axe')

				case 'sword':
					if (user.stick < 5 || user.iron < 10) {
						return m.reply('Anda tidak memiliki item untuk membuat sword. Anda butuh: 5 stick & 10 iron')
					}
					user.stick -= 5
					user.iron -= 10
					user.sword += 1
					user.sworddurability += 20
					return m.reply('✅ Sukses crafting sword')

				case 'fishingrod':
					if (user.stick < 10 || user.string < 20) {
						return m.reply('Anda tidak memiliki item untuk membuat fishing rod. Anda butuh: 10 stick & 20 string')
					}
					user.stick -= 10
					user.string -= 20
					user.fishingrod += 1
					user.fishingroddurability += 20
					return m.reply('✅ Sukses crafting fishing rod')

				case 'stick':
					if (user.wood < count) {
						return m.reply(`Anda tidak memiliki item untuk membuat ${count * 2} stick. Anda butuh: ${count} wood`)
					}
					user.stick += 2 * count
					user.wood -= 1 * count
					return m.reply(`✅ Sukses crafting ${count * 2} stick`)

				default:
					return conn.sendMessage(m.chat, { text: list }, { quoted: m })
			}
		}

		// === BURNING ===
		if (/burning|burn|bakar/i.test(command)) {
			switch (type) {
				case 'glass':
					if (user.sand < 6 * count || user.coal < 1 * count) {
						return m.reply(`Anda tidak memiliki item untuk membakar ${count} glass\nAnda butuh ${count * 6} sand dan ${count} coal`)
					}
					user.sand -= 6 * count
					user.coal -= 1 * count
					user.glass += 3 * count
					return m.reply(`✅ Sukses membakar ${count * 3} glass`)

				case 'brick':
					if (user.clay < 6 * count || user.coal < 1 * count) {
						return m.reply(`Anda tidak memiliki item untuk membakar ${count} brick\nAnda butuh ${count * 6} clay dan ${count} coal`)
					}
					user.clay -= 6 * count
					user.coal -= 1 * count
					user.brick += 3 * count
					return m.reply(`✅ Sukses membakar ${count * 3} brick`)

				default:
					return conn.sendMessage(m.chat, { text: list }, { quoted: m })
			}
		}
	} catch (err) {
		console.error(err)
		m.reply('Error\n\n' + err.message)
	}
}

handler.help = ['craft']
handler.tags = ['rpg']
handler.command = /^(craft|crafting|burn|burning|bakar)$/i

module.exports = handler
