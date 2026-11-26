// plugins/vote-updevote.cjs
// Fitur: Upvote / devote pada vote yang sedang berjalan

var handler = async (m, {
	conn,
	usedPrefix,
	command
}) => {
	var id = m.chat

	// Guard: vote harus ada di grup ini
	if (!conn.vote || !(id in conn.vote)) {
		throw `_*tidak ada voting digrup ini!*_\n\n*${usedPrefix}mulaivote* - untuk memulai vote`
	}

	// Ambil data vote
	var vote = conn.vote[id]
	var reason = vote[0]
	var upvote = Array.isArray(vote[1]) ? vote[1] : (vote[1] = [])
	var devote = Array.isArray(vote[2]) ? vote[2] : (vote[2] = [])

	// Guard: sudah vote?
	var isVote = upvote.concat(devote)
	if (isVote.includes(m.sender)) throw 'Kamu sudah vote!'

	// Proses vote
	if (/up/i.test(command)) {
		upvote.push(m.sender)
	} else if (/de/i.test(command)) {
		devote.push(m.sender)
	}

	// Susun pesan (cuma 1 reply)
	var txt = `
*「 VOTE 」*

*Alasan:* ${reason}

*UPVOTE*
_Total: ${upvote.length}_

*DEVOTE*
_Total: ${devote.length}_

*${usedPrefix}hapusvote* - untuk menghapus vote

_${global.wm || ''}_
`.trim()

	await m.reply(txt)
}

handler.help = ['upvote', 'devote']
handler.tags = ['vote']
handler.command = /^(up|de)vote$/i
handler.group = true

module.exports = handler
