// plugins/rpg-nebang.cjs
// Fitur: Nebang pohon untuk dapat kayu, money, exp (butuh axe, durability, stamina)

var handler = async (m, {
	conn,
	usedPrefix
}) => {
	// Guard: user harus terdaftar
	var user = db.data.users[m.sender]
	if (!user) return m.reply('Kamu belum terdaftar di database.')

	// Inisialisasi field
	if (typeof user.stamina !== 'number') user.stamina = 100
	if (typeof user.axe !== 'number') user.axe = 0
	if (typeof user.axedurability !== 'number') user.axedurability = 0
	if (typeof user.lastlumber !== 'number') user.lastlumber = 0
	if (typeof user.money !== 'number') user.money = 0
	if (typeof user.kayu !== 'number') user.kayu = 0
	if (typeof user.exp !== 'number') user.exp = 0

	var cooldown = 10800000 // 3 jam

	// Hitung cooldown
	var __timers = new Date() - user.lastlumber
	var _timers = cooldown - __timers
	var timers = clockString(_timers)

	// Guard: stamina
	if (user.stamina < 20) {
		return m.reply(`Stamina anda tidak cukup untuk menebang\nHarap isi stamina anda dengan _${usedPrefix}eat_`)
	}

	// Guard: axe
	if (user.axe < 1) {
		return m.reply(`*Kamu tidak memiliki axe*\n*Silahkan membeli axe di shop dengan mengetik _${usedPrefix}craft axe_ agar kamu bisa menebang*`)
	}

	// Guard: durability
	if (user.axedurability < 10) {
		return m.reply(`Durability axe anda kurang\nSilahkan repair axe agar bisa menebang dengan menggunakan command _${usedPrefix}repair axe_`)
	}

	// Guard: cooldown (BENAR: __timers < cooldown, bukan lastlumber > 500000)
	if (__timers < cooldown) {
		return m.reply(`Kamu masih kelelahan untuk Menebang\nHarap tunggu ${timers} lagi untuk menebang`)
	}

	// Proses nebang
	user.axedurability -= 5
	user.stamina -= 20
	user.money += 30000
	user.kayu += 300
	user.exp += 100
	user.lastlumber = new Date() * 1

	// Kirim pesan berurutan (pakai await + delay, bukan setTimeout)
	await m.reply('_*Proses Menebang...*_')
	await delay(5000)
	await m.reply('*Nguenggg*')
	await delay(5000)
	await m.reply('*Mengambil Batang Pohon*')
	await delay(5000)
	await m.reply('*Menaruh Ke Dalam Gudang*')
	await delay(5000)
	await m.reply('*Mengecek hasil*')
	await delay(10000)
	await m.reply(`Kamu Menjadi Penebang Pohon Dan Kamu Mendapat *30000* money, *100* exp dan *300* kayu\nStamina anda berkurang -20`)
}

handler.help = ['nebang']
handler.tags = ['rpg']
handler.command = /^(nebang)$/i
handler.register = true
handler.fail = null

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
