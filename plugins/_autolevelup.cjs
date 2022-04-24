const {
	canLevelUp
} = require('../lib/levelling.cjs');
let handler = m => m
handler.before = m => {
	let user = global.db.data.users[m.sender]
	if (!user.autolevelup)
		return !0
	let before = user.level * 1
	while (canLevelUp(user.level, user.exp, global.multiplier))
		user.level++

	if (before !== user.level) {
		m.reply(`
Selamat, anda telah naik level!
*${before}* -> *${user.level}*
gunakan *.profile* untuk mengecek
	`.trim())
	}
}
handler.disabled = true
module.exports = handler