var timeout = 120000
var poin = 5000
var handler = async (m, { conn, usedPrefix }) => {
	var { caklontong } = await import('@bochilteam/scraper')
	conn.caklontong = conn.caklontong || {}
	var id = m.chat
	if (id in conn.caklontong) return conn.reply(m.chat, `Masih ada soal belum terjawab. Ketik ${usedPrefix}calo untuk petunjuk atau ${usedPrefix}nyerah untuk menyerah.`, conn.caklontong[id][0])

	var json = await caklontong()
	if (!json?.soal || !json?.jawaban) throw 'Soal Cak Lontong tidak tersedia.'
	var caption = `${json.soal}\nTimeout: ${(timeout / 1000).toFixed(0)} detik\nKetik ${usedPrefix}calo untuk petunjuk atau ${usedPrefix}nyerah untuk menyerah.\nBonus: ${poin} XP`
	conn.caklontong[id] = [
		await conn.reply(m.chat, caption, m), json, poin,
		setTimeout(async () => {
			if (!conn.caklontong[id]) return
			await conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.jawaban}*\n${json.deskripsi || ''}`, conn.caklontong[id][0])
			delete conn.caklontong[id]
		}, timeout)
	]
}
handler.help = ['caklontong']
handler.tags = ['game']
handler.command = /^caklontong$/i
module.exports = handler
