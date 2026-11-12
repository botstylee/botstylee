var handler = async (m, { conn, usedPrefix }) => {
	conn.tebakgambar = conn.tebakgambar || {}
	var { tebakgambar } = await import('@bochilteam/scraper')
	var id = m.chat
	if (id in conn.tebakgambar) return conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini. Ketik ' + usedPrefix + 'nyerah untuk menyerah.', conn.tebakgambar[id][0])

	var json = await tebakgambar()
	if (!json?.jawaban || !json?.img) throw 'Soal tebak gambar tidak tersedia saat ini.'
	var caption = `${json.deskripsi || 'Tebak gambar berikut!'}\n\nTimeout: ${(timeout / 1000).toFixed(0)} detik\nKetik ${usedPrefix}hint untuk petunjuk.\nBonus: ${poin} XP`
	conn.tebakgambar[id] = [
		await conn.sendFile(m.chat, json.img, 'tebakgambar.jpg', caption, m),
		json, poin,
		setTimeout(async () => {
			if (!conn.tebakgambar[id]) return
			await conn.reply(m.chat, `Waktu habis! Jawabannya adalah *${json.jawaban}*`, conn.tebakgambar[id][0])
			delete conn.tebakgambar[id]
		}, timeout)
	]
}
var timeout = 120000
var poin = 5000
handler.help = ['tebakgambar']
handler.tags = ['game']
handler.command = /^tebakgambar$/i
module.exports = handler
