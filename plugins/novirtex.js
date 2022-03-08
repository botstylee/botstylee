/* creat by :
~ Benniismael (https://github.com/botstylee/botstylee)
~ tidak di ketahui (https://github.com/Ghost19-ui)*/

let {
	Presence
} = require('@adiwajshing/baileys')
let handler = async (m, {
	conn,
	args,
	usedPrefix,
	command,
	isGroup,
	isBotAdmin,
	isAdmin
}) => {
	/*
			let enable = global.db.data.chats[m.chat]
			let status = global.db.data.users[m.sender]
			let chats = global.db.data.chats[m.chat]
			// let uS = global.db.data.users[m.chat].block
			
		if(enable.novirtex && !m.fromMe && m.isGroup && !isAdmin && isBotAdmin) {
	            if (!m.fromMe && m.text.match(/(৭৭৭|๒๒๒|؋.ᄻ.ྜྷ.ᇸ.ྙ|๖ۣۜy๖ۣۜF๖ۣۜr๖|๑๑๑|৭৭৭৭৭৭৭৭|๑๑๑๑๑๑๑๑|ผิดุท้่เึางืผิดุท้่เึางื|๒๒๒๒๒๒๒๒|ผิดุท้่เึางืผิดุท้่เึางื)/gi)) {
	            	conn.updatePresence(m.chat, Presence.composing) 
	            	conn.reply(m.chat, `*Jangan kirim pirtek asu!!!*`, m).then(() => {
					conn.groupRemove(m.chat, [m.sender]) 	
				})
	        }
		}	
		
	*/
	if (!args || !args[0]) {
		await conn.updatePresence(m.chat, Presence.composing)
		conn.reply(m.chat, `*Format salah! Contoh :*\n\n	*○ ${usedPrefix + command} on*\n	*○ ${usedPrefix + command} off*`, m)
	} else if (args[0] == 'on') {
		let cek = global.db.data.chats[m.chat].novirtex
		if (cek) return conn.reply(m.chat, `*Anti-Virtex telah aktif pada grup ini.*`, m)
		await conn.updatePresence(m.chat, Presence.composing)
		global.db.data.chats[m.chat].novirtex = true
		conn.reply(m.chat, `*Anti-Virtex berhasil diaktifkan.*`, m)
	} else if (args[0] == 'off') {
		let cek = global.db.data.chats[m.chat].novirtex
		if (!cek) return conn.reply(m.chat, `*Anti-Virtex telah di nonaktifkan pada grup ini.*`, m)
		await conn.updatePresence(m.chat, Presence.composing)
		global.db.data.chats[m.chat].novirtex = false
		conn.reply(m.chat, `*Anti-Virtex berhasil di nonaktifkan.*`, m)
	} else {
		await conn.updatePresence(m.chat, Presence.composing)
		conn.reply(m.chat, `*Format salah! Contoh :*\n\n	*○ ${usedPrefix + command} on*\n	*○ ${usedPrefix + command} off*`, m)
	}
}
handler.help = ['nofirtex *on / off*']
handler.tags = ['group']
handler.command = /^(nofirtex)$/i
handler.owner = false
handler.admin = true
handler.group = true
handler.botAdmin = true
handler.exp = 0
handler.limit = false
module.exports = handler
