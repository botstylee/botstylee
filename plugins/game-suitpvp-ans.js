var handler = m => m
handler.before = async function(m) {
	this.suit = this.suit ? this.suit : {}
	if (db.data.users[m.sender].suit < 0) db.data.users[m.sender].suit = 0
	var room = Object.values(this.suit).find(room => room.id && room.status && [room.p, room.p2].includes(m.sender))
	if (room) {
		var win = ''
		var tie = false
		if (m.sender == room.p2 && /^(acc(ept)?|terima|gas|oke?|tolak|gamau|nanti|ga(k.)?bisa)/i.test(m.text) && m.isGroup && room.status == 'wait') {
			if (/^(tolak|gamau|nanti|ga(k.)?bisa)/i.test(m.text)) {
				this.reply(m.chat, `@${room.p2.split`@`[0]} menolak suit, suit dibatalkan`, m)
				delete this.suit[room.id]
				return !0
			}
			room.status = 'play'
			room.asal = m.chat
			clearTimeout(room.waktu)
			//delete room[room.id].waktu
			m.reply(`Suit telah dikirimkan ke chat
@${room.p.split`@`[0]} dan 
@${room.p2.split`@`[0]}

Silahkan pilih suit di chat masing"
klik wa.me/${conn.user.jid.split`@`[0]}`, m.chat, {
				mentions: [room.p, room.p2]
			})

			if (!room.pilih) this.reply(room.p, `Silahkan ketik\n\n*Gunting* , *Batu* , atau Kertas*\nMenang +${room.poin} MP\nKalah -${room.poin_lose} MP`, m)
			if (!room.pilih2) this.reply(room.p2, `Silahkan ketik\n\n*Gunting* , *Batu* , atau Kertas*\nMenang +${room.poin} MP\nKalah -${room.poin_lose} MP`, m)
			room.waktu_milih = setTimeout(() => {
				if (!room.pilih && !room.pilih2) this.reply(m.chat, `Kedua pemain tidak niat main,\nSuit dibatalkan`)
				else if (!room.pilih || !room.pilih2) {
					win = !room.pilih ? room.p2 : room.p
					this.reply(m.chat, `@${(room.pilih ? room.p2 : room.p).split`@`[0]} tidak memilih suit, game berakhir`, m)
					db.data.users[win == room.p ? room.p : room.p2].mp += room.poin
					db.data.users[win == room.p ? room.p2 : room.p].mp -= room.poin_lose
				}
				delete this.suit[room.id]
				return !0
			}, room.timeout)
		}
		var jwb = m.sender == room.p
		var jwb2 = m.sender == room.p2
		var g = /gunting/i
		var b = /batu/i
		var k = /kertas/i
		var reg = /^(gunting|batu|kertas)/i
		if (jwb && reg.test(m.text) && !room.pilih && !m.isGroup) {
			room.pilih = reg.exec(m.text.toLowerCase())[0]
			room.text = m.text
			m.reply(`Kamu telah memilih ${m.text} ${!room.pilih2 ? `\n\nMenunggu lawan memilih` : ''}`)
			if (!room.pilih2) this.reply(room.p2, '_Lawan sudah memilih_\nSekarang giliran kamu', 0)
		}
		if (jwb2 && reg.test(m.text) && !room.pilih2 && !m.isGroup) {
			room.pilih2 = reg.exec(m.text.toLowerCase())[0]
			room.text2 = m.text
			m.reply(`Kamu telah memilih ${m.text} ${!room.pilih ? `\n\nMenunggu lawan memilih` : ''}`)
			if (!room.pilih) this.reply(room.p, '_Lawan sudah memilih_\nSekarang giliran kamu', 0)
		}
		var stage = room.pilih
		var stage2 = room.pilih2
		if (room.pilih && room.pilih2) {
			clearTimeout(room.waktu_milih)
			if (b.test(stage) && g.test(stage2)) win = room.p
			else if (b.test(stage) && k.test(stage2)) win = room.p2
			else if (g.test(stage) && k.test(stage2)) win = room.p
			else if (g.test(stage) && b.test(stage2)) win = room.p2
			else if (k.test(stage) && b.test(stage2)) win = room.p
			else if (k.test(stage) && g.test(stage2)) win = room.p2
			else if (stage == stage2) tie = true
			this.reply(room.asal, `
_*Hasil Suit*_${tie ? '\nSERI' : ''}

@${room.p.split`@`[0]} (${room.text}) ${tie ? '' : room.p == win ? ` Menang \n+${room.poin} MP` : ` Kalah \n-${room.poin_lose} MP`}
@${room.p2.split`@`[0]} (${room.text2}) ${tie ? '' : room.p2 == win ? ` Menang \n+${room.poin} MP` : ` Kalah \n-${room.poin_lose} MP`}
`.trim(), m, {
				mentions: [room.p, room.p2]
			})
			if (!tie) {
				db.data.users[win == room.p ? room.p : room.p2].mp += room.poin
				db.data.users[win == room.p ? room.p2 : room.p].mp -= room.poin_lose
			}
			delete this.suit[room.id]
		}
	}
	return !0
}
export default handler

function random(arr) {
	return arr[Math.floor(Math.random() * arr.length)]
}