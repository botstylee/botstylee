var handler = async (m, {
	conn,
	text = '',
	usedPrefix,
	command
}) => {
	var reply = `*Format salah! Contoh:*\n\n○ ${usedPrefix + command} on\n○ ${usedPrefix + command} off`
	var value = text.trim().toLowerCase()
	if (!value) return conn.reply(m.chat, reply, m)

	var chat = global.db?.data?.chats?.[m.chat]
	if (!chat) return conn.reply(m.chat, 'Data grup belum tersedia. Coba lagi sebentar.', m)

	if (value === 'on' || value === 'enable') {
		if (chat.antiToxic) return conn.reply(m.chat, '*Filter sudah aktif di grup ini.*', m)
		chat.antiToxic = true
		return conn.reply(m.chat, '*Filter berhasil diaktifkan.*', m)
	}
	if (value === 'off' || value === 'disable') {
		if (!chat.antiToxic) return conn.reply(m.chat, '*Filter belum aktif di grup ini.*', m)
		chat.antiToxic = false
		return conn.reply(m.chat, '*Filter berhasil dimatikan.*', m)
	}
	return conn.reply(m.chat, reply, m)
}
handler.help = ['filter [on/off]']
handler.tags = ['group', 'admin']
handler.command = /^(filter)$/i
handler.group = true
handler.admin = true
handler.botAdmin = true
module.exports = handler
