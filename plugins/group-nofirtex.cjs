let handler = async (m, {
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
			let cek = global.db.data.chats[m.chat].nofirtex
			if (cek) return conn.reply(m.chat, `*anti firtex telah aktif pada grup ini.*`, m)
			await conn.sendPresenceUpdate('composing', m.chat)
			global.db.data.chats[m.chat].nofirtex = true
			conn.reply(m.chat, `*anti firtex berhasil diaktifkan.*`, m)
			break
		case "off":
		case "disable":
			let ce = global.db.data.chats[m.chat].nofirtex
			if (!ce) return conn.reply(m.chat, `*Anti firtex belum aktif pada grup ini.*`, m)
			await conn.sendPresenceUpdate('composing', m.chat)
			global.db.data.chats[m.chat].nofirtex = false
			conn.reply(m.chat, `*Anti firtex berhasil dimatikan.*`, m)
			break
		default:
			await conn.sendPresenceUpdate('composing', m.chat)
			conn.reply(m.chat, `*Format salah! Contoh :*\n\n	*○ ${usedPrefix + command} on*\n	*○ ${usedPrefix + command} off*`, m)
			break
	}
}
handler.help = ['nofirtex'].map(v => v + ' [on/off]')
handler.tags = ['group', 'admin']
handler.command = /^(nofirtex)$/i

handler.group = true
handler.admin = true
handler.botAdmin = true

module.exports = handler