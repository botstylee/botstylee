var gtts = require('node-gtts')
var {
	readFileSync,
	unlinkSync
} = require('fs')
var {
	join
} = require('path')

var defaultLang = 'id'
var handler = async (m, {
	conn,
	args
}) => {

	var lang = args[0]
	var text = args.slice(1).join(' ')
	if ((args[0] || '').length !== 2) {
		lang = defaultLang
		text = args.join(' ')
	}
	if (!text && m.quoted && m.quoted.text) text = m.quoted.text

	var res
	try {
		res = await tts(text, lang)
	} catch (e) {
		m.reply(e + '')
		res = await tts(args.join(' '))
	} finally {
		conn.sendFile(m.chat, res, 'tts.opus', null, m, true)
	}
}
handler.help = ['tts *lang teks*']
handler.tags = ['tools']
handler.command = /^g?tts$/i

module.exports = handler

function tts(text, lang = 'id') {
	console.log(lang, text)
	return new Promise((resolve, reject) => {
		try {
			var tts = gtts(lang)
			var filePath = join(__dirname, '../tmp', (1 * new Date) + '.wav')
			tts.save(filePath, text, () => {
				resolve(readFileSync(filePath))
				unlinkSync(filePath)
			})
		} catch (e) {
			reject(e)
		}
	})
}