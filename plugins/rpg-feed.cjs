// plugins/rpg-feed.cjs
// Fitur: Feed pet untuk menaikkan level

var handler = async (m, {
	conn,
	command,
	usedPrefix,
	args
}) => {
	// Guard: user harus terdaftar
	var user = db.data.users[m.sender]
	if (!user) return m.reply('Kamu belum terdaftar di database.')

	// Konfigurasi pet
	var pets = {
		cat: { expField: 'catexp', lastField: 'catlastclaim', foodField: 'makananpet', expPerFeed: 20, expPerLevel: 1000 },
		fox: { expField: 'foxexp', lastField: 'foxlastclaim', foodField: 'makananpet', expPerFeed: 20, expPerLevel: 1000 },
		horse: { expField: 'horseexp', lastField: 'horselastclaim', foodField: 'makananpet', expPerFeed: 20, expPerLevel: 1000 },
		lion: { expField: 'lionexp', lastField: 'lionlastclaim', foodField: 'makananpet', expPerFeed: 15, expPerLevel: 1000 },
		rhinoceros: { expField: 'rhinocerosexp', lastField: 'rhinoceroslastclaim', foodField: 'makananpet', expPerFeed: 15, expPerLevel: 1000 },
		wolf: { expField: 'wolfexp', lastField: 'wolflastclaim', foodField: 'makananpet', expPerFeed: 15, expPerLevel: 10000 },
		dragon: { expField: 'dragonexp', lastField: 'dragonlastclaim', foodField: 'makanandragon', expPerFeed: 10, expPerLevel: 10000 },
		kyubi: { expField: 'kyubiexp', lastField: 'kyubilastclaim', foodField: 'makanankyubi', expPerFeed: 10, expPerLevel: 10000 },
		centaur: { expField: 'centaurexp', lastField: 'centaurlastclaim', foodField: 'makanancentaur', expPerFeed: 10, expPerLevel: 10000 },
		phonix: { expField: 'phonixexp', lastField: 'phonixlastclaim', foodField: 'makananphonix', expPerFeed: 10, expPerLevel: 10000 },
		griffin: { expField: 'griffinexp', lastField: 'griffinlastclaim', foodField: 'makanangriffin', expPerFeed: 10, expPerLevel: 10000 }
	}

	// Inisialisasi field dasar
	if (typeof user.makananpet !== 'number') user.makananpet = 0
	for (var key of Object.keys(pets)) {
		if (typeof user[key] !== 'number') user[key] = 0
		if (typeof user[pets[key].expField] !== 'number') user[pets[key].expField] = 0
		if (typeof user[pets[key].lastField] !== 'number') user[pets[key].lastField] = 0
		if (typeof user[pets[key].foodField] !== 'number') user[pets[key].foodField] = 0
	}

	var type = (args[0] || '').toLowerCase()

	// Teks daftar (untuk default)
	var list = `
Contoh penggunaan: *${usedPrefix + command} cat*

*List Pet:*
▧ cat
▧ fox
▧ horse
▧ lion
▧ rhinoceros
▧ dragon
▧ centaur
▧ kyubi
▧ griffin
▧ phonix
▧ wolf

*Cara pakai:* ${usedPrefix + command} <pet>
Contoh: ${usedPrefix + command} cat
`.trim()

	// Cek pet valid
	if (!pets[type]) {
		return conn.sendMessage(m.chat, { text: list }, { quoted: m })
	}

	var pet = pets[type]
	var level = user[type]
	var exp = user[pet.expField]
	var last = user[pet.lastField]
	var food = user[pet.foodField]
	var cooldown = 600000 // 10 menit

	// Guard: tidak punya pet
	if (level === 0) return m.reply(`*You not have a pet ${type}*`)

	// Guard: level max
	if (level >= 5) return m.reply('*Your pet is already level max*')

	// Hitung cooldown
	var __timers = new Date() - last
	var _timers = cooldown - __timers
	var timers = clockString(_timers)

	// Guard: cooldown
	if (__timers < cooldown) {
		return m.reply(`Pet kamu sudah kenyang, coba kasih makan *${timers}* lagi`)
	}

	// Guard: makanan cukup
	if (food < 1) {
		return m.reply('Makanan pet kamu tidak cukup')
	}

	// Proses feed
	user[pet.foodField] -= 1
	user[pet.expField] += pet.expPerFeed
	user[pet.lastField] = new Date() * 1

	await m.reply(`✅ Feeding ${type} success`)

	// Cek naik level
	var naiklvl = (level * pet.expPerLevel) - 1
	if (user[pet.expField] > naiklvl) {
		user[type] += 1
		user[pet.expField] -= (level * pet.expPerLevel)
		await m.reply(`🎉 *Congratulations your pet ${type} level up*`)
	}
}

handler.help = ['feed [pet type]']
handler.tags = ['rpg']
handler.command = /^(feed(ing)?)$/i
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
