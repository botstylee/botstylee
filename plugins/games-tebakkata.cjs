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

_Ketik *nyerah* untuk menyerah._
`.trim()

	// ✅ Ganti sendButton → sendMessage teks biasa
	var msg = await conn.sendMessage(m.chat, {
		text: caption
	}, { quoted: m })

	conn.tebakkata[id] = [
		msg,
		json, poin,
		setTimeout(async () => {
			if (conn.tebakkata[id]) {
				await conn.sendMessage(m.chat, {
					text: `⏰ *Waktu habis!*\n\nJawabannya adalah *${json.jawaban}*\n\n_Ketik ${usedPrefix}tebakkata untuk main lagi._`
				}, { quoted: conn.tebakkata[id][0] })
			}
			delete conn.tebakkata[id]
		}, timeout)
	]
}
handler.help = ['tebakkata']
handler.tags = ['game']
handler.command = /^tebakkata/i

module.exports = handler
