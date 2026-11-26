// plugins/vote-cekvote.cjs
// Fitur: Cek status vote di grup

var handler = async (m, {
	conn,
	usedPrefix
}) => {
	var id = m.chat

	// Guard: vote harus ada di grup ini
	if (!conn.vote || !(id in conn.vote)) {
		throw `_*tidak ada voting digrup ini!*_\n\n*${usedPrefix}mulaivote* - untuk memulai vote`
	}

	// Ambil data vote
	var [reason, upvote, devote] = conn.vote[id]

	// Guard: pastikan upvote/devote array
	if (!Array.isArray(upvote)) upvote = []
	if (!Array.isArray(devote)) devote = []

	// Susun pesan
	var txt = `
*「 VOTE 」*

*Alasan:* ${reason || '-'}

*UPVOTE*
_Total: ${upvote.length}_

*DEVOTE*
_Total: ${devote.length}_

*${usedPrefix}hapusvote* - untuk menghapus vote

_${global.wm || ''}_
`.trim()

	await m.reply(txt)
}

handler.help = ['cekvote']
handler.tags = ['vote']
handler.command = /^cekvote$/i
handler.group = true

module.exports = handler
