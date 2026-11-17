const handler = async (m, { conn, text, usedPrefix, command }) => {
	const usage = `*Format salah! Contoh:*

○ ${usedPrefix + command} on
○ ${usedPrefix + command} off`
	const option = typeof text === 'string' ? text.trim().toLowerCase() : ''

	if (!option || !['on', 'enable', 'off', 'disable'].includes(option)) {
		return conn.reply(m.chat, usage, m)
	}

	const chat = db.data?.chats?.[m.chat]
	if (!chat) {
		return conn.reply(m.chat, '*Data grup belum tersedia. Coba lagi sebentar.*', m)
	}

	const enable = option === 'on' || option === 'enable'
	if (chat.antiLink === enable) {
		return conn.reply(
			m.chat,
			enable ? '*Anti-Link telah aktif pada grup ini.*' : '*Anti-Link belum aktif pada grup ini.*',
			m
		)
	}

	chat.antiLink = enable
	return conn.reply(
		m.chat,
		enable ? '*Anti-Link berhasil diaktifkan.*' : '*Anti-Link berhasil dimatikan.*',
		m
	)
}

handler.help = ['antilink [on/off]']
handler.tags = ['group', 'admin']
handler.command = ['antilink']
handler.group = true
handler.admin = true
handler.botAdmin = true

module.exports = handler
