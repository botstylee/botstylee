import db from '../../lib/database.js'

var handler = async (m, {
	command
}) => {
	if (!m.quoted) throw 'Reply Pesan!'
	if (!m.quoted.fileSha256) throw 'SHA256 Hash Missing'
	var sticker = db.data.sticker
	var hash = m.quoted.fileSha256.toString('hex')
	if (!(hash in sticker)) throw 'Hash not found in database'
	sticker[hash].locked = !/^un/i.test(command)
	m.reply('Done!')
}
handler.help = ['un', ''].map(v => v + 'lockcmd')
handler.tags = ['tools']
handler.command = /^(un)?lockcmd$/i
handler.owner = true
export default handler