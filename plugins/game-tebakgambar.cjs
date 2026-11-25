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
		// ✅ Ganti sendButton → sendMessage, quoted dari msg sebelumnya
		await conn.sendMessage(m.chat, {
			text: 'Masih ada soal belum terjawab di chat ini'
		}, { quoted: conn.tebakgambar[id][0] })
		throw false
	}
	var json = await tebakgambar()

	var caption = `
Timeout *${(timeout / 1000).toFixed(2)} detik*
Ketik ${usedPrefix}hint untuk hint
Bonus: ${poin} XP

_Ketik *nyerah* untuk menyerah._
    `.trim()

	// ✅ Ganti sendButton → sendMessage dengan gambar
	var msg = await conn.sendMessage(m.chat, {
		image: { url: json.img },
		caption
	}, { quoted: m })

	conn.tebakgambar[id] = [
		msg,
		json, poin,
		setTimeout(async () => {
			if (conn.tebakgambar[id]) {
				await conn.sendMessage(m.chat, {
					text: `⏰ *Waktu habis!*\n\nJawabannya adalah *${json.jawaban}*\n\n_Ketik ${usedPrefix}tebakgambar untuk main lagi._`
				}, { quoted: conn.tebakgambar[id][0] })
			}
			delete conn.tebakgambar[id]
		}, timeout)
	]
}
handler.help = ['tebakgambar']
handler.tags = ['game']
handler.command = /^tebakgambar/i

module.exports = handler
