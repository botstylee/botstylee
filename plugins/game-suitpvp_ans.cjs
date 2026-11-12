var handler = m => m
handler.before = async function(m) {
	this.suit = this.suit || {}
	var text = typeof m.text === 'string' ? m.text.trim().toLowerCase() : ''
	if (!text) return !0
	var room = Object.values(this.suit).find(item => item?.id && item.status && [item.p, item.p2].includes(m.sender))
	if (!room) return !0
	var users = global.db?.data?.users || {}
	var player = users[m.sender]
	if (player && Number(player.suit) < 0) player.suit = 0

	if (room.status === 'wait' && m.sender === room.p2 && m.isGroup) {
		if (/^(tolak|gamau|nanti|gak bisa|gabisa|nggak bisa)$/i.test(text)) {
			clearTimeout(room.waktu)
			await this.reply(m.chat, `@${room.p2.split('@')[0]} menolak tantangan suit.`, m, { mentions: [room.p2] })
			delete this.suit[room.id]
			return !0
		}
		if (/^(acc(ept)?|terima|gas|oke?|ya)$/i.test(text)) {
			room.status = 'play'
			room.asal = m.chat
			clearTimeout(room.waktu)
			var instructions = `Tantangan diterima! Pilih di chat pribadi dengan bot.\nKetik *batu*, *kertas*, atau *gunting*.\nHadiah menang: ${room.poin} money/XP; penalti kalah: ${room.poin_lose} money.`
			await this.reply(room.p, instructions)
			await this.reply(room.p2, instructions)
			room.waktu_milih = setTimeout(async () => {
				if (!this.suit[room.id]) return
				if (!room.pilih && !room.pilih2) {
					await this.reply(room.asal, 'Kedua pemain tidak memilih. Suit dibatalkan.')
				} else if (!room.pilih || !room.pilih2) {
					var winnerId = room.pilih ? room.p : room.p2
					var loserId = room.pilih ? room.p2 : room.p
					var winnerUser = users[winnerId]
					var loserUser = users[loserId]
					if (winnerUser) {
						winnerUser.money = (Number(winnerUser.money) || 0) + room.poin
						winnerUser.exp = (Number(winnerUser.exp) || 0) + room.poin
					}
					if (loserUser) loserUser.money = Math.max(0, (Number(loserUser.money) || 0) - room.poin_lose)
					await this.reply(room.asal, `Suit berakhir karena salah satu pemain tidak memilih. Pemenang: @${winnerId.split('@')[0]}`, null, { mentions: [winnerId] })
				}
				delete this.suit[room.id]
			}, Number(room.timeout) || 60000)
			return !0
		}
	}

	if (room.status !== 'play' || m.isGroup || ![room.p, room.p2].includes(m.sender)) return !0
	if (!/^(batu|kertas|gunting)$/i.test(text)) return !0
	if (m.sender === room.p && room.pilih || m.sender === room.p2 && room.pilih2) return m.reply('Pilihan kamu sudah tercatat.')
	if (m.sender === room.p) {
		room.pilih = text
		room.text = text
	} else {
		room.pilih2 = text
		room.text2 = text
	}
	await m.reply(`Pilihan *${text}* tercatat. ${room.pilih && room.pilih2 ? 'Menentukan hasil...' : 'Menunggu lawan memilih.'}`)
	if (!room.pilih || !room.pilih2) return !0

	clearTimeout(room.waktu_milih)
	var winner = null
	if (room.pilih !== room.pilih2) {
		var winsAgainst = { batu: 'gunting', gunting: 'kertas', kertas: 'batu' }
		winner = winsAgainst[room.pilih] === room.pilih2 ? room.p : room.p2
	}
	var tie = !winner
	var loser = tie ? null : winner === room.p ? room.p2 : room.p
	if (!tie) {
		var winnerUser = users[winner]
		var loserUser = users[loser]
		if (winnerUser) {
			winnerUser.money = (Number(winnerUser.money) || 0) + room.poin
			winnerUser.exp = (Number(winnerUser.exp) || 0) + room.poin
		}
		if (loserUser) loserUser.money = Math.max(0, (Number(loserUser.money) || 0) - room.poin_lose)
	}
	var result = tie ? 'Seri!' : `Pemenang: @${winner.split('@')[0]} (+${room.poin} money/XP)`
	await this.reply(room.asal, `*Hasil Suit*\n@${room.p.split('@')[0]} memilih ${room.text}\n@${room.p2.split('@')[0]} memilih ${room.text2}\n${result}${tie ? '' : `\nPemain lain kehilangan ${room.poin_lose} money.`}`, null, { mentions: [room.p, room.p2] })
	delete this.suit[room.id]
	return !0
}
handler.exp = 5
module.exports = handler
