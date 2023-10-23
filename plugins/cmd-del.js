import db from '../../lib/database.js'

var handler = async (m, {
	text
}) => {
	var hash = text
	if (m.quoted && m.quoted.fileSha256) hash = m.quoted.fileSha256.toString('hex')
	if (!hash) throw `Tidak ada hash`
	var sticker = db.data.sticker
	if (sticker[hash] && sticker[hash].locked) throw 'Kamu tidak memiliki izin untuk menghapus perintah stiker ini'
	delete sticker[hash]
	m.reply(`Berhasil!`)
}


handler.help = ['cmd'].map(v => 'del' + v + ' <teks>')
handler.tags = ['tools']
handler.command = ['delcmd', 'cmddel']
handler.owner = true
export default handler