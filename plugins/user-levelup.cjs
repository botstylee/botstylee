let levelling = require('../lib/levelling.cjs')

let handler = m => {
 let name = conn.getName(m.sender)
  let user = global.db.data.users[m.sender]
  if (!levelling.canLevelUp(user.level, user.exp, global.multiplier)) {
    let { min, xp, max } = levelling.xpRange(user.level, global.multiplier)
    throw `
Level *${user.level} (${user.exp - min}/${xp})*
Kurang *${max - user.exp}* lagi! 
`.trim()
  }
  let before = user.level * 1
	while (levelling.canLevelUp(user.level, user.exp, global.multiplier)) user.level++
	if (before !== user.level) {
	          m.reply(`
Wis ada yg naik level nih ke level *${user.level}*, selamat ya *${name}*
	`.trim())
      }
}

handler.help = ['levelup']
handler.tags = ['user']

handler.command = /^levelup$/i

module.exports = handler