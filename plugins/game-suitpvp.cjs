const timeout = 60_000
const winPoints = 2000
const losePoints = 500

const handler = async (m, { conn, usedPrefix = '.' }) => {
	conn.suit ||= {}
	const opponent = m.mentionedJid?.[0]
	if (!opponent) {
		throw `Tag lawan untuk menantangnya.\nContoh: ${usedPrefix}suitpvp @6281234567890`
	}
	if (opponent === m.sender) throw 'Kamu tidak bisa menantang diri sendiri.'

	const activeRoom = Object.values(conn.suit).find(room =>
		room?.id?.startsWith('suit_') && [room.p, room.p2].includes(m.sender)
	)
	if (activeRoom) throw 'Selesaikan permainan suit sebelumnya terlebih dahulu.'

	const opponentRoom = Object.values(conn.suit).find(room =>
		room?.id?.startsWith('suit_') && [room.p, room.p2].includes(opponent)
	)
	if (opponentRoom) throw 'Orang yang kamu tantang sedang bermain suit dengan orang lain.'

	const id = `suit_${Date.now()}`
	const caption = [
		'*TANTANGAN SUIT PvP*',
		`@${m.sender.split('@')[0]} menantang @${opponent.split('@')[0]} bermain suit.`,
		'',
		`@${opponent.split('@')[0]}, ketik *terima* untuk menerima atau *tolak* untuk menolak.`,
		'Tantangan kedaluwarsa dalam 60 detik.'
	].join('\n')

	const sentMessage = await conn.sendMessage(m.chat, {
		text: caption,
		mentions: [m.sender, opponent]
	}, { quoted: m })

	conn.suit[id] = {
		id,
		chat: sentMessage,
		p: m.sender,
		p2: opponent,
		asal: m.chat,
		status: 'wait',
		poin: winPoints,
		poin_lose: losePoints,
		timeout,
		waktu: setTimeout(async () => {
			const room = conn.suit[id]
			if (!room) return
			await conn.sendMessage(room.asal, { text: 'Waktu tantangan suit habis. Permainan dibatalkan.' }).catch(() => {})
			delete conn.suit[id]
		}, timeout)
	}
}

handler.tags = ['game']
handler.help = ['suitpvp @tag', 'suit2 @tag']
handler.command = /^suit(pvp|2)$/i
handler.group = true
module.exports = handler
