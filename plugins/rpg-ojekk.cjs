// plugins/rpg-ngojek.cjs
// Fitur: Ngojek untuk dapat uang & exp (butuh stamina)

var handler = async (m, {
	conn,
	usedPrefix
}) => {
	// Guard: user harus terdaftar
	var user = db.data.users[m.sender]
	if (!user) return m.reply('Kamu belum terdaftar di database.')

	// Inisialisasi field
	if (typeof user.stamina !== 'number') user.stamina = 100
	if (typeof user.lastngojek !== 'number') user.lastngojek = 0
	if (typeof user.money !== 'number') user.money = 0
	if (typeof user.exp !== 'number') user.exp = 0

	var cooldown = 10800000 // 3 jam

	// Hitung cooldown
	var __timers = new Date() - user.lastngojek
	var _timers = cooldown - __timers
	var timers = clockString(_timers)

	// Guard: stamina
	if (user.stamina < 20) {
		return m.reply(`Stamina anda tidak cukup untuk bekerja\nHarap isi stamina anda dengan _${usedPrefix}eat_`)
	}

	// Guard: cooldown (BENAR: __timers < cooldown, bukan lastgrab > 10800000)
	if (__timers < cooldown) {
		return m.reply(`Kamu masih kelelahan untuk bekerja\nHarap tunggu ${timers} lagi untuk ngojek`)
	}

	// Generate random hasil (minimal 1, biar tidak 0)
	var rbrb1 = (Math.floor(Math.random() * 10) + 1) * 1000
	var rbrb2 = (Math.floor(Math.random() * 10) + 1) * 10

	// Animasi
	var beni = `
🚶⬛⬛⬛⬛⬛⬛⬛⬛⬛
⬛⬜⬜⬜⬛⬜⬜⬜⬛⬛
⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
🏘️🏘️🏘️🏘️🌳  🌳 🏘️       🛵


✔️ Mendapatkan orderan....
`.trim()

	var beni2 = `
🚶🛵⬛⬛⬛⬛⬛⬛⬛⬛
⬛⬜⬜⬜⬛⬜⬜⬜⬛⬛
⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
🏘️🏘️🏘️🏘️🌳  🌳 🏘️       


➕ Mengantar ke tujuan....
`.trim()

	var beni3 = `
⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
⬛⬜⬜⬛⬛⬜⬜⬜⬛⬛
⬛⬛⬛⬛⬛⬛⬛🛵⬛⬛
🏘️🏘️🏘️🏘️🌳  🌳 🏘️       


➕ Sampai di tujuan....
`.trim()

	var beni4 = `
⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
⬛⬜⬜⬛⬛⬜⬜⬜⬛⬛
⬛⬛⬛⬛⬛⬛⬛🛵⬛⬛
🏘️🏘️🏘️🏘️🌳  🌳 🏘️ 🚶  


➕ 💹Menerima gaji....
`.trim()

	var hsl = `
*—[ Hasil Ngojek ]—*

 ➕ 💹 Uang = [ ${rbrb1} ]
 ➕ ✨ Exp = [ ${rbrb2} ] 		 

Stamina anda berkurang -20
`.trim()

	// Update hasil
	user.money += rbrb1
	user.exp += rbrb2
	user.stamina -= 20
	user.lastngojek = new Date() * 1

	// Kirim pesan berurutan (pakai await + delay, bukan setTimeout)
	await m.reply('🔍Mencari pelanggan.....')
	await delay(10000)
	await m.reply(beni)
	await delay(5000)
	await m.reply(beni2)
	await delay(5000)
	await m.reply(beni3)
	await delay(5000)
	await m.reply(beni4)
	await delay(5000)
	await m.reply(hsl)
}

handler.help = ['ojek']
handler.tags = ['rpg']
handler.command = /^(ojek|ngojek|gojek|jadiojek)$/i
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
