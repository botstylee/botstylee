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
	switch (text) {
		case "on":
		case "enable":
			var cek = db.data.settings[conn.user.jid].pconly
			if (cek) return conn.reply(m.chat, `*pconly telah diaktifkan pada bot ini.*`, m)
			await conn.sendPresenceUpdate('composing', m.chat)
			db.data.settings[conn.user.jid].pconly = true
			conn.reply(m.chat, `*pconly berhasil diaktifkan pada bot ini*`, m)
			break
		case "off":
		case "disable":
			var ce = db.data.settings[conn.user.jid].pconly
			if (!ce) return conn.reply(m.chat, `*pconly telah dimatikan pada bot ini.*`, m)
			await conn.sendPresenceUpdate('composing', m.chat)
			db.data.settings[conn.user.jid].pconly = false
			conn.reply(m.chat, `*pconly berhasil dimatikan pada bot ini*`, m)
			break
		default:
			await conn.sendPresenceUpdate('composing', m.chat)
			conn.reply(m.chat, `*Format salah! Contoh :*\n\n	*○ ${usedPrefix + command} on*\n	*○ ${usedPrefix + command} off*`, m)
			break
	}
}
/*handler.help = ['pconly'].map(v => v + ' [on/off]')
handler.tags = ['owner']
handler.command = /^(pconly)$/i*/

handler.owner = true

module.exports = handler