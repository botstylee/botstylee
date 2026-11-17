const handler = async (m, { conn, text, usedPrefix, command }) => {
	const usage = `*Format salah! Contoh:*\n○ ${usedPrefix + command} on\n○ ${usedPrefix + command} off`
	const option = typeof text === 'string' ? text.trim().toLowerCase() : ''
	if (!['on', 'enable', 'off', 'disable'].includes(option)) return conn.reply(m.chat, usage, m)

	const chats = db.data?.chats
	if (!chats) return conn.reply(m.chat, '*Database chat belum siap. Coba lagi sebentar.*', m)
	const chat = chats[m.chat] || (chats[m.chat] = {})
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
