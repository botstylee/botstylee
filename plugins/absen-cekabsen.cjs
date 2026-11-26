var handler = async (m, {
	conn,
	usedPrefix
}) => {
	var id = m.chat
	conn.absen = conn.absen ? conn.absen : {}

	if (!(id in conn.absen)) {
		return conn.reply(m.chat, `_*Tidak ada absen berlangsung digrup ini!*_\n\n*${usedPrefix}mulaiabsen* - untuk memulai absen`, m)
	}

	var absen = conn.absen[id][1]
	if (!Array.isArray(absen)) {
		return conn.reply(m.chat, 'Data absen tidak valid.', m)
	}

	// ✅ Format tanggal manual, tidak bergantung locale
	var d = new Date()
	var bulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
		'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
	var date = `${d.getDate()} ${bulan[d.getMonth()]} ${d.getFullYear()}`

	var list = absen.length
		? absen.map((v, i) => `│ ${i + 1}. @${v.split`@`[0]}`).join('\n')
		: '│ (belum ada yang absen)'

	var judul = conn.absen[id][2] || '-'

	await conn.reply(m.chat, `*「 ABSEN 」*

Tanggal: ${date}
${judul}

┌ *Yang sudah absen:*
│ 
│ Total: ${absen.length}
${list}
│ 
└────

_${global.wm || 'Botstylee'}_`, m, {
		mentions: absen
	})
}

handler.help = ['cekabsen']
handler.tags = ['absen']
handler.command = /^cekabsen$/i
handler.group = true

module.exports = handler
