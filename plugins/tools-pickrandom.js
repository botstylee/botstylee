var handler = async (m, {
	text,
	args,
	participants
}) => {
	if (args[0] < 0, args.length < 2) throw 'Example: #pick 15 orang cerdas'
	var users = participants.map(u => u.id.split(`@`)[0])
	if(args[0] > users.length) {
		args[0] = 2
	}
	var te = `*Kamu Terpick sebagai ${text.replace(args, '').trimStart()}*
	
${new Array(Math.min(users.length, args[0])).fill().map(() => {
	var index = Math.floor(Math.random() * users.length)
	return `@${users.splice(index, 1)}`
}).join`\n`}`
	m.reply(te, null, {
		mentions: conn.parseMention(te)
	})
}
handler.help = ['pick *<jumlah> <teks>*']
handler.tags = ['tools']
handler.command = /^pick/i
handler.group = true
export default handler