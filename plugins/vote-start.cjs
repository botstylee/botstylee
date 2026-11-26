// plugins/vote-mulaivote.cjs
// Fitur: Mulai vote baru di grup (admin only)

var handler = async (m, {
	conn,
	text,
	usedPrefix
}) => {
	// Guard: harus ada alasan
	if (!text) throw `Masukkan alasan vote!\nContoh: ${usedPrefix}mulaivote Setuju bot online 24 jam?`

	// Init conn.vote kalau belum ada
	if (!conn.vote) conn.vote = {}

	var id = m.chat

	// Guard: sudah ada vote aktif
	if (id in conn.vote) {
		throw `_Masih ada vote di chat ini!_\n\n*${usedPrefix}hapusvote* - untuk menghapus vote`
	}

	// Simpan vote DULU (biar tidak hilang kalau reply gagal)
	conn.vote[id] = [
		text,
		[],
		[]
	]

	// Baru reply
	await m.reply(
		`✅ Vote dimulai!\n\n*Alasan:* ${text}\n\n*${usedPrefix}upvote* - untuk ya\n*${usedPrefix}devote* - untuk tidak\n*${usedPrefix}cekvote* - untuk mengecek vote\n*${usedPrefix}hapusvote* - untuk menghapus vote`
	)
}

handler.help = ['mulaivote [alasan]']
handler.tags = ['vote']
handler.command = /^(start|mulai)vote$/i
handler.group = true
handler.admin = true

module.exports = handler
