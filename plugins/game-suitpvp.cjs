var timeout = 60000
var poin = 2000
var poin_lose = 500
var handler = async (m, { conn, usedPrefix }) => {
	conn.suit = conn.suit || {}
	var active = Object.values(conn.suit).find(room => room?.id?.startsWith('suit') && [room.p, room.p2].includes(m.sender))
	if (active) throw 'Selesaikan suit kamu yang sebelumnya terlebih dahulu.'
	var opponent = m.mentionedJid?.[0]
	if (!opponent) return m.reply(`Tandai orang yang ingin ditantang.\nContoh: ${usedPrefix}suitpvp @628xxxx`)
	if (opponent === m.sender) return m.reply('Kamu tidak bisa menantang diri sendiri.')
	if (Object.values(conn.suit).some(room => room?.id?.startsWith('suit') && [room.p, room.p2].includes(opponent))) throw 'Orang yang kamu tantang sedang bermain suit.'

	var id = `suit_${Date.now()}`
	var caption = `_*SUIT PvP*_\n@${m.sender.split('@')[0]} menantang @${opponent.split('@')[0]}.\n\n@${opponent.split('@')[0]}, ketik *terima* untuk mulai atau *tolak* untuk membatalkan.`
	var message = await conn.reply(m.chat, caption, m, { mentions: [m.sender, opponent] })
	conn.suit[id] = {
		chat: message, id, p: m.sender, p2: opponent, status: 'wait',
		waktu: setTimeout(async () => {
			if (!conn.suit[id]) return
			await conn.reply(m.chat, 'Waktu menerima tantangan suit habis.', message)
			delete conn.suit[id]
		}, timeout),
		poin, poin_lose, timeout
	}
}
handler.tags = ['game']
handler.help = ['suitpvp', 'suit2'].map(value => value + ' @tag')
handler.command = /^suit(pvp|2)$/i
handler.group = true
module.exports = handler
