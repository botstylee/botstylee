// plugins/kerang-apakah.cjs
// Fitur: Jawab pertanyaan "apakah" dengan jawaban acak (fun)

var handler = async (m, {
	conn,
	text
}) => {
	// Guard: harus ada pertanyaan
	if (!text) return m.reply('Apakah apa? Contoh: .apakah aku ganteng?')

	// Pilih jawaban acak
	var jawab = pickRandom([
		'Yap',
		'Sepertinya Begitu',
		'Kayaknya',
		'Kayaknya nggak',
		'Nggak',
		'Nggak mungkin'
	])

	await conn.reply(m.chat, jawab, m)
}

handler.help = ['apakah <teks>']
handler.tags = ['kerang']
handler.command = /^apakah$/i

module.exports = handler

function pickRandom(list) {
	return list[Math.floor(Math.random() * list.length)]
}
