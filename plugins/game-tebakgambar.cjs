var timeout = 120000
var poin = 5000
var handler = async (m, {
	conn,
	usedPrefix
}) => {
	conn.tebakgambar = conn.tebakgambar ? conn.tebakgambar : {}
	var {
		tebakgambar
	} = await import('@bochilteam/scraper');
	var id = m.chat
	if (id in conn.tebakgambar) {
		conn.sendButton(m.chat, 'Masih ada soal belum terjawab di chat ini', author, null, buttons, conn.tebakgambar[id][0])
		throw false
	}
	var json = await tebakgambar()
	// if (!json.status) throw json
	var caption = `
Timeout *${(timeout / 1000).toFixed(2)} detik*
Ketik ${usedPrefix}hint untuk hint
Bonus: ${poin} XP
    `.trim()
	conn.tebakgambar[id] = [
		await conn.sendButton(m.chat, caption, author, json.img, buttons, m),
		json, poin,
		setTimeout(() => {
			if (conn.tebakgambar[id]) conn.sendButton(m.chat, `Waktu habis!\nJawabannya adalah *${json.jawaban}*`, author, null, [
				['tebakgambar', '/tebakgambar']
			], conn.tebakgambar[id][0])
			delete conn.tebakgambar[id]
		}, timeout)
	]
}
handler.help = ['tebakgambar']
handler.tags = ['game']
handler.command = /^tebakgambar/i

module.exports = handler

var buttons = [
	['hint', '/hint'],
	['nyerah', 'menyerah']
]