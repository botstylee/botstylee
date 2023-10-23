var handler = async (m, {
	conn,
	text,
	usedPrefix,
	command,
	participants
}) => {
	if (!text) {
		await conn.sendPresenceUpdate('composing', m.chat)
		conn.reply(m.chat, `*Format salah! Contoh :*\n\n	*○ ${usedPrefix + command} on*\n	*○ ${usedPrefix + command} off*`, m)
	}
	switch (text) {
		case "on":
		case "enable":
			var cek = db.data.chats[m.chat].antiLink
			if (cek) return conn.reply(m.chat, `*Anti-Link telah aktif pada grup ini.*`, m)
			await conn.sendPresenceUpdate('composing', m.chat)
			db.data.chats[m.chat].antiLink = true
			conn.reply(m.chat, `*Anti-Link berhasil diaktifkan.*`, m)
			break
		case "off":
		case "disable":
			var ce = db.data.chats[m.chat].antiLink
			if (!ce) return conn.reply(m.chat, `*Anti-Link belum aktif pada grup ini.*`, m)
			await conn.sendPresenceUpdate('composing', m.chat)
			db.data.chats[m.chat].antiLink = false
			conn.reply(m.chat, `*Anti-Link berhasil dimatikan.*`, m)
			break
		default:
			await conn.sendPresenceUpdate('composing', m.chat)
			conn.reply(m.chat, `*Format salah! Contoh :*\n\n	*○ ${usedPrefix + command} on*\n	*○ ${usedPrefix + command} off*`, m)
			break
	}
}
handler.help = ['antilink'].map(v => v + ' [on/off]')
handler.tags = ['group', 'admin']
handler.command = ['antilink']

handler.group = true
handler.admin = true
handler.botAdmin = true

module.exports = handler