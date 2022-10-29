var handler = async (m, {
	conn,
	participants,
	command,
	usedPrefix
}) => {
	var member = participants.map(u => u.id)
	var orang
	if (/ku/i.test(command)) orang = m.sender
	else orang = member[Math.floor(Math.random() * member.length)]
	var jodoh = member[Math.floor(Math.random() * member.length)]
	var jawab = `@${orang.replace(/@.+/, '')} ❤️ @${jodoh.replace(/@.+/, '')}`.trim()
	var mentions = [orang, jodoh]
	await conn.sendButton(m.chat, jawab, author, null, [
		[command, usedPrefix + command]
	], null, {
		mentions
	})
}
handler.help = ['jodohin', 'jodohku']
handler.tags = ['fun']
handler.command = /^jodoh(in|ku)|jadian$/i
handler.group = true

module.exports = handler