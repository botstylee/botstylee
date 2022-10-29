var {
	format
} = require('util');
var {
	Image
} = require('node-webpmux')

var handler = async (m) => {
	if (!m.quoted) return m.reply('Tag stikernya!')
	if (/sticker/.test(m.quoted.mtype)) {
		var img = new Image()
		await img.load(await m.quoted.download())
		m.reply(format(JSON.parse(img.exif.slice(22).toString())))
	}
}
handler.help = ['getexif']
handler.tags = ['sticker']

handler.command = ['getexif']

module.exports = handler