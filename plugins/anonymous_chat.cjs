async function handler(m, {
	conn,
	command
}) {
	command = command.toLowerCase()
	conn.anonymous = conn.anonymous ? conn.anonymous : {}

	switch (command) {
		case 'next':
		case 'leave': {
			var room = Object.values(conn.anonymous).find(room =>
				room && typeof room.check === 'function' && room.check(m.sender)
			)

			if (!room) {
				return conn.reply(m.chat, '_Kamu tidak sedang berada di anonymous chat._\n\nKetik *.start* untuk mencari partner.', m)
			}

			await conn.reply(m.chat, 'Ok', m)

			var other = room.other(m.sender)
			if (other) {
				await conn.reply(other, '_Partner meninggalkan chat._\n\nKetik *.start* untuk mencari partner baru.', m)
			}

			delete conn.anonymous[room.id]

			if (command === 'leave') break
			// command 'next' → lanjut ke case 'start'
		}
		case 'start': {
			// ✅ Cek apakah user sudah di room
			if (Object.values(conn.anonymous).find(room =>
				room && typeof room.check === 'function' && room.check(m.sender)
			)) {
				return conn.reply(m.chat, '_Kamu masih berada di anonymous chat, menunggu partner._\n\nKetik *.leave* untuk keluar.', m)
			}

			// ✅ Cari room WAITING
			var room = Object.values(conn.anonymous).find(room =>
				room && room.state === 'WAITING' && !room.check(m.sender)
			)

			if (room) {
				// ✅ Partner ditemukan
				await conn.reply(room.a, '_Partner ditemukan!_\n\nKetik *.next* untuk ganti partner, *.leave* untuk keluar.', m)
				room.b = m.sender
				room.state = 'CHATTING'
				await conn.reply(room.b, '_Partner ditemukan!_\n\nKetik *.next* untuk ganti partner, *.leave* untuk keluar.', m)
			} else {
				// ✅ Buat room baru
				var id = +new Date
				conn.anonymous[id] = {
					id,
					a: m.sender,
					b: '',
					state: 'WAITING',
					check: function (who = '') {
						return [this.a, this.b].includes(who)
					},
					other: function (who = '') {
						return who === this.a ? this.b : who === this.b ? this.a : ''
					}
				}
				await conn.reply(m.chat, '_Menunggu partner..._\n\nKetik *.leave* untuk keluar.', m)
			}
			break
		}
	}
}

handler.help = ['start', 'leave', 'next']
handler.tags = ['anonymous']
handler.command = ['start', 'leave', 'next']
handler.private = true

module.exports = handler
