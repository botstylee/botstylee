let handler = async (m, {
	conn,
	args,
	participants
}) => {
    let text = args.join` ` || "halo"
	let users = participants.map(u => u.id)
	conn.reply(m.chat, '*「 TAG ALL 」*\n'+ 'Message:'+ `*${text}*`+ '\n\n❖ ' + users.map(v => '@' + v.replace(/@.+/, '')).join`\n❖ `, null,  {mentions: users})
}
handler.help = ['tagall']
handler.tags = ['group']
handler.command = /^tagall$/i
handler.group = true
handler.admin = true
module.exports = handler
