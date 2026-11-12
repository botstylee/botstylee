var format = require('util').format
var debugMode = false
var winScore = 4999
var playScore = 99

module.exports = {
	async before(m) {
		this.game = this.game || {}
		var room = Object.values(this.game).find(value => value?.id?.startsWith('tictactoe') && value.game && value.state && [value.game.playerX, value.game.playerO].includes(m.sender) && value.state === 'PLAYING')
		if (!room || typeof m.text !== 'string') return !0
		var input = m.text.trim()
		if (!/^([1-9]|(me)?nyerah|surr?ender)$/i.test(input)) return !0
		var isSurrender = !/^[1-9]$/.test(input)
		if (m.sender !== room.game.currentTurn && !isSurrender) return !0

		var isWin = false
		var isTie = false
		var ok
		if (!isSurrender && 1 > (ok = room.game.turn(m.sender === room.game.playerO, Number(input) - 1))) {
			await m.reply(({ '-3': 'Game telah berakhir', '-2': 'Langkah tidak valid', '-1': 'Posisi sudah terisi', 0: 'Posisi tidak valid' })[ok] || 'Langkah tidak valid')
			return !0
		}
		if (m.sender === room.game.winner) isWin = true
		else if (room.game.board === 511) isTie = true
		if (isSurrender) {
			room.game._currentTurn = m.sender === room.game.playerX
			isWin = true
		}

		var winner = isSurrender ? room.game.currentTurn : room.game.winner
		var cells = room.game.render().map(value => ({ X: '❌', O: '⭕', 1: '1️⃣', 2: '2️⃣', 3: '3️⃣', 4: '4️⃣', 5: '5️⃣', 6: '6️⃣', 7: '7️⃣', 8: '8️⃣', 9: '9️⃣' })[value] || '⬜')
		var text = `${cells.slice(0, 3).join('')}\n${cells.slice(3, 6).join('')}\n${cells.slice(6).join('')}\n${isWin ? `@${winner.split('@')[0]} menang! (+${winScore} XP)` : isTie ? `Game seri (+${playScore} XP)` : `Giliran ${['❌', '⭕'][Number(room.game._currentTurn)]} (@${room.game.currentTurn.split('@')[0]})`}\n❌: @${room.game.playerX.split('@')[0]}\n⭕: @${room.game.playerO.split('@')[0]}\nKetik angka 1-9 untuk jalan, atau *nyerah* untuk menyerah.\nRoom ID: ${room.id}`
		var chats = [...new Set([room.x, room.o].filter(Boolean))]
		for (var chat of chats) await this.reply(chat, text, m, { mentions: this.parseMention(text) })

		if (isTie || isWin) {
			var users = global.db?.data?.users || {}
			if (users[room.game.playerX]) users[room.game.playerX].exp = (Number(users[room.game.playerX].exp) || 0) + playScore
			if (users[room.game.playerO]) users[room.game.playerO].exp = (Number(users[room.game.playerO].exp) || 0) + playScore
			if (isWin && users[winner]) users[winner].exp = (Number(users[winner].exp) || 0) + winScore - playScore
			if (debugMode) await m.reply('[DEBUG]\n' + format(room))
			delete this.game[room.id]
		}
		return !0
	}
}
