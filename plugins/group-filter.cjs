var handler = async (m, {
	conn,
	text,
	usedPrefix,
	command,
	participants,
	isBotAdmin
}) => {
	// Pastikan entry chat ada di database
	if (!db.data.chats[m.chat]) db.data.chats[m.chat] = {}

	// Validasi: text wajib ada
	if (!text) {
		await conn.sendPresenceUpdate('composing', m.chat)
		return conn.reply(
			m.chat,
			`*Format salah! Contoh :*\n\n	*○ ${usedPrefix + command} on*\n	*○ ${usedPrefix + command} off*`,
			m
		)
	}

	// Cek bot admin (opsional, untuk pesan yang lebih jelas)
	if (!isBotAdmin) {
		return conn.reply(m.chat, '*Bot bukan admin!* Jadikan bot admin terlebih dahulu.', m)
	}

	switch (text.toLowerCase()) {
		case "on":
		case "enable":
			var cek = db.data.chats[m.chat].antiToxic
			if (cek) return conn.reply(m.chat, `*Filter telah aktif pada grup ini.*`, m)
			await conn.sendPresenceUpdate('composing', m.chat)
			db.data.chats[m.chat].antiToxic = true
			await conn.reply(m.chat, `*Filter berhasil diaktifkan.*`, m)
			break
		case "off":
		case "disable":
			var ce = db.data.chats[m.chat].antiToxic
			if (!ce) return conn.reply(m.chat, `*Filter belum aktif pada grup ini.*`, m)
			await conn.sendPresenceUpdate('composing', m.chat)
			db.data.chats[m.chat].antiToxic = false
			await conn.reply(m.chat, `*Filter berhasil dimatikan.*`, m)
			break
		default:
			await conn.sendPresenceUpdate('composing', m.chat)
			return conn.reply(
				m.chat,
				`*Format salah! Contoh :*\n\n	*○ ${usedPrefix + command} on*\n	*○ ${usedPrefix + command} off*`,
				m
			)
	}
}

handler.help = ['filter'].map(v => v + ' [on/off]')
handler.tags = ['group', 'admin']
handler.command = /^(filter)$/i

handler.group = true
handler.admin = true
handler.botAdmin = true

module.exports = handler
