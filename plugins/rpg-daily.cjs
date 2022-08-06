var rewards = {
	exp: 10000,
	money: 5000,
	potion: 5,
}
var cooldown = 86400000
var handler = async (m) => {
	var user = db.data.users[m.sender]
	if (new Date - user.lastclaim < cooldown) throw `You have already claimed this daily claim!, wait for *${((user.lastclaim + cooldown) - new Date()).toTimeString()}*`
	var text = ''
	for (var reward of Object.keys(rewards)) {
		if (!(reward in user)) continue
		user[reward] += rewards[reward]
		text += `*+${rewards[reward]}* ${global.rpg.emoticon(reward)}${reward}\n`
	}
	m.reply(text.trim())
	user.lastclaim = new Date * 1
}
handler.help = ['daily', 'claim']
handler.tags = ['xp']
handler.command = /^(daily|claim)$/i

handler.cooldown = cooldown

module.exports = handler