var debugMode = !1

var winScore = 2000
var playScore = 1000

export default {
	async before(m) {
		var ok
		var isWin = !1
		var isTie = !1
		var isSurrender = !1
		this.game = this.game ? this.game : {}
		var room = Object.values(this.game).find(room => room.id && room.game && room.state && room.id.startsWith('tictactoe') && [room.game.playerX, room.game.playerO].includes(m.sender) && room.state == 'PLAYING')
		if (room) {
			// m.reply(`[DEBUG]\n${parseInt(m.text)}`)
			if (!/^([1-9]|(me)?nyerah|surr?ender)$/i.test(m.text))
				return !0
			isSurrender = !/^[1-9]$/.test(m.text)
			if (m.sender !== room.game.currentTurn) { // nek wayahku
				if (!isSurrender)
					return !0
			}
			if (debugMode)
				m.reply('[DEBUG]\n' + {
					isSurrender,
					text: m.text
				})
			if (!isSurrender && 1 > (ok = room.game.turn(m.sender === room.game.playerO, parseInt(m.text) - 1))) {
				m.reply({
					'-3': 'Game telah berakhir',
					'-2': 'Invalid',
					'-1': 'Posisi Invalid',
					0: 'Posisi Invalid',
				} [ok])
				return !0
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
					9: '9️⃣',
				} [v]
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
			var users = global.db.data.users
			if ((room.game._currentTurn ^ isSurrender ? room.x : room.o) !== m.chat)
				room[room.game._currentTurn ^ isSurrender ? 'x' : 'o'] = m.chat
			var btn = isTie ? ['TicTacToe', '/ttt'] : ['Nyerah', 'nyerah']
			if (room.x !== room.o)
				await this.reply(room.x, str, m, {
					mentions: this.parseMention(str)
				})
			await this.reply(room.o, str, m, {
				mentions: this.parseMention(str)
			})
			if (isTie || isWin) {
				users[room.game.playerX].mp += playScore
				users[room.game.playerO].mp += playScore
				if (isWin)
					users[winner].mp += winScore - playScore
				if (debugMode)
					m.reply('[DEBUG]\n' + room)
				delete this.game[room.id]
			}
		}
		return !0
	}
}