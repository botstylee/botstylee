var pets = {
	fox: { exp: 'foxexp', last: 'foxlastfeed', food: 'makananpet', gain: 20 },
	rhinoceros: { exp: 'rhinocerosexp', last: 'rhinoceroslastfeed', food: 'makananpet', gain: 15 },
	lion: { exp: 'lionexp', last: 'lionlastfeed', food: 'makananpet', gain: 15 },
	horse: { exp: 'horseexp', last: 'horselastfeed', food: 'makananpet', gain: 20 },
	wolf: { exp: 'wolfexp', last: 'wolflastfeed', food: 'makananpet', gain: 15 },
	dragon: { exp: 'dragonexp', last: 'dragonlastfeed', food: 'makanandragon', gain: 10 },
	kyubi: { exp: 'kyubiexp', last: 'kyubilastfeed', food: 'makanankyubi', gain: 10 },
	centaur: { exp: 'centaurexp', last: 'centaurlastfeed', food: 'makanancentaur', gain: 10 },
	griffin: { exp: 'griffinexp', last: 'griffinlastfeed', food: 'makanangriffin', gain: 10 },
	phonix: { exp: 'phonixexp', last: 'phonixlastfeed', food: 'makananphonix', gain: 10 },
	cat: { exp: 'catexp', last: 'catlastfeed', food: 'makananpet', gain: 20 }
}
var handler = async (m, { args = [], usedPrefix, command }) => {
	var user = global.db?.data?.users?.[m.sender]
	if (!user) throw 'Data pengguna belum tersedia.'
	var type = String(args[0] || '').toLowerCase()
	if (!type) return m.reply(`*Pet yang bisa diberi makan:* ${Object.keys(pets).join(', ')}\nContoh: ${usedPrefix}${command} cat`)
	var pet = pets[type]
	if (!pet) return m.reply(`Jenis pet tidak dikenal. Ketik ${usedPrefix}${command} untuk daftar.`)
	var level = Number(user[type]) || 0
	if (level <= 0) return m.reply(`Kamu belum memiliki pet ${type}.`)
	if (level >= 5) return m.reply(`Pet ${type} sudah level maksimal.`)
	var now = Date.now()
	var remaining = 600000 - (now - (Number(user[pet.last]) || 0))
	if (remaining > 0) return m.reply(`Pet ${type} masih kenyang. Coba lagi dalam ${clockString(remaining)}.`)
	if ((Number(user[pet.food]) || 0) < 1) return m.reply(`Makanan untuk pet tidak cukup (${pet.food}).`)
	user[pet.food] = (Number(user[pet.food]) || 0) - 1
	user[pet.exp] = (Number(user[pet.exp]) || 0) + pet.gain
	user[pet.last] = now
	var requiredExp = level * 1000
	var leveledUp = user[pet.exp] >= requiredExp
	if (leveledUp) {
		user[type] = level + 1
		user[pet.exp] -= requiredExp
	}
	return m.reply(`Pet ${type} berhasil diberi makan. ${leveledUp ? `Naik ke level ${user[type]}!` : `EXP: ${user[pet.exp]}/${requiredExp}`}`)
}
handler.help = ['feed [jenis pet]']
handler.tags = ['rpg']
handler.command = /^(feed(ing)?)$/i
handler.register = true
module.exports = handler
function clockString(ms) {
	var totalSeconds = Math.ceil(Math.max(0, ms) / 1000)
	return [Math.floor(totalSeconds / 3600), Math.floor(totalSeconds / 60) % 60, totalSeconds % 60].map(value => String(value).padStart(2, '0')).join(':')
}
