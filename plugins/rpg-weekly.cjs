// plugins/rpg-weekly.cjs
// Fitur: Klaim hadiah mingguan (exp, money, potion, mythic, legendary)

var rewards = {
	exp: 40000,
	money: 20000,
	potion: 5,
	mythic: 3,
	legendary: 1
}

var cooldown = 604800000 // 7 hari

var handler = async (m) => {
	// Guard: user harus terdaftar
	var user = db.data.users[m.sender]
	if (!user) return m.reply('Kamu belum terdaftar di database.')

	// Inisialisasi field
	if (typeof user.lastweekly !== 'number') user.lastweekly = 0
	for (var key of Object.keys(rewards)) {
		if (typeof user[key] !== 'number') user[key] = 0
	}

	// Hitung cooldown
	var __timers = new Date() - user.lastweekly
	var _timers = cooldown - __timers

	// Guard: cooldown
	if (__timers < cooldown) {
		var timeStr = typeof _timers.toTimeString === 'function'
			? _timers.toTimeString()
			: Math.ceil(_timers / 1000) + ' detik'
		throw `You have already claimed this weekly claim, wait for *${timeStr}*`
	}

	// Beri reward
	var text = ''
	for (var reward of Object.keys(rewards)) {
		user[reward] += rewards[reward]
		var emoji = typeof global.rpg?.emoticon === 'function' ? global.rpg.emoticon(reward) : ''
		text += `*+${rewards[reward]}* ${emoji}${reward}\n`
	}

	// Update cooldown
	user.lastweekly = new Date() * 1

	await m.reply(text.trim())
}

handler.help = ['weekly']
handler.tags = ['rpg']
handler.command = /^(weekly)$/i

handler.cooldown = cooldown

module.exports = handler
