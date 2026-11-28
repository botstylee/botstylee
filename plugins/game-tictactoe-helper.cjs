var debugMode = false

var winScore = 2000
var playScore = 1000

var handler = {
	async before(m) {
		var ok
		var isWin = false
		var isTie = false
		var isSurrender = false

		this.game = this.game ? this.game : {}

		var room = Object.values(this.game).find(room =>
			room.id &&
			room.game &&
			room.state &&
			room.id.startsWith('tictactoe') &&
			[room.game.playerX, room.game.playerO].includes(m.sender) &&
			room.state === 'PLAYING'
		)

		if (!room) return true

		// ✅ Validasi game ada
		if (!room.game) return true

		// ✅ Hanya proses input yang valid
		if (!/^([1-9]|(me)?nyerah|surr?ender)$/i.test(m.text || ''))
			return true

		isSurrender = !/^[1-9]$/.test(m.text)

		// ✅ Kalau bukan giliran user, hanya izinkan surrender
		if (m.sender !== room.game.currentTurn) {
			if (!isSurrender) return true
		}

		if (debugMode) {
			await m.reply('[DEBUG]\n' + JSON.stringify({
				isSurrender,
				text: m.text
			}, null, 2))
		}

		// ✅ Proses langkah
		if (!isSurrender && 1 > (ok = room.game.turn(m.sender === room.game.playerO, parseInt(m.text) - 1))) {
			var errMsg = {
				'-3': 'Game telah berakhir',
				'-2': 'Invalid',
				'-1': 'Posisi Invalid',
				0: 'Posisi Invalid'
			}[ok] || 'Posisi Invalid'
			await m.reply(errMsg)
			return true
		}

		if (m.sender === room.game.winner)
			isWin = true
		else if (room.game.board === 511)
			isTie = true

		var arr = room.game.render().map(v => {
			return {
				X: '❌',
				O: '⭕',
				1: '1️⃣',
				2: '2️⃣',
				3: '3️⃣',
				4: '4️⃣',
				5: '5️⃣',
				6: '6️⃣',
				7: '7️⃣',
				8: '8️⃣',
				9: '9️⃣'
			}[v]
		})

		if (isSurrender) {
			room.game._currentTurn = m.sender === room.game.playerX
			isWin = true
		}

		var winner = isSurrender ? room.game.currentTurn : room.game.winner

		var str = `
${arr.slice(0, 3).join('')}
${arr.slice(3, 6).join('')}
${arr.slice(6).join('')}
${isWin ? `@${winner.split('@')[0]} Menang! (+${winScore} MP)` : isTie ? `Game berakhir (+${playScore} MP)` : `Giliran ${['❌', '⭕'][1 * room.game._currentTurn]} (@${room.game.currentTurn.split('@')[0]})`}
❌: @${room.game.playerX.split('@')[0]}
⭕: @${room.game.playerO.split('@')[0]}
${isSurrender || isTie || isWin ? '' : 'Ketik *nyerah* untuk nyerah'}
Room ID: ${room.id}
`.trim()

		// ✅ Update room.x / room.o
		if ((room.game._currentTurn ^ isSurrender ? room.x : room.o) !== m.chat)
			room[room.game._currentTurn ^ isSurrender ? 'x' : 'o'] = m.chat

		// ✅ Kirim ke kedua pemain
		if (room.x !== room.o)
			await this.reply(room.x, str, m, { mentions: this.parseMention(str) })
		await this.reply(room.o, str, m, { mentions: this.parseMention(str) })

		// ✅ Beri reward kalau selesai
		if (isTie || isWin) {
			// ✅ Pastikan database & user ada
			var db = global.db || require('../lib/database.js').default
			if (db?.data?.users) {
				var users = db.data.users
				// ✅ Inisialisasi user kalau belum ada
				if (!users[room.game.playerX]) users[room.game.playerX] = { mp: 0 }
				if (typeof users[room.game.playerX].mp !== 'number') users[room.game.playerX].mp = 0
				if (!users[room.game.playerO]) users[room.game.playerO] = { mp: 0 }
				if (typeof users[room.game.playerO].mp !== 'number') users[room.game.playerO].mp = 0

				users[room.game.playerX].mp += playScore
				users[room.game.playerO].mp += playScore

				if (isWin) {
					if (!users[winner]) users[winner] = { mp: 0 }
					if (typeof users[winner].mp !== 'number') users[winner].mp = 0
					users[winner].mp += winScore - playScore
				}
			}

			if (debugMode) await m.reply('[DEBUG]\n' + JSON.stringify(room, null, 2))
			delete this.game[room.id]
		}

		return true
	}
}

module.exports = handler
