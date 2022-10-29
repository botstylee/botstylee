var handler = async (m, {
	conn,
	text
}) => {
	var [l, r] = text.split`|`
	if (!l) l = ''
	if (!r) r = ''
	conn.reply(m.chat, l + readMore + r, m)
}
handler.help = ['readmore', 'spoiler'].map(v => v + ' *teks|teks*')
handler.tags = ['tools']
handler.command = /^(spoiler|hidetext|readmore|selengkapnya)$/i

module.exports = handler

var more = String.fromCharCode(8206)
var readMore = more.repeat(4001)