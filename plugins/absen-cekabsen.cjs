var handler = async (m, {
	conn,
	usedPrefix
}) => {
	var id = m.chat
	conn.absen = conn.absen ? conn.absen : {}
	if (!(id in conn.absen)) throw `_*Tidak ada absen berlangsung digrup ini!*_\n\n*${usedPrefix}mulaiabsen* - untuk memulai absen`

	var d = new Date
	var date = d.toLocaleDateString('id', {
		day: 'numeric',
		month: 'long',
		year: 'numeric'
	})
	var absen = conn.absen[id][1]
	var list = absen.map((v, i) => `│ ${i + 1}. @${v.split`@`[0]}`).join('\n')
	conn.reply(m.chat, `*「 ABSEN 」*

Tanggal: ${date}
${conn.absen[id][2]}

┌ *Yang sudah absen:*
│ 
│ Total: ${absen.length}
${list}
│ 
└────

_${global.wm}_`, m, {
		mentions: absen
	})
}
handler.help = ['cekabsen']
handler.tags = ['absen']
handler.command = /^cekabsen$/i
handler.group = true
module.exports = handler