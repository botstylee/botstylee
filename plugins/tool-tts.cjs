const gtts = require('node-gtts')
const {
	readFileSync,
	unlinkSync
} = require('fs')
const {
	join
} = require('path')

const defaultLang = 'id'
let handler = async (m, {
	conn,
	args
}) => {

	let lang = args[0]
	let text = args.slice(1).join(' ')
	if ((args[0] || '').length !== 2) {
		lang = defaultLang
		text = args.join(' ')
	}
	if (!text && m.quoted && m.quoted.text) text = m.quoted.text

	let res
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
			let tts = gtts(lang)
			let filePath = join(__dirname, '../tmp', (1 * new Date) + '.wav')
			tts.save(filePath, text, () => {
				resolve(readFileSync(filePath))
				unlinkSync(filePath)
			})
		} catch (e) {
			reject(e)
		}
	})
}