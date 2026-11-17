const handler = async (m, { conn, text = '', usedPrefix, command }) => {
	const option = typeof text === 'string' ? text.trim().toLowerCase() : ''
	if (!['on', 'enable', 'off', 'disable'].includes(option)) {
		return conn.reply(
			m.chat,
			`*Format:*\n○ ${usedPrefix + command} on\n○ ${usedPrefix + command} off\n\nMenghapus otomatis Group Status (story grup) yang diposting anggota. Bot harus menjadi admin grup.`,
			m
		)
	}

	const chats = global.db?.data?.chats
	if (!chats) return conn.reply(m.chat, '*Database chat belum siap. Coba lagi sebentar.*', m)

	const chat = chats[m.chat] || (chats[m.chat] = {})
	const enabled = option === 'on' || option === 'enable'
	if (Boolean(chat.antiSWGroup) === enabled) {
		return conn.reply(m.chat, enabled ? '*Anti-SW grup sudah aktif.*' : '*Anti-SW grup sudah nonaktif.*', m)
	}

	chat.antiSWGroup = enabled
	return conn.reply(
		m.chat,
		enabled
			? '*Anti-SW grup aktif. Group Status anggota akan dihapus otomatis jika bot admin.*'
			: '*Anti-SW grup berhasil dimatikan.*',
		m
	)
}

handler.help = ['antiswgrup [on/off]']
handler.tags = ['group', 'admin']
handler.command = /^(antiswgrup|antisw)$/i
handler.group = true
handler.admin = true
handler.botAdmin = true

module.exports = handler
