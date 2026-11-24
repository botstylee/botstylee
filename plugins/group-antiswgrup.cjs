var handler = async (m, {
	conn,
	text,
	usedPrefix,
	command,
	participants
}) => {
	if (!text) {
		await conn.sendPresenceUpdate('composing', m.chat)
		return conn.reply(m.chat, `*Format salah! Contoh :*\n\n	*○ ${usedPrefix + command} on*\n	*○ ${usedPrefix + command} off*`, m)
	}
	switch (text.toLowerCase()) {
		case "on":
		case "enable":
			var cek = db.data.chats[m.chat].antiSwGrup
			if (cek) return conn.reply(m.chat, `*Anti-SW Grup telah aktif pada grup ini.*`, m)
			await conn.sendPresenceUpdate('composing', m.chat)
			db.data.chats[m.chat].antiSwGrup = true
			conn.reply(m.chat, `*Anti-SW Grup berhasil diaktifkan.*\n\nBot akan otomatis menghapus SW Grup yang dikirim anggota.`, m)
			break
		case "off":
		case "disable":
			var ce = db.data.chats[m.chat].antiSwGrup
			if (!ce) return conn.reply(m.chat, `*Anti-SW Grup belum aktif pada grup ini.*`, m)
			await conn.sendPresenceUpdate('composing', m.chat)
			db.data.chats[m.chat].antiSwGrup = false
			conn.reply(m.chat, `*Anti-SW Grup berhasil dimatikan.*`, m)
			break
		default:
			await conn.sendPresenceUpdate('composing', m.chat)
			conn.reply(m.chat, `*Format salah! Contoh :*\n\n	*○ ${usedPrefix + command} on*\n	*○ ${usedPrefix + command} off*`, m)
			break
	}
}
handler.help = ['antiswgrup'].map(v => v + ' [on/off]')
handler.tags = ['group', 'admin']
handler.command = /^antiswgrup$/i

handler.group = true
handler.admin = true
handler.botAdmin = true

module.exports = handler
