let levelling = require('../lib/levelling.cjs')

let handler = m => {
	let name = conn.getName(m.sender)
	let user = db.data.users[m.sender]
	if (!levelling.canLevelUp(user.level, user.exp, global.multiplier)) {
		let {
			min,
			xp,
			max
		} = levelling.xpRange(user.level, global.multiplier)
		throw `
Level *${user.level} (${user.exp - min}/${xp})*
Kurang *${max - user.exp}* lagi! 
`.trim()
	}
	let role = ((user.level >= 1) && (user.level <= 10)) ? 'Bronze' :
		((user.level >= 10) && (user.level <= 20)) ? 'Bronze I' :
		((user.level >= 20) && (user.level <= 30)) ? 'Silver' :
		((user.level >= 30) && (user.level <= 40)) ? 'Silver I' :
		((user.level >= 40) && (user.level <= 50)) ? 'Gold' :
		((user.level >= 50) && (user.level <= 60)) ? 'Platinum' :
		((user.level >= 60) && (user.level <= 70)) ? 'Diamond' :
		((user.level >= 70) && (user.level <= 80)) ? 'Master' :
		'Pinnacle'
	let before = user.level * 1
	while (levelling.canLevelUp(user.level, user.exp, global.multiplier)) user.level++
	if (before !== user.level) {
		m.reply(`
Wis ada yg naik level nih ke level *${user.level}*, selamat ya *${name}*
	`.trim())
	}
	user.role = role
}

handler.help = ['levelup']
handler.tags = ['user']

handler.command = /^levelup$/i

module.exports = handler