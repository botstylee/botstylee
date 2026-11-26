// plugins/rpg-monthly.cjs
// Fitur: Klaim hadiah bulanan (exp, money, potion, mythic, legendary)

var rewards = {
	exp: 50000,
	money: 49999,
	potion: 10,
	mythic: 3,
	legendary: 1
}

var cooldown = 2592000000 // 30 hari

var handler = async (m) => {
	// Guard: user harus terdaftar
	var user = db.data.users[m.sender]
	if (!user) return m.reply('Kamu belum terdaftar di database.')

	// Inisialisasi field
	if (typeof user.lastmonthly !== 'number') user.lastmonthly = 0
	for (var key of Object.keys(rewards)) {
		if (typeof user[key] !== 'number') user[key] = 0
	}

	// Hitung cooldown
	var __timers = new Date() - user.lastmonthly
	var _timers = cooldown - __timers

	// Guard: cooldown
	if (__timers < cooldown) {
		var timeStr = typeof _timers.toTimeString === 'function'
			? _timers.toTimeString()
			: Math.ceil(_timers / 1000) + ' detik'
		throw `You have already claimed this monthly claim, wait for *${timeStr}*`
	}

	// Beri reward
	var text = ''
	for (var reward of Object.keys(rewards)) {
		user[reward] += rewards[reward]
		var emoji = typeof global.rpg?.emoticon === 'function' ? global.rpg.emoticon(reward) : ''
		text += `*+${rewards[reward]}* ${emoji}${reward}\n`
	}

	// Update cooldown
	user.lastmonthly = new Date() * 1

	await m.reply(text.trim())
}

handler.help = ['monthly']
handler.tags = ['rpg']
handler.command = /^(monthly)$/i

handler.cooldown = cooldown

module.exports = handler
