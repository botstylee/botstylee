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
			var cek = db.data.chats[m.chat].reminder
			if (cek) return conn.reply(m.chat, `*reminder telah aktif pada grup ini.*`, m)
			await conn.sendPresenceUpdate('composing', m.chat)
			db.data.chats[m.chat].reminder = true
			conn.reply(m.chat, `*reminder berhasil diaktifkan.*`, m)
			break
		case "off":
		case "disable":
			var ce = db.data.chats[m.chat].reminder
			if (!ce) return conn.reply(m.chat, `*reminder belum aktif pada grup ini.*`, m)
			await conn.sendPresenceUpdate('composing', m.chat)
			db.data.chats[m.chat].reminder = false
			conn.reply(m.chat, `*reminder berhasil dimatikan.*`, m)
			break
		default:
			await conn.sendPresenceUpdate('composing', m.chat)
			conn.reply(m.chat, `*Format salah! Contoh :*\n\n	*○ ${usedPrefix + command} on*\n	*○ ${usedPrefix + command} off*`, m)
			break
	}
}
//handler.help = ['reminder'].map(v => v + ' [on/off]')
//handler.tags = ['group']
//handler.command = /^(reminder)$/i

handler.group = true
handler.admin = true
handler.botAdmin = true

module.exports = handler