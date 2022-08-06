var handler = async (m, {
	conn
}) => {
	var hyzer = 'https://api.zacros.my.id/randomimg/loli'
	//await conn.sendButton(m.chat, hyzer, 'Nih lomli awas ada FBI', wm, [['Loli','.loli']] ,m)
	conn.sendFile(m.chat, hyzer, 'Nih lomli awas ada FBI', wm, m)
}
handler.help = ['loli']
handler.tags = ['anime']
handler.command = /^(loli)$/i
var wm = global.wm
module.exports = handler