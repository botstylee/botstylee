// plugins/rpg-heal.cjs
// Fitur: Heal (pakai potion untuk menambah health)

var handler = async (m, {
	args,
	usedPrefix
}) => {
	// Guard: user harus terdaftar
	var user = db.data.users[m.sender]
	if (!user) return m.reply('Kamu belum terdaftar di database.')

	// Inisialisasi field
	if (typeof user.health !== 'number') user.health = 100
	if (typeof user.potion !== 'number') user.potion = 0
	if (typeof user.cat !== 'number') user.cat = 0

	var maxHealth = 100

	// Guard: health sudah penuh
	if (user.health >= maxHealth) {
		return m.reply('Your ❤️health is full!')
	}

	// Hitung heal per potion (base 40 + bonus dari cat)
	var heal = 40 + (user.cat * 4)

	// Hitung count
	var count
	if (isNumber(args[0])) {
		count = Math.max(1, parseInt(args[0]))
	} else {
		// Hitung otomatis: berapa potion yang dibutuhkan untuk full health
		count = Math.max(1, Math.ceil((maxHealth - user.health) / heal))
	}

	// Guard: potion cukup
	if (user.potion < count) {
		return m.reply(`Your 🥤Potion is not enough, you only have *${user.potion}* 🥤Potion\ntype *${usedPrefix}buy potion ${count - user.potion}* to buy 🥤Potion`)
	}

	// Proses heal
	user.potion -= count
	user.health = Math.min(maxHealth, user.health + heal * count)

	await m.reply(`Successful use of *${count}* 🥤Potion(s)\n❤️Health: *${user.health}/${maxHealth}*`)
}

handler.help = ['heal']
handler.tags = ['rpg']
handler.command = /^(heal)$/i

module.exports = handler

/**
 * Cek apakah nilai adalah number valid
 * @param {any} number
 * @returns {boolean}
 */
function isNumber(number) {
	if (!number) return false
	number = parseInt(number)
	return typeof number === 'number' && !isNaN(number)
}
