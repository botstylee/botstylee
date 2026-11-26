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
	var total = Array.isArray(absen) ? absen.length : 0

	// ✅ Batalkan timeout kalau ada
	if (conn.absen[id][3]) {
		clearTimeout(conn.absen[id][3])
	}

	delete conn.absen[id]

	await conn.reply(m.chat, `✅ *Absen dihapus.*\n\nTotal yang sudah absen: *${total}* orang.`, m)
}

handler.help = ['hapusabsen']
handler.tags = ['absen']
handler.command = /^(delete|hapus)absen$/i
handler.group = true
handler.admin = true

module.exports = handler
