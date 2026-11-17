const handler = async (m, { conn, text, usedPrefix, command }) => {
	const option = typeof text === 'string' ? text.trim().toLowerCase() : ''
	if (!['on', 'enable', 'off', 'disable'].includes(option)) {
		return conn.reply(m.chat, `*Format salah! Contoh:*\n○ ${usedPrefix + command} on\n○ ${usedPrefix + command} off`, m)
	}

	const chat = db.data?.chats?.[m.chat]
	if (!chat) return conn.reply(m.chat, '*Data grup belum tersedia. Coba lagi sebentar.*', m)

	const enabled = option === 'on' || option === 'enable'
	if (Boolean(chat.reminder) === enabled) {
		return conn.reply(m.chat, enabled ? '*Reminder sudah aktif di grup ini.*' : '*Reminder belum aktif di grup ini.*', m)
	}

	chat.reminder = enabled
	return conn.reply(m.chat, enabled ? '*Reminder berhasil diaktifkan.*' : '*Reminder berhasil dimatikan.*', m)
}

handler.help = ['reminder [on/off]']
handler.tags = ['group', 'admin']
handler.command = /^reminder$/i
handler.group = true
handler.admin = true
handler.botAdmin = true

module.exports = handler
