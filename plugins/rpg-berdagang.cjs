// plugins/rpg-berdagang.cjs
// Fitur: Berdagang dengan user lain untuk dapat money

var handler = async (m, {
	conn,
	text
}) => {
	// Guard: harus ada target
	var who
	if (m.isGroup) who = m.mentionedJid[0]
	else who = m.chat
	if (!who) throw 'Tag salah satu lah, yang kamu ingin berdagang bareng'

	// Guard: tidak bisa berdagang dengan diri sendiri
	if (who === m.sender) throw 'Tidak bisa berdagang dengan diri sendiri.'

	// Guard: user harus terdaftar
	var users = db.data.users
	var user = users[m.sender]
	if (!user) throw 'Kamu belum terdaftar di database.'

	var target = users[who]
	if (!target) throw 'Target tidak terdaftar di database.'

	// Pastikan field penting ada
	if (typeof user.money !== 'number') user.money = 0
	if (typeof target.money !== 'number') target.money = 0
	if (typeof user.lastdagang !== 'number') user.lastdagang = 0

	// Hitung cooldown
	var __timers = new Date() - user.lastdagang
	var _timers = 28800000 - __timers
	var timers = clockString(_timers)

	// Guard: cooldown
	if (__timers < 28800000) {
		return conn.reply(m.chat, `Anda Sudah Berdagang, tunggu ${timers} lagi..`, m)
	}

	// Guard: modal minimal 5000
	if (user.money < 5000) throw 'Kamu tidak memiliki modal harap masukkan modal 5000'
	if (target.money < 5000) throw 'Target tidak memiliki modal harap masukkan modal 5000'

	// Modal yang dipakai (random 1000–4999, biar tidak 0)
	var dapat = Math.floor(Math.random() * 4000) + 1000

	// Pastikan modal cukup setelah dikurangi
	if (user.money - dapat < 0) throw 'Modal kamu tidak cukup.'
	if (target.money - dapat < 0) throw 'Modal target tidak cukup.'

	// Kurangi modal
	user.money -= dapat
	target.money -= dapat

	// Update cooldown
	user.lastdagang = new Date() * 1

	// Hitung reward (langsung, tidak pakai setTimeout 8 jam)
	// Reward: modal kembali + profit 5000 per orang
	var profit = 5000
	user.money += dapat + profit
	target.money += dapat + profit

	// Susun pesan
	var txt = `*BERDAGANG BERHASIL* 🛒\n\n` +
		`Kamu dan @${who.split('@')[0]} telah berdagang!\n\n` +
		`*Modal awal:* ${dapat} money\n` +
		`*Profit:* +${profit} money\n\n` +
		`*Money kamu sekarang:* ${user.money}\n` +
		`*Money @${who.split('@')[0]} sekarang:* ${target.money}\n\n` +
		`_Cooldown: 8 jam_`

	return conn.reply(m.chat, txt, m, { mentions: [who] })
}

handler.help = ['berdagang *@tag*']
handler.tags = ['rpg']
handler.command = /^berdagang$/
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
