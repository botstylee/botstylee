var handler = function(m, {
	conn,
	isBotAdmin
}) {
	if (!m.quoted) throw false
	var {
		id,
		chat,
		sender,
		fromMe,
		isBaileys
	} = m.quoted
	/*if (!fromMe) throw false
	if (!isBaileys) throw 'Pesan tersebut bukan dikirim oleh bot!'*/
	if (m.isGroup && isBotAdmin) {
		conn.sendMessage(chat, {
			delete: {
				remoteJid: m.chat,
				id,
				participant: sender
			}
		})
	} else {
		if (!fromMe) throw false
		if (!isBaileys) throw 'Pesan tersebut bukan dikirim oleh bot!'
		conn.sendMessage(chat, {
			delete: m.quoted.vM.key
		})
	}
}
handler.help = ['del', 'delete']
handler.tags = ['tools']

handler.command = /^del(ete)?$/i

export default handler