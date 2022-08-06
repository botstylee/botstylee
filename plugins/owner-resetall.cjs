var handler = async (m, {
	conn,
	args
}) => {
	var list = Object.entries(db.data.users)
	if (!args || !args[0]) {
		var lim = 10
	} else {
		var lim = parseInt(args[0])
	}
	if (!args || !args[0]) {
		var li = 5000
	} else {
		var li = parseInt(args[0])
	}
	if (!args || !args[0]) {
		var l = 10000
	} else {
		var l = parseInt(args[0])
	}
	list.slice(0, list.length).map(([user, data], i) => (Number(data.exp = l)))
	list.slice(0, list.length).map(([user, data], i) => (Number(data.money = li)))
	list.slice(0, list.length).map(([user, data], i) => (Number(data.limit = lim)))
	list.slice(0, list.length).map(([user, data], i) => (Number(data.afk = -1)))
	m.reply('done')
}

handler.help = ['resetkabeh']
handler.tags = ['owner']
handler.command = /^(resetkabeh)$/i
handler.owner = true
module.exports = handler