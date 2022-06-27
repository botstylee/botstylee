let handler = async (m, {
	conn,
	text,
	participants,
	usedPrefix
}) => {
	if (!text) throw `contoh:\n${usedPrefix}paling cantik`
	let member = participants.map(u => u.id)
	let cakep = member[Math.floor(Math.random() * member.length)]
	let jawab = `Sipaling ${text} disini adalah @${cakep.replace(/@.+/, '')}`.trim()
	let mentions = [cakep]
	conn.reply(m.chat, jawab, m, {
		mentions
	})
}
handler.help = ['sipaling *teks*']
handler.tags = ['game']
handler.command = /^(sipaling)$/i

module.exports = handler