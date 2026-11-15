const CHOICES = /^(gunting|batu|kertas)$/i
const ACCEPT = /^(acc(ept)?|terima|gas|oke?)$/i
const DECLINE = /^(tolak|gamau|nanti|ga(k)?bisa|gakbisa)$/i

const handler = message => message

handler.before = async function (m) {
	this.suit ||= {}
	if (typeof m.text !== 'string') return false

	const room = Object.values(this.suit).find(candidate =>
		candidate?.id?.startsWith('suit_') && candidate.status &&
		[candidate.p, candidate.p2].includes(m.sender)
	)
	if (!room) return false

	const text = m.text.trim()
	const isOpponent = m.sender === room.p2

	if (room.status === 'wait' && isOpponent && m.isGroup) {
		if (DECLINE.test(text)) {
			clearTimeout(room.waktu)
			await this.sendMessage(room.asal, {
				text: `@${room.p2.split('@')[0]} menolak tantangan suit. Permainan dibatalkan.`,
				mentions: [room.p2]
			}, { quoted: m })
			delete this.suit[room.id]
			return true
		}
		if (!ACCEPT.test(text)) return false

		room.status = 'play'
		room.asal = m.chat
		clearTimeout(room.waktu)
		await this.sendMessage(room.asal, {
			text: `Tantangan diterima! Saya sudah mengirim instruksi pilihan ke @${room.p.split('@')[0]} dan @${room.p2.split('@')[0]}. Balas bot secara pribadi dengan *batu*, *gunting*, atau *kertas*.`,
			mentions: [room.p, room.p2]
		}, { quoted: m })

		const prompt = `Tantangan suit diterima. Kirim pilihanmu lewat chat pribadi dengan kata *batu*, *gunting*, atau *kertas*.\nMenang: +${room.poin} poin dan EXP. Kalah: -${room.poin_lose} poin.`
		await Promise.all([
			this.sendMessage(room.p, { text: prompt }),
			this.sendMessage(room.p2, { text: prompt })
		])

		room.waktu_milih = setTimeout(async () => {
			if (!this.suit[room.id]) return
			const pChose = Boolean(room.pilih)
			const p2Chose = Boolean(room.pilih2)
			let result
			if (!pChose && !p2Chose) {
				result = 'Kedua pemain tidak memilih. Permainan suit dibatalkan.'
			} else if (pChose !== p2Chose) {
				const winner = pChose ? room.p : room.p2
				const loser = pChose ? room.p2 : room.p
				const winnerData = db.data.users[winner]
				const loserData = db.data.users[loser]
				if (winnerData && loserData) {
					winnerData.money = (Number(winnerData.money) || 0) + room.poin
					winnerData.exp = (Number(winnerData.exp) || 0) + room.poin
					loserData.money = Math.max(0, (Number(loserData.money) || 0) - room.poin_lose)
				}
				result = `@${(pChose ? room.p2 : room.p).split('@')[0]} tidak memilih tepat waktu. @${winner.split('@')[0]} menang.\n+${room.poin} poin untuk pemenang.`
			} else {
				result = 'Waktu memilih habis. Permainan dibatalkan.'
			}
			await this.sendMessage(room.asal, { text: result, mentions: [room.p, room.p2] }).catch(() => {})
			delete this.suit[room.id]
		}, room.timeout || 60_000)
		return true
	}

	if (room.status !== 'play' || m.isGroup || !CHOICES.test(text)) return false

	const choice = text.toLowerCase()
	if (m.sender === room.p) {
		if (room.pilih) {
			await m.reply('Pilihanmu sudah tercatat; tunggu lawan memilih.')
			return true
		}
		room.pilih = choice
		room.text = choice
	} else {
		if (room.pilih2) {
			await m.reply('Pilihanmu sudah tercatat; tunggu lawan memilih.')
			return true
		}
		room.pilih2 = choice
		room.text2 = choice
	}

	await m.reply(`Pilihan *${choice}* tercatat.${room.pilih && room.pilih2 ? '' : '\nMenunggu lawan memilih.'}`)
	if (!room.pilih || !room.pilih2) return true

	clearTimeout(room.waktu_milih)
	const beats = { batu: 'gunting', gunting: 'kertas', kertas: 'batu' }
	const winner = room.pilih === room.pilih2 ? null : beats[room.pilih] === room.pilih2 ? room.p : room.p2
	let result

	if (!winner) {
		result = `Hasil Suit: SERI\n@${room.p.split('@')[0]} memilih ${room.text}.\n@${room.p2.split('@')[0]} memilih ${room.text2}.`
	} else {
		const loser = winner === room.p ? room.p2 : room.p
		const winnerData = db.data.users[winner]
		const loserData = db.data.users[loser]
		if (winnerData && loserData) {
			winnerData.money = (Number(winnerData.money) || 0) + room.poin
			winnerData.exp = (Number(winnerData.exp) || 0) + room.poin
			loserData.money = Math.max(0, (Number(loserData.money) || 0) - room.poin_lose)
		}
		result = `Hasil Suit: @${winner.split('@')[0]} MENANG!\n@${room.p.split('@')[0]} memilih ${room.text}.\n@${room.p2.split('@')[0]} memilih ${room.text2}.\nPemenang mendapat +${room.poin} poin dan EXP.\nPemain yang kalah kehilangan hingga ${room.poin_lose} poin.`
	}

	await this.sendMessage(room.asal, { text: result, mentions: [room.p, room.p2] }, { quoted: m })
	delete this.suit[room.id]
	return true
}

handler.exp = 5
module.exports = handler
