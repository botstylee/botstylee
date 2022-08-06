var rewards = {
	exp: 40000,
	money: 20000,
	potion: 5,
	mythic: 3,
	legendary: 1
}

var cooldown = 604800000
var handler = async (m) => {
	var user = db.data.users[m.sender]
	if (new Date - user.lastweekly < cooldown) throw `You have already claimed this weekly claim, wait for *${((user.lastweekly + cooldown) - new Date()).toTimeString()}*`
	var text = ''
	for (var reward of Object.keys(rewards))
		if (reward in user) {
			user[reward] += rewards[reward]
			text += `*+${rewards[reward]}* ${rpg.emoticon(reward)}${reward}\n`
		}
	m.reply(text)
	user.lastweekly = new Date * 1
}
handler.help = ['weekly']
handler.tags = ['rpg']
handler.command = /^(weekly)$/i

handler.cooldown = cooldown

module.exports = handler