var handler = async (m, {
	conn,
	text,
	usedPrefix,
	command,
	participants
}) => {
	if (!text) {
		await conn.sendPresenceUpdate('composing', m.chat)
		return conn.reply(m.sender, `*Format salah! Contoh :*\n\n	*○ ${usedPrefix + command} on*\n	*○ ${usedPrefix + command} off*`, m)
	}
	switch (text) {
		case "on":
		case "enable":
			var cek = global.db.data.chats[m.chat].reactupd
			if (cek) return conn.reply(m.sender, `*pconly telah diaktifkan pada bot ini.*`, m)
			await conn.sendPresenceUpdate('composing', m.chat)
			global.db.data.chats[m.chat].reactupd = true
			conn.reply(m.sender, `*pconly berhasil diaktifkan pada bot ini*`, m)
			break
		case "off":
		case "disable":
			var ce = global.db.data.chats[m.chat].reactupd
			if (!ce) return conn.reply(m.sender, `*pconly telah dimatikan pada bot ini.*`, m)
			await conn.sendPresenceUpdate('composing', m.chat)
			global.db.data.chats[m.chat].reactupd = false
			//conn.reply(m.chat, `*pconly berhasil dimatikan pada bot ini*`, m)
			break
		default:
			await conn.sendPresenceUpdate('composing', m.chat)
			//conn.reply(m.chat, `*Format salah! Contoh :*\n\n	*○ ${usedPrefix + command} on*\n	*○ ${usedPrefix + command} off*`, m)
			break
	}
}
//handler.help = ['pconly'].map(v => v + ' [on/off]')
//handler.tags = ['owner']
handler.command = /^(reactupd)$/i
handler.group = false
handler.owner = true

module.exports = handler
