var handler = async (m, {
	conn,
	usedPrefix,
	text
}) => {
	conn.absen = conn.absen ? conn.absen : {}
	var id = m.chat

	if (id in conn.absen) {
		return conn.reply(m.chat, `_*Masih ada absen di chat ini!*_\n\n*${usedPrefix}hapusabsen* - untuk menghapus absen`, m)
	}

	var judul = text ? text.trim() : '-'

	// ✅ Kirim pesan mulai, simpan message object untuk quote
	var msg = await conn.reply(m.chat, `✅ *Absen dimulai!*

${judul}

*${usedPrefix}absen* - untuk absen
*${usedPrefix}cekabsen* - untuk mengecek absen
*${usedPrefix}hapusabsen* - untuk menghapus data absen`, m)

	conn.absen[id] = [
		msg,
		[],
		judul,
		null // slot timeout (bisa diisi kalau mau auto-close)
	]
}

handler.help = ['mulaiabsen [teks]']
handler.tags = ['absen']
handler.command = /^(start|mulai)absen$/i
handler.group = true
handler.admin = true

module.exports = handler
