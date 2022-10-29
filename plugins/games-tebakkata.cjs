var timeout = 120000
var poin = 5000
var handler = async (m, {
	conn,
	usedPrefix
}) => {
	conn.tebakkata = conn.tebakkata ? conn.tebakkata : {}
	var {
		tebakkata
	} = await import('@bochilteam/scraper');
	var id = m.chat
	if (id in conn.tebakkata) {
		conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tebakkata[id][0])
		throw false
	}
	var json = await tebakkata()
	var caption = `
${json.soal}
Timeout *${(timeout / 1000).toFixed(2)} detik*
Ketik ${usedPrefix}teka untuk bantuan
Bonus: ${poin} XP
`.trim()
	conn.tebakkata[id] = [
		await conn.sendButton(m.chat, caption, author, ['hint', `${usedPrefix}teka`], m),
		json, poin,
		setTimeout(() => {
			if (conn.tebakkata[id]) conn.sendButton(m.chat, `Waktu habis!\nJawabannya adalah *${json.jawaban}*`, author, ['tebakkata', `${usedPrefix}tebakkata`], conn.tebakkata[id][0])
			delete conn.tebakkata[id]
		}, timeout)
	]
}
handler.help = ['tebakkata']
handler.tags = ['game']
handler.command = /^tebakkata/i

module.exports = handler