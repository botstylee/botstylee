var handler = async (m, {
	conn,
	text,
	usedPrefix,
	command
}) => {
	const usage = `*Format salah! Contoh :*

	*○ ${usedPrefix + command} on*
	*○ ${usedPrefix + command} off*`

	const option = typeof text === 'string' ? text.trim().toLowerCase() : ''

	if (!option || !['on', 'enable', 'off', 'disable'].includes(option)) {
		await conn.sendPresenceUpdate('composing', m.chat)
		return conn.reply(m.chat, usage, m)
	}

	// ✅ Pastikan db.data.chats ada dan inisialisasi chat ini
	if (!db.data.chats) db.data.chats = {}
	if (!db.data.chats[m.chat]) db.data.chats[m.chat] = {}
	const chat = db.data.chats[m.chat]

	const enable = option === 'on' || option === 'enable'

	if (chat.antiSwGrup === enable) {
		return conn.reply(
			m.chat,
			enable ? '*Anti-SW Grup telah aktif pada grup ini.*' : '*Anti-SW Grup belum aktif pada grup ini.*',
			m
		)
	}

	await conn.sendPresenceUpdate('composing', m.chat)
	chat.antiSwGrup = enable

	conn.reply(
		m.chat,
		enable
			? '*Anti-SW Grup berhasil diaktifkan.*\n\nBot akan otomatis menghapus SW Grup yang dikirim anggota.'
			: '*Anti-SW Grup berhasil dimatikan.*',
		m
	)
}

handler.help = ['antiswgrup [on/off]']
handler.tags = ['group', 'admin']
handler.command = /^antiswgrup$/i
handler.group = true
handler.admin = true
handler.botAdmin = true

module.exports = handler
