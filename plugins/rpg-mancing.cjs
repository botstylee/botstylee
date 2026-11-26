// plugins/rpg-mancing.cjs
// Fitur: Mancing untuk dapat ikan (butuh fishingrod, durability, stamina)

var handler = async (m, {
	conn,
	usedPrefix
}) => {
	// Guard: user harus terdaftar
	var user = db.data.users[m.sender]
	if (!user) return m.reply('Kamu belum terdaftar di database.')

	// Inisialisasi field
	if (typeof user.fishingrod !== 'number') user.fishingrod = 0
	if (typeof user.fishingroddurability !== 'number') user.fishingroddurability = 0
	if (typeof user.stamina !== 'number') user.stamina = 100
	if (typeof user.lastfishing !== 'number') user.lastfishing = 0

	// Hasil mancing
	var hasilFields = ['paus', 'kepiting', 'gurita', 'cumi', 'buntal', 'dory', 'lumba', 'lobster', 'hiu', 'udang', 'ikan', 'orca']
	for (var f of hasilFields) {
		if (typeof user[f] !== 'number') user[f] = 0
	}

	// Guard: fishingrod
	if (user.fishingrod < 1) {
		return m.reply(`*Kamu tidak memiliki fishingrod*\n*Silahkan membeli fishingrod di shop dengan mengetik _${usedPrefix}craft fishingrod_ agar kamu bisa mancing*`)
	}

	// Guard: durability
	if (user.fishingroddurability < 5) {
		return m.reply(`Durability fishingrod anda kurang\nSilahkan repair fishingrod agar bisa mancing dengan menggunakan command _${usedPrefix}repair fishingrod_`)
	}

	// Guard: stamina
	if (user.stamina < 10) {
		return m.reply(`Sepertinya stamina anda kurang untuk memancing\nSilahkan isi stamina dengan cara _${usedPrefix}eat_`)
	}

	// Hitung cooldown
	var __timers = new Date() - user.lastfishing
	var _timers = 500000 - __timers
	var timers = clockString(_timers)

	// Guard: cooldown
	if (__timers <= 500000) {
		var txt = `\n*Sepertinya Anda Sudah Kecapekan*\n*Silahkan Istirahat Dulu sekitar ${timers}*\n*Untuk bisa melanjutkan Memancing*\n`
		return conn.sendMessage(m.chat, { text: txt }, { quoted: m })
	}

	// Generate random hasil
	var rbrb = Array.from({ length: 12 }, () => Math.floor(Math.random() * 10))

	// Susun hasil
	var hsl = `
*《 Hasil Memancing Kali Ini 》*

 *🦀 = [ ${rbrb[0]} ]*		 	*🐠 = [ ${rbrb[6]} ]*
 *🦞 = [ ${rbrb[1]} ]*			 *🐟 = [ ${rbrb[7]} ]*
 *🦐 = [ ${rbrb[2]} ]*			 *🐬 = [ ${rbrb[8]} ]*
 *🦑 = [ ${rbrb[3]} ]*			 *🐳 = [ ${rbrb[9]} ]*
 *🐙 = [ ${rbrb[4]} ]*			 *🦈 = [ ${rbrb[10]} ]*
 *🐡 = [ ${rbrb[5]} ]*		 	*🐋 = [ ${rbrb[11]} ]*

Stamina anda berkurang -20
`.trim()

	// Update hasil (pakai || 0 biar tidak NaN)
	user.paus = (user.paus || 0) + rbrb[0]
	user.kepiting = (user.kepiting || 0) + rbrb[1]
	user.gurita = (user.gurita || 0) + rbrb[2]
	user.cumi = (user.cumi || 0) + rbrb[3]
	user.buntal = (user.buntal || 0) + rbrb[4]
	user.dory = (user.dory || 0) + rbrb[5]
	user.lumba = (user.lumba || 0) + rbrb[6]
	user.lobster = (user.lobster || 0) + rbrb[7]
	user.hiu = (user.hiu || 0) + rbrb[8]
	user.udang = (user.udang || 0) + rbrb[9]
	user.ikan = (user.ikan || 0) + rbrb[10]
	user.orca = (user.orca || 0) + rbrb[11]

	// Update cooldown, durability, stamina
	user.lastfishing = new Date() * 1
	user.fishingroddurability -= 5
	user.stamina -= 10

	// Kirim pesan berurutan (pakai await + delay, bukan setTimeout)
	await m.reply('OTW tengah laut')
	await delay(14000)
	await m.reply('Sabar')
	await delay(1000)
	await m.reply('Strike')
	await delay(3000)
	await m.reply('Nah ini dia')
	await delay(2000)
	await m.reply(hsl)
}

handler.help = ['mancing']
handler.tags = ['berburu']
handler.command = /^(mancing)$/i
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
