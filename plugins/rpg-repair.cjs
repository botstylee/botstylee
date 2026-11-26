// plugins/rpg-upgrade.cjs
// Fitur: Upgrade & repair equipment (armor, pickaxe, axe, sword, bow, fishingrod)

var handler = async (m, {
	conn,
	command,
	usedPrefix,
	args
}) => {
	// Guard: user harus terdaftar
	var user = db.data.users[m.sender]
	if (!user) return m.reply('Kamu belum terdaftar di database.')

	// Konfigurasi equipment
	var equip = {
		armor: {
			nama: 'Armor', emoji: '🥼',
			maxLevel: 4,
			upgradePrice: [20, 49999, 99999, 149999, 299999],
			upgradeDurability: [20, 30, 60, 90, 120],
			repairPrice: [0, 20, 20, 20, 20],
			repairDurability: [0, 10, 25, 40, 60],
			durabilityField: 'armordurability'
		},
		pickaxe: {
			nama: 'Pickaxe', emoji: '⛏️',
			maxLevel: 4,
			upgradePrice: [20, 56000, 120, 160000, 200],
			upgradeDurability: [0, 25, 55, 75, 120],
			repairPrice: [0, 20, 20, 20, 20],
			repairDurability: [0, 10, 25, 40, 60],
			durabilityField: 'pickaxedurability'
		},
		axe: {
			nama: 'Axe', emoji: '🪓',
			maxLevel: 4,
			upgradePrice: [10000, 50000, 90000, 140000, 200],
			upgradeDurability: [0, 25, 55, 75, 120],
			repairPrice: [0, 20, 20, 20, 20],
			repairDurability: [0, 10, 25, 40, 60],
			durabilityField: 'axedurability'
		},
		sword: {
			nama: 'Sword', emoji: '🗡️',
			maxLevel: 4,
			upgradePrice: [25000, 60000, 150000, 200, 270000],
			upgradeDurability: [0, 15, 40, 65, 100],
			repairPrice: [0, 20, 20, 20, 20],
			repairDurability: [0, 10, 25, 40, 60],
			durabilityField: 'sworddurability'
		},
		bow: {
			nama: 'Bow', emoji: '🏹',
			maxLevel: 4,
			upgradePrice: [20, 60000, 130000, 190000, 240000],
			upgradeDurability: [0, 15, 40, 65, 100],
			repairPrice: [0, 20, 20, 20, 20],
			repairDurability: [0, 10, 25, 40, 60],
			durabilityField: 'bowdurability'
		},
		fishingrod: {
			nama: 'Fishingrod', emoji: '🎣',
			maxLevel: 4,
			upgradePrice: [15000, 49000, 90000, 120, 150000],
			upgradeDurability: [0, 25, 55, 75, 120],
			repairPrice: [0, 20, 20, 20, 20],
			repairDurability: [0, 10, 25, 40, 60],
			durabilityField: 'fishingroddurability'
		}
	}

	// Inisialisasi field dasar
	if (typeof user.diamond !== 'number') user.diamond = 0
	for (var key of Object.keys(equip)) {
		if (typeof user[key] !== 'number') user[key] = 0
		if (typeof user[equip[key].durabilityField] !== 'number') user[equip[key].durabilityField] = 0
	}

	// Teks daftar (untuk default)
	var list = `
*「 U P G R A D E 」*

${Object.entries(equip).map(([key, e]) => {
	var level = user[key]
	var dur = user[e.durabilityField]
	var maxDur = e.upgradeDurability[e.maxLevel] || 100
	var status = level === 0 ? '(Belum memiliki)' : level >= e.maxLevel ? '(Level max)' : ''
	return `▧ *${e.emoji} ${e.nama}:* ${level}/${e.maxLevel} ${status}\n〉  *Durability:* ${dur}/${maxDur}`
}).join('\n')}

*Cara pakai:*
${usedPrefix}upgrade <item> → upgrade level
${usedPrefix}repair <item> → repair durability

*Contoh:*
${usedPrefix}upgrade pickaxe
${usedPrefix}repair sword
`.trim()

	var type = (args[0] || '').toLowerCase()

	// Guard: tipe valid
	if (!equip[type]) return conn.sendMessage(m.chat, { text: list }, { quoted: m })

	var e = equip[type]
	var level = user[type]
	var durField = e.durabilityField
	var dur = user[durField]

	// === REPAIR ===
	if (/repair/i.test(command)) {
		// Guard: punya item
		if (level === 0) return m.reply(`Kamu belum mempunyai ${e.nama}`)

		// Guard: durability penuh
		var maxDur = e.upgradeDurability[level] || 100
		if (dur >= maxDur) return m.reply(`${e.nama} mu belum ada kerusakan`)

		// Harga repair
		var harga = e.repairPrice[level] || 0
		var tambah = e.repairDurability[level] || 0

		// Guard: diamond cukup
		if (user.diamond < harga) {
			return m.reply(`Diamond Mu Tidak Cukup Untuk Merepair ${e.nama} ${e.emoji} Seharga ${harga} Diamond 💎`)
		}

		// Proses repair
		user.diamond -= harga
		user[durField] = Math.min(maxDur, dur + tambah)

		return m.reply(`✔️ Sukses Mengrepair ${e.nama} ${e.emoji} Seharga ${harga} Diamond 💎\n➕ ${tambah} Durability (${user[durField]}/${maxDur})`)
	}

	// === UPGRADE ===
	if (/up|upgrade/i.test(command)) {
		// Guard: punya item
		if (level === 0) return m.reply(`Kamu belum mempunyai ${e.nama}`)

		// Guard: level max
		if (level >= e.maxLevel) return m.reply(`${e.nama} mu udah *Level Max*`)

		// Harga upgrade
		var harga = e.upgradePrice[level] || 0
		var durBaru = e.upgradeDurability[level + 1] || 100

		// Guard: diamond cukup
		if (user.diamond < harga) {
			return m.reply(`Diamond Mu Tidak Cukup Untuk Mengupgrade ${e.nama} ${e.emoji} Seharga ${harga} Diamond 💎`)
		}

		// Proses upgrade
		user.diamond -= harga
		user[type] += 1
		user[durField] = durBaru

		return m.reply(`✔️ Sukses Mengupgrade ${e.nama} ${e.emoji} Seharga ${harga} Diamond 💎\nLevel: ${user[type]}/${e.maxLevel}\nDurability: ${durBaru}`)
	}
}

handler.help = ['repair', 'upgrade']
handler.tags = ['rpg']
handler.register = true
handler.command = /^(up|upgrade|repair)$/i

module.exports = handler
