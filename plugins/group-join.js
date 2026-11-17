const inviteRegex = /(?:https?:\/\/)?chat\.whatsapp\.com\/([0-9A-Za-z]{20,24})/i

const handler = async (m, { conn, text = '' }) => {
	const match = typeof text === 'string' ? text.trim().match(inviteRegex) : null
	const inviteCode = match?.[1]
	if (!inviteCode) throw 'Link undangan WhatsApp tidak valid. Kirim link chat.whatsapp.com yang benar.'

	try {
		const groupId = await conn.groupAcceptInvite(inviteCode)
		if (typeof groupId !== 'string' || !groupId.endsWith('@g.us')) {
			throw new Error('WhatsApp tidak mengembalikan ID grup yang valid.')
		}

		const chats = global.db?.data?.chats
		if (chats && (!chats[groupId] || typeof chats[groupId] !== 'object')) chats[groupId] = {}
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
