var {
	sticker
} = require('../lib/sticker.cjs');

var handler = async (m, {
	conn,
	text
}) => {
	var teks = text ? text : m.quoted && m.quoted.text ? m.quoted.text : m.text
	var stiker = await sticker(null, global.API('xteam', '/ttp', {
		file: '',
		text: teks
	}), global.packname, global.author)
	if (stiker) return conn.sendFile(m.chat, stiker, 'sticker.webp', '', m)
	throw stiker.toString()
}
handler.help = ['ttp *teks*']
handler.tags = ['sticker']

handler.command = /^ttp$/i

module.exports = handler