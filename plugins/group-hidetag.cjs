var {
	generateWAMessageFromContent
} = require('@adiwajshing/baileys');
var handler = async (m, {
	conn,
	text,
	participants
}) => {
	var users = participants.map(u => conn.decodeJid(u.id))
	var q = m.quoted ? m.quoted : m
	var c = m.quoted ? m.quoted : m.msg
	var msg = conn.cMod(m.chat,
		generateWAMessageFromContent(m.chat, {
			[c.toJSON ? q.mtype : 'extendedTextMessage']: c.toJSON ? c.toJSON() : {
				text: c || ''
			}
		}, {
			quoted: m,
			userJid: conn.user.id
		}),
		text || q.text, conn.user.jid, {
			mentions: users
		}
	)

	await conn.relayMessage(m.chat, msg.message, {
		messageId: msg.key.id
	})
}
handler.help = ['pengumuman', 'announce', 'hidetag'].map(v => v + ' [teks]')
handler.tags = ['group']
handler.command = /^(pengumuman|announce|hiddentag|hidetag)$/i

handler.group = true
handler.admin = true

module.exports = handler