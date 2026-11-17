const handler = async (m, { conn, text = '', isROwner, isOwner }) => {
	const byeText = typeof text === 'string' ? text.trim() : ''
	if (!byeText) throw 'Teks bye-nya belum diisi.'

	if (isROwner) (global.conn || conn).bye = byeText
	else if (isOwner) conn.bye = byeText
	else {
		const chats = global.db?.data?.chats
		if (!chats) throw 'Database chat belum siap. Coba lagi sebentar.'
		const chat = chats[m.chat] || (chats[m.chat] = {})
		chat.sBye = byeText
	}

	return m.reply('Bye berhasil diatur. Gunakan @user untuk mention.')
}

handler.help = ['setbye <teks>']
handler.tags = ['group']
handler.command = /^setbye$/i
handler.group = true
handler.admin = true

export default handler
