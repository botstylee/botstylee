const handler = async (m, { conn, args = [], participants = [] }) => {
	const message = args.join(' ').trim() || 'halo'
	const users = [...new Set(participants
		.map(participant => participant?.id && (conn.decodeJid?.(participant.id) || participant.id))
		.filter(jid => typeof jid === 'string' && jid.includes('@')))]
	const taggedUsers = users.map(jid => `❖ @${jid.split('@')[0]}`).join('\n')
	const body = `*「 TAG ALL 」*\nMessage: *${message}*${taggedUsers ? `\n\n${taggedUsers}` : ''}`
	return conn.reply(m.chat, body, m, { mentions: users })
}

handler.help = ['tagall [pesan]']
handler.tags = ['group']
handler.command = /^tagall$/i
handler.group = true
handler.admin = true

module.exports = handler
