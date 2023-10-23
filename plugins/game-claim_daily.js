var rewards = {
	exp: 500,
	mp: 500
}
var cooldown = 86400000
var handler = async (m) => {
	var game = db.data.users[m.sender].game,
		user = db.data.users[m.sender]
	if (!game.lastclaim) game.lastclaim = 0
	if (new Date - game.lastclaim < cooldown) throw `You have already claimed this daily claim!, wait for *${((game.lastclaim + cooldown) - new Date()).toTimeString()}*`
	var text = '*[ d a i l y ]*\n\n'
	for (var reward of Object.keys(rewards)) {
		if (!(reward in user)) continue
		user[reward] += rewards[reward]
		text += `*+${rewards[reward]}* ${reward}\n`
	}
	m.reply(text.trim())
	game.lastclaim = new Date * 1
}
handler.help = ['daily', 'claim']
handler.tags = ['game']
handler.command = /^(daily|claim)$/i

export default handler