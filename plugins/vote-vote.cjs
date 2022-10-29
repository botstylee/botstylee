var handler = async (m, {
	conn,
	usedPrefix,
	command
}) => {
	var id = m.chat
	conn.vote = conn.vote ? conn.vote : {}
	if (!(id in conn.vote)) throw `_*tidak ada voting digrup ini!*_\n\n*${usedPrefix}mulaivote* - untuk memulai vote`
	var isVote = conn.vote[id][1].concat(conn.vote[id][2])
	var wasVote = isVote.includes(m.sender)
	if (wasVote) throw 'Kamu sudah vote!'
	if (/up/i.test(command)) {
		conn.vote[id][1].push(m.sender)
	} else if (/de/i.test(command)) {
		conn.vote[id][2].push(m.sender)
	}
	m.reply(`Done!\n\n*${usedPrefix}cekvote* - untuk mengecek vote`)
	var [reason, upvote, devote] = conn.vote[id]
	var baba = [upvote, devote]
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
handler.help = ['upvote', 'devote']
handler.tags = ['vote']
handler.command = /^(up|de)vote$/i
handler.group = true
module.exports = handler