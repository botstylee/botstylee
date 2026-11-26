// plugins/xp-daily.cjs
// Fitur: Klaim hadiah harian (exp, money, potion)

var rewards = {
	exp: 10000,
	money: 5000,
	potion: 5
}

var cooldown = 86400000 // 24 jam

var handler = async (m) => {
	// Guard: user harus terdaftar
	var user = db.data.users[m.sender]
	if (!user) return m.reply('Kamu belum terdaftar di database.')

	// Inisialisasi field yang dibutuhkan
	if (typeof user.lastclaim !== 'number') user.lastclaim = 0
	for (var key of Object.keys(rewards)) {
		if (typeof user[key] !== 'number') user[key] = 0
	}

	// Hitung cooldown
	var __timers = new Date() - user.lastclaim
	var _timers = cooldown - __timers

	// Guard: cooldown
	if (__timers < cooldown) {
		var timeStr = typeof _timers.toTimeString === 'function'
			? _timers.toTimeString()
			: Math.ceil(_timers / 1000) + ' detik'
		throw `You have already claimed this daily claim!, wait for *${timeStr}*`
	}

	// Beri reward
	var text = ''
	for (var reward of Object.keys(rewards)) {
		user[reward] += rewards[reward]
		var emoji = global.rpg?.emoticon?.(reward) || ''
		text += `*+${rewards[reward]}* ${emoji}${reward}\n`
	}

	// Update cooldown
	user.lastclaim = new Date() * 1

	await m.reply(text.trim())
}

handler.help = ['daily', 'claim']
handler.tags = ['xp']
handler.command = /^(daily|claim)$/i

handler.cooldown = cooldown

module.exports = handler
