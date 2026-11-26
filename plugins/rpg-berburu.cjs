// plugins/rpg-berburu.cjs
// Fitur: Berburu hewan untuk dapat resource

var handler = async (m, {
	conn,
	usedPrefix
}) => {
	// Guard: user harus terdaftar
	var user = global.db.data.users[m.sender]
	if (!user) return m.reply('Kamu belum terdaftar di database.')

	// Pastikan field penting ada
	if (typeof user.stamina !== 'number') user.stamina = 100
	if (typeof user.sword !== 'number') user.sword = 0
	if (typeof user.sworddurability !== 'number') user.sworddurability = 0
	if (typeof user.lasthunt !== 'number') user.lasthunt = 0

	// Hitung cooldown
	var __timers = new Date() - user.lasthunt
	var _timers = 500000 - __timers
	var timers = clockString(_timers)

	// Guard: stamina
	if (user.stamina < 20) {
		return m.reply(`Stamina anda tidak cukup untuk berburu\nharap isi stamina anda dengan _${usedPrefix}eat_`)
	}

	// Guard: sword
	if (user.sword < 1) {
		return m.reply(`*Kamu tidak memiliki sword*\n*Silahkan membeli sword di shop dengan mengetik _${usedPrefix}craft sword_ agar kamu bisa berburu*`)
	}

	// Guard: durability
	if (user.sworddurability < 10) {
		return m.reply(`Durability sword anda kurang\nSilahkan repair sword agar bisa berburu dengan menggunakan command _${usedPrefix}repair sword_`)
	}

	// Guard: cooldown (BENAR: __timers < 500000, bukan user.lasthunt > 500000)
	if (__timers < 500000) {
		return m.reply(`Kamu masih kelelahan untuk berburu\nHarap tunggu ${timers} lagi untuk berburu`)
	}

	// Generate random hasil
	var rbrb = Array.from({ length: 12 }, () => Math.floor(Math.random() * 10))

	// Susun hasil
	var hsl = `
* Hasil Berburu Kali Ini *

 *🐂 = [ ${rbrb[0]} ]*		 	*🐃 = [ ${rbrb[6]} ]*
 *🐅 = [ ${rbrb[1]} ]*			 *🐮 = [ ${rbrb[7]} ]*
 *🐘 = [ ${rbrb[2]} ]*			 *🐒 = [ ${rbrb[8]} ]*
 *🐐 = [ ${rbrb[3]} ]*			 *🐗 = [ ${rbrb[9]} ]*
 *🐼 = [ ${rbrb[4]} ]*			 *🐖 = [ ${rbrb[10]} ]*
 *🐊 = [ ${rbrb[5]} ]*	     	*🐓 = [ ${rbrb[11]} ]*
 
 Stamina anda berkurang -20
`.trim()

	// Update resource (pakai || 0 biar tidak NaN)
	user.banteng = (user.banteng || 0) + rbrb[0]
	user.harimau = (user.harimau || 0) + rbrb[1]
	user.gajah = (user.gajah || 0) + rbrb[2]
	user.kambing = (user.kambing || 0) + rbrb[3]
	user.panda = (user.panda || 0) + rbrb[4]
	user.buaya = (user.buaya || 0) + rbrb[5]
	user.kerbau = (user.kerbau || 0) + rbrb[6]
	user.sapi = (user.sapi || 0) + rbrb[7]
	user.monyet = (user.monyet || 0) + rbrb[8]
	user.babihutan = (user.babihutan || 0) + rbrb[9]
	user.babi = (user.babi || 0) + rbrb[10]
	user.ayam = (user.ayam || 0) + rbrb[11]
	user.stamina -= 20

	// Update cooldown & durability
	user.lasthunt = new Date() * 1
	user.sworddurability -= 10

	// Kirim pesan berurutan (pakai await + delay, bukan setTimeout)
	await m.reply('_Sedang Berburu..._')
	await delay(15000)
	await m.reply('*menemukan target*')
	await delay(5000)
	await m.reply('PIW PIW PIW')
	await delay(5000)
	await m.reply('NGIOONG')
	await delay(5000)
	await m.reply('*DUAR*')
	await delay(10000)
	await m.reply(hsl)
}

handler.help = ['berburu']
handler.tags = ['berburu']
handler.command = /^(berburu)$/i
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
	return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}
