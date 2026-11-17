const handler = async (m, { conn, text, usedPrefix, command }) => {
	const usage = `*Format salah! Contoh:*

○ ${usedPrefix + command} on
○ ${usedPrefix + command} off`
	const option = typeof text === 'string' ? text.trim().toLowerCase() : ''

	if (!['on', 'enable', 'off', 'disable'].includes(option)) {
		return conn.reply(m.chat, usage, m)
	}

	const chat = db.data?.chats?.[m.chat]
	if (!chat) {
		return conn.reply(m.chat, '*Data grup belum tersedia. Coba lagi sebentar.*', m)
	}

	const enable = option === 'on' || option === 'enable'
	if (Boolean(chat.antiToxic) === enable) {
		return conn.reply(
			m.chat,
			enable ? '*Filter telah aktif pada grup ini.*' : '*Filter belum aktif pada grup ini.*',
			m
		)
	}

	chat.antiToxic = enable
	return conn.reply(
		m.chat,
		enable ? '*Filter berhasil diaktifkan.*' : '*Filter berhasil dimatikan.*',
		m
	)
}

handler.help = ['filter [on/off]']
handler.tags = ['group', 'admin']
handler.command = /^(filter)$/i
handler.group = true
handler.admin = true
handler.botAdmin = true

module.exports = handler
