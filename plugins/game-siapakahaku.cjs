var handler = async (m, { conn, usedPrefix }) => {
	conn.siapakahaku = conn.siapakahaku || {}
	var { siapakahaku } = await import('@bochilteam/scraper')
	var id = m.chat
	if (id in conn.siapakahaku) return conn.reply(m.chat, `Masih ada soal belum terjawab. Ketik ${usedPrefix}nyerah untuk menyerah.`, conn.siapakahaku[id][0])
	var json = await siapakahaku()
	if (!json?.jawaban || !json?.soal) throw 'Soal tidak tersedia saat ini.'
	var caption = `Siapakah aku? ${json.soal}\nTimeout: ${(timeout / 1000).toFixed(0)} detik\nKetik ${usedPrefix}who untuk bantuan\nKetik ${usedPrefix}nyerah untuk menyerah\nBonus: ${poin} XP`
	conn.siapakahaku[id] = [
		await conn.reply(m.chat, caption, m), json, poin,
		setTimeout(async () => {
			if (!conn.siapakahaku[id]) return
			await conn.reply(m.chat, `Waktu habis! Jawabannya adalah *${json.jawaban}*`, conn.siapakahaku[id][0])
			delete conn.siapakahaku[id]
		}, timeout)
	]
}
var timeout = 120000
var poin = 5000
handler.help = ['siapakahaku']
handler.tags = ['game']
handler.command = /^siapa(kah)?aku$/i
module.exports = handler
