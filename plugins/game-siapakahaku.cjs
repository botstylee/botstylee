var timeout = 120000
var poin = 5000

var handler = async (m, {
	conn,
	usedPrefix
}) => {
	conn.siapakahaku = conn.siapakahaku ? conn.siapakahaku : {}
	var {
		siapakahaku
	} = await import('@bochilteam/scraper');
	var id = m.chat
	if (id in conn.siapakahaku) {
		conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.siapakahaku[id][0])
		throw false
	}
	var json = await siapakahaku()
	var caption = `
Siapakah aku? ${json.soal}
Timeout *${(timeout / 1000).toFixed(2)} detik*
Ketik ${usedPrefix}who untuk bantuan
Bonus: ${poin} XP
`.trim()

	// ✅ Ganti sendButton → sendMessage teks biasa
	var msg = await conn.sendMessage(m.chat, {
		text: caption
	}, { quoted: m })

	conn.siapakahaku[id] = [
		msg,
		json, poin,
		setTimeout(async () => {
			if (conn.siapakahaku[id]) {
				await conn.sendMessage(m.chat, {
					text: `⏰ *Waktu habis!*\n\nJawabannya adalah *${json.jawaban}*\n\n_Ketik ${usedPrefix}siapakahaku untuk main lagi._`
				}, { quoted: conn.siapakahaku[id][0] })
			}
			delete conn.siapakahaku[id]
		}, timeout)
	]
}
handler.help = ['siapakahaku']
handler.tags = ['game']
handler.command = /^siapa(kah)?aku/i

module.exports = handler
