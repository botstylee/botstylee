var rewards = {
	coin: 1,
	mp: 5000
}

var cooldown = 604800000
var handler = async (m) => {
	var game = db.data.users[m.sender].game,
		user = db.data.users[m.sender]
	if (!game.lastweekly) game.lastweekly = 0
	if (new Date - game.lastweekly < cooldown) throw `You have already claimed this weekly claim, wait for *${((game.lastweekly + cooldown) - new Date()).toTimeString()}*`
	var text = '*[ w e e k l y ]*\n\n'
	for (var reward of Object.keys(rewards))
		if (reward in user) {
			user[reward] += rewards[reward]
			text += `*+${rewards[reward]}* ${reward}\n`
		}
	m.reply(text)
	game.lastweekly = new Date * 1
}
handler.help = ['weekly']
handler.tags = ['game']
handler.command = /^(weekly)$/i

export default handler