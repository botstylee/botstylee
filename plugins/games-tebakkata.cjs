var handler = async (m, { conn, usedPrefix }) => {
	conn.tebakkata = conn.tebakkata || {}
	var { tebakkata } = await import('@bochilteam/scraper')
	var id = m.chat
	if (id in conn.tebakkata) return conn.reply(m.chat, `Masih ada soal belum terjawab. Ketik ${usedPrefix}nyerah untuk menyerah.`, conn.tebakkata[id][0])

	var json = await tebakkata()
	if (!json?.jawaban || !json?.soal) throw 'Soal tebak kata tidak tersedia saat ini.'
	var caption = `${json.soal}\n\nTimeout: ${(timeout / 1000).toFixed(0)} detik\nKetik ${usedPrefix}teka untuk petunjuk.\nBonus: ${poin} XP`
	conn.tebakkata[id] = [
		await conn.reply(m.chat, caption, m),
		json, poin,
		setTimeout(async () => {
			if (!conn.tebakkata[id]) return
			await conn.reply(m.chat, `Waktu habis! Jawabannya adalah *${json.jawaban}*`, conn.tebakkata[id][0])
			delete conn.tebakkata[id]
		}, timeout)
	]
}
var timeout = 120000
var poin = 5000
handler.help = ['tebakkata']
handler.tags = ['game']
handler.command = /^tebakkata$/i
module.exports = handler
