// plugins/games-_tictactoe.cjs
// Fitur: TicTacToe (dipanggil via before, bukan handler)

var { format } = require('util')

var debugMode = false
var winScore = 4999
var playScore = 99

module.exports = {
	async before(m) {
		// Guard: harus ada teks
		if (!m.text) return true

		var ok
		var isWin = false
		var isTie = false
		var isSurrender = false

		this.game = this.game ? this.game : {}

		// Cari room yang sedang PLAYING dan melibatkan sender
		var room = Object.values(this.game).find(room =>
			room.id &&
			room.game &&
			room.state &&
			room.id.startsWith('tictactoe') &&
			[room.game.playerX, room.game.playerO].includes(m.sender) &&
			room.state === 'PLAYING'
		)

		if (!room) return true

		// Guard: hanya proses kalau teks valid (1-9 / nyerah / surrender)
		if (!/^([1-9]|(me)?nyerah|surr?ender)$/i.test(m.text)) return true

		isSurrender = !/^[1-9]$/.test(m.text)

		// Guard: kalau bukan giliran, hanya boleh surrender
		if (m.sender !== room.game.currentTurn && !isSurrender) return true

		if (debugMode) {
			m.reply('[DEBUG]\n' + format({ isSurrender, text: m.text }))
		}

		// Proses turn (kalau bukan surrender)
		if (!isSurrender) {
			ok = room.game.turn(m.sender === room.game.playerO, parseInt(m.text) - 1)
			if (ok < 1) {
				var errMsg = {
					'-3': 'Game telah berakhir',
					'-2': 'Invalid',
					'-1': 'Posisi Invalid',
					0: 'Posisi Invalid'
				}[ok] || 'Posisi Invalid'
				m.reply(errMsg)
				return true
			}
		}

		// Cek menang / tie
		if (m.sender === room.game.winner) isWin = true
		else if (room.game.board === 511) isTie = true

		// Render papan
		var arr = room.game.render().map(v => ({
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
		}[v]))

		if (isSurrender) {
			room.game._currentTurn = m.sender === room.game.playerX
			isWin = true
		}

		var winner = isSurrender ? room.game.currentTurn : room.game.winner

		var str = `
${arr.slice(0, 3).join('')}
${arr.slice(3, 6).join('')}
${arr.slice(6).join('')}
${isWin
	? `@${winner.split('@')[0]} Menang! (+${winScore} XP)`
	: isTie
		? `Game berakhir (+${playScore} XP)`
		: `Giliran ${['❌', '⭕'][1 * room.game._currentTurn]} (@${room.game.currentTurn.split('@')[0]})`
}
❌: @${room.game.playerX.split('@')[0]}
⭕: @${room.game.playerO.split('@')[0]}
Ketik *nyerah* untuk nyerah
Room ID: ${room.id}
`.trim()

		var users = global.db.data.users

		// Update room.x / room.o kalau perlu
		if ((room.game._currentTurn ^ isSurrender ? room.x : room.o) !== m.chat) {
			room[room.game._currentTurn ^ isSurrender ? 'x' : 'o'] = m.chat
		}

		// Kirim ke kedua pemain (pakai sendMessage, bukan sendButton)
		var mentions = this.parseMention ? this.parseMention(str) : []

		if (room.x !== room.o) {
			await this.sendMessage(room.x, { text: str, mentions }, { quoted: m })
		}
		await this.sendMessage(room.o, { text: str, mentions }, { quoted: m })

		// Update XP & hapus room kalau selesai
		if (isTie || isWin) {
			// Guard: user harus terdaftar
			if (users[room.game.playerX]) {
				users[room.game.playerX].exp = (users[room.game.playerX].exp || 0) + playScore
			}
			if (users[room.game.playerO]) {
				users[room.game.playerO].exp = (users[room.game.playerO].exp || 0) + playScore
			}
			if (isWin && users[winner]) {
				users[winner].exp = (users[winner].exp || 0) + (winScore - playScore)
			}
			if (debugMode) m.reply('[DEBUG]\n' + format(room))
			delete this.game[room.id]
		}

		return true
	}
}
