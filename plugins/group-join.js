const linkRegex = /(?:https?:\/\/)?chat\.whatsapp\.com\/([0-9A-Za-z]{20,24})(?:\s+([0-9]{1,3}))?/i

const handler = async (m, { conn, text = '' }) => {
	const match = typeof text === 'string' ? text.trim().match(linkRegex) : null
	const inviteCode = match?.[1]
	if (!inviteCode) throw 'Link undangan WhatsApp tidak valid. Kirim link chat.whatsapp.com yang benar.'

	try {
		const groupId = await conn.groupAcceptInvite(inviteCode)
		if (!groupId) throw new Error('WhatsApp tidak mengembalikan ID grup.')

		const chats = global.db?.data?.chats
		if (chats && !chats[groupId]) chats[groupId] = {}
		return m.reply(`Berhasil bergabung ke grup ${groupId}.`)
	} catch (error) {
		console.error('Gagal bergabung ke grup dari link undangan:', error)
		throw 'Bot gagal bergabung. Link mungkin tidak valid/kedaluwarsa, atau bot tidak dapat diundang ke grup tersebut.'
	}
}

handler.help = ['join <link grup>']
handler.tags = ['main']
handler.command = ['join']

export default handler
