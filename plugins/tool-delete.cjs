var handler = function(m) {
	if (!m.quoted) throw false
	var {
		chat,
		fromMe,
		isBaileys
	} = m.quoted
	if (!fromMe) throw false
	if (!isBaileys) throw 'Pesan tersebut bukan dikirim oleh bot!'
	conn.sendMessage(chat, {
		delete: m.quoted.vM.key
	})
}
handler.help = ['del', 'delete']
handler.tags = ['tools']

handler.command = /^del(ete)?$/i

module.exports = handler