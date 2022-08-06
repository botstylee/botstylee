var handler = async (m, {
	conn,
	usedPrefix
}) => {
	var id = m.chat
	conn.vote = conn.vote ? conn.vote : {}
	if (!(id in conn.vote)) throw `_*tidak ada voting digrup ini!*_\n\n*${usedPrefix}mulaivote* - untuk memulai vote`

	var [reason, upvote, devote] = conn.vote[id]
	var baba = [upvote, devote]
	var name = await conn.getName(m.sender)
	m.reply(`
*「 VOTE 」*

*Alasan:* ${reason}

*UPVOTE*
_Total: ${upvote.length}_

*DEVOTE*
_Total: ${devote.length}_

*${usedPrefix}hapusvote* - untuk menghapus vote

_${global.wm}_
`.trim())
}
handler.help = ['cekvote']
handler.tags = ['vote']
handler.command = /^cekvote$/i
handler.group = true
module.exports = handler