var rewards = {
	exp: 50000,
	money: 49999,
	potion: 10,
	mythic: 3,
	legendary: 1
}

var cooldown = 2592000000
var handler = async (m) => {
	var user = db.data.users[m.sender]
	if (new Date - user.lastmonthly < cooldown) throw `You have already claimed this monthly claim, wait for *${((user.lastmonthly + cooldown) - new Date()).toTimeString()}*`
	var text = ''
	for (var reward of Object.keys(rewards))
		if (reward in user) {
			user[reward] += rewards[reward]
			text += `*+${rewards[reward]}* ${rpg.emoticon(reward)}${reward}\n`
		}
	m.reply(text)
	user.lastmonthly = new Date * 1
}
handler.help = ['monthly']
handler.tags = ['rpg']
handler.command = /^(monthly)$/i

handler.cooldown = cooldown

module.exports = handler