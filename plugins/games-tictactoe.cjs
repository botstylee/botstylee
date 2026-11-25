var handler = async (m, {
	conn,
	usedPrefix,
	command,
	text
}) => {
	conn.game = conn.game ? conn.game : {}
	if (Object.values(conn.game).find(room => room.id.startsWith('tictactoe') && [room.game.playerX, room.game.playerO].includes(m.sender))) throw 'Kamu masih didalam game'
	var room = Object.values(conn.game).find(room => room.state === 'WAITING' && (text ? room.name === text : true))
	// m.reply('[WIP Feature]')
	if (room) {
		m.reply('Partner ditemukan!')
		room.o = m.chat
		room.game.playerO = m.sender
		room.state = 'PLAYING'
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
				9: '9️⃣',
			} [v]
		})
		var str = `
Room ID: ${room.id}
${arr.slice(0, 3).join('')}
${arr.slice(3, 6).join('')}
${arr.slice(6).join('')}
Menunggu @${room.game.currentTurn.split('@')[0]}
Ketik *nyerah* untuk nyerah
`.trim()

		// ✅ Ganti sendButton → sendMessage teks biasa
		if (room.x !== room.o) {
			await conn.sendMessage(room.x, {
				text: str,
				mentions: conn.parseMention(str)
			}, { quoted: m })
		}
		await conn.sendMessage(room.o, {
			text: str,
			mentions: conn.parseMention(str)
		}, { quoted: m })
	} else {
		room = {
			id: 'tictactoe-' + (+new Date),
			x: m.chat,
			o: '',
			game: new TicTacToe(m.sender, 'o'),
			state: 'WAITING'
		}
		if (text) room.name = text
		m.reply('Menunggu partner' + (text ? `\n\nKetik command di bawah ini untuk join:\n${usedPrefix}${command} ${text}` : ''))
		conn.game[room.id] = room
	}
}

handler.help = ['tictactoe', 'ttt'].map(v => v + ' [custom room name]')
handler.tags = ['game']
handler.command = /^(tictactoe|t{3})$/

// ✅ TicTacToe class — sebelumnya tidak di-import, menyebabkan ReferenceError
class TicTacToe {
	constructor(playerX = 'x', playerO = 'o') {
		this.playerX = playerX
		this.playerO = playerO
		this._currentTurn = false
		this._x = 0
		this._o = 0
		this.turns = 0
	}

	get board() {
		return this._board || (this._board = Array(9).fill(null))
	}

	get currentTurn() {
		return this._currentTurn ? this.playerO : this.playerX
	}

	get enemyTurn() {
		return this._currentTurn ? this.playerX : this.playerO
	}

	get isEnded() {
		return this._ended || false
	}

	get isTie() {
		return this.isEnded && !this.winner
	}

	get winner() {
		return this._winner || null
	}

	render() {
		return this.board.map((v, i) => v || (i + 1))
	}

	turn(pos, player) {
		if (this.isEnded) return this
		pos = parseInt(pos) - 1
		if (isNaN(pos) || pos < 0 || pos > 8) return this
		if (this.board[pos]) return this
		if (player !== this.currentTurn) return this

		this.board[pos] = this._currentTurn ? 'O' : 'X'
		this._currentTurn = !this._currentTurn
		this.turns++

		if (this._currentTurn) this._x++
		else this._o++

		this._checkWinner()
		return this
	}

	_checkWinner() {
		var lines = [
			[0, 1, 2], [3, 4, 5], [6, 7, 8],
			[0, 3, 6], [1, 4, 7], [2, 5, 8],
			[0, 4, 8], [2, 4, 6]
		]
		for (var line of lines) {
			var [a, b, c] = line
			if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
				this._ended = true
				this._winner = this.board[a] === 'X' ? this.playerX : this.playerO
				return
			}
		}
		if (this.board.every(v => v)) this._ended = true
	}
}

module.exports = handler
module.exports.TicTacToe = TicTacToe
