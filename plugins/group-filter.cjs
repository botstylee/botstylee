const handler = async (m, { conn, text, usedPrefix, command }) => {
	const usage = `*Format salah! Contoh:*\n○ ${usedPrefix + command} on\n○ ${usedPrefix + command} off`
	const option = typeof text === 'string' ? text.trim().toLowerCase() : ''
	if (!['on', 'enable', 'off', 'disable'].includes(option)) return conn.reply(m.chat, usage, m)

	const chats = db.data?.chats
	if (!chats) return conn.reply(m.chat, '*Database chat belum siap. Coba lagi sebentar.*', m)
	const chat = chats[m.chat] || (chats[m.chat] = {})
	const enabled = option === 'on' || option === 'enable'
	if (Boolean(chat.antiToxic) === enabled) {
		return conn.reply(m.chat, enabled ? '*Filter sudah aktif di grup ini.*' : '*Filter belum aktif di grup ini.*', m)
	}

	chat.antiToxic = enabled
	return conn.reply(m.chat, enabled ? '*Filter berhasil diaktifkan.*' : '*Filter berhasil dimatikan.*', m)
}

handler.help = ['filter [on/off]']
handler.tags = ['group', 'admin']
handler.command = /^(filter)$/i
handler.group = true
handler.admin = true
handler.botAdmin = true

module.exports = handler
