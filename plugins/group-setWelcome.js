const handler = async (m, { conn, text = '', isROwner, isOwner }) => {
	const welcomeText = typeof text === 'string' ? text.trim() : ''
	if (!welcomeText) throw 'Teks welcome-nya belum diisi.'

	if (isROwner) (global.conn || conn).welcome = welcomeText
	else if (isOwner) conn.welcome = welcomeText
	else {
		const chats = global.db?.data?.chats
		if (!chats) throw 'Database chat belum siap. Coba lagi sebentar.'
		const chat = chats[m.chat] || (chats[m.chat] = {})
		chat.sWelcome = welcomeText
	}

	return m.reply('Welcome berhasil diatur. Gunakan @user untuk mention, @subject untuk nama grup, dan @desc untuk deskripsi grup.')
}

handler.help = ['setwelcome <teks>']
handler.tags = ['group']
handler.command = /^setwelcome$/i
handler.group = true
handler.admin = true

export default handler
