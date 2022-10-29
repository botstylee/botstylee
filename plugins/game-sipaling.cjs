var handler = async (m, {
	conn,
	text,
	participants,
	usedPrefix
}) => {
	if (!text) throw `contoh:\n${usedPrefix}paling cantik`
	var member = participants.map(u => u.id)
	var cakep = member[Math.floor(Math.random() * member.length)]
	var jawab = `Sipaling ${text} disini adalah @${cakep.replace(/@.+/, '')}`.trim()
	var mentions = [cakep]
	conn.reply(m.chat, jawab, m, {
		mentions
	})
}
handler.help = ['sipaling *teks*']
handler.tags = ['game']
handler.command = /^(sipaling)$/i

module.exports = handler