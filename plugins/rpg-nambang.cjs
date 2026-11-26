// plugins/rpg-mining.cjs
// Fitur: Nambang untuk dapat ore (butuh pickaxe, durability, stamina)

var handler = async (m, {
	conn,
	usedPrefix
}) => {
	// Guard: user harus terdaftar
	var user = db.data.users[m.sender]
	if (!user) return m.reply('Kamu belum terdaftar di database.')

	// Inisialisasi field
	if (typeof user.pickaxe !== 'number') user.pickaxe = 0
	if (typeof user.pickaxedurability !== 'number') user.pickaxedurability = 0
	if (typeof user.stamina !== 'number') user.stamina = 100
	if (typeof user.lastmining !== 'number') user.lastmining = 0

	// Hasil nambang
	var hasilFields = ['diamond', 'iron', 'gold', 'emerald', 'rock', 'clay', 'coal', 'sand', 'exp']
	for (var f of hasilFields) {
		if (typeof user[f] !== 'number') user[f] = 0
	}

	// Guard: pickaxe
	if (user.pickaxe < 1) {
		return m.reply(`*Kamu tidak memiliki Pickaxe*\n*Silahkan membeli Pickaxe di shop dengan mengetik _${usedPrefix}buy pickaxe_ atau _${usedPrefix}craft pickaxe_ agar kamu bisa nambang*`)
	}

	// Guard: durability
	if (user.pickaxedurability < 10) {
		return m.reply(`Durability pickaxe anda kurang\nSilahkan repair pickaxe agar bisa nambang dengan menggunakan command _${usedPrefix}repair pickaxe_`)
	}

	// Guard: stamina
	if (user.stamina < 20) {
		return m.reply(`Stamina anda tidak cukup untuk bekerja\nHarap isi stamina anda dengan _${usedPrefix}eat_`)
	}

	// Hitung cooldown
	var __timers = new Date() - user.lastmining
	var _timers = 500000 - __timers
	var timers = clockString(_timers)

	// Guard: cooldown
	if (__timers <= 500000) {
		var txt = `\n*Sepertinya Anda Sudah Kecapekan*\n*Silahkan Istirahat Dulu sekitar ${timers}*\n*Untuk bisa melanjutkan Nambang*\n`
		return conn.sendMessage(m.chat, { text: txt }, { quoted: m })
	}

	// Generate random hasil (max berbeda per item)
	var maxValues = [5, 10, 4, 7, 200, 200, 20, 100, 100]
	var rbrb = maxValues.map(max => Math.floor(Math.random() * max))

	// Susun hasil
	var hsl = `
*《 Hasil Nambang Kali Ini 》*

 *💎 = [ ${rbrb[0]} ] Diamond*
 *⛓️ = [ ${rbrb[1]} ] Iron*
 *🪙 = [ ${rbrb[2]} ] Gold*
 *💚 = [ ${rbrb[3]} ] Emerald*
 *🪨 = [ ${rbrb[4]} ] Rock*
 *🌕 = [ ${rbrb[5]} ] Clay*
 *🕳️ = [ ${rbrb[6]} ] Coal*
 *🌑 = [ ${rbrb[7]} ] Sand*
 *✉️ = [ ${rbrb[8]} ] Exp*
 
 Stamina anda berkurang -20
`.trim()

	// Update hasil (pakai || 0 biar tidak NaN)
	user.diamond = (user.diamond || 0) + rbrb[0]
	user.iron = (user.iron || 0) + rbrb[1]
	user.gold = (user.gold || 0) + rbrb[2]
	user.emerald = (user.emerald || 0) + rbrb[3]
	user.rock = (user.rock || 0) + rbrb[4]
	user.clay = (user.clay || 0) + rbrb[5]
	user.coal = (user.coal || 0) + rbrb[6]
	user.sand = (user.sand || 0) + rbrb[7]
	user.exp = (user.exp || 0) + rbrb[8]

	// Update cooldown, durability, stamina
	user.lastmining = new Date() * 1
	user.pickaxedurability -= 5
	user.stamina -= 20

	// Kirim pesan berurutan (pakai await + delay, bukan setTimeout)
	await m.reply('Masuk ke tambang dulu ngab')
	await delay(14000)
	await m.reply('Sabar')
	await delay(1000)
	await m.reply('mulai menggali ore')
	await delay(3000)
	await m.reply('Nah ini dia')
	await delay(2000)
	await m.reply(hsl)
}

handler.help = ['mining', 'nambang']
handler.tags = ['rpg']
handler.command = /^(nambang|mining)$/i
handler.register = true

module.exports = handler

/**
 * Konversi ms ke format HH:MM:SS
 * @param {number} ms
 * @returns {string}
 */
function clockString(ms) {
	var h = Math.floor(ms / 3600000)
	var m = Math.floor(ms / 60000) % 60
	var s = Math.floor(ms / 1000) % 60
	return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':')
}
