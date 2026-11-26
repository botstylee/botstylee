// plugins/kerang-kapan.cjs
// Fitur: Jawab "kapan" dengan waktu acak (fun)

var handler = async (m, {
	conn,
	text
}) => {
	// Guard: harus ada pertanyaan
	if (!text) return m.reply('Kapan apa? Contoh: .kapan aku jadian?')

	// Pilih waktu acak
	var waktu = pickRandom(['detik', 'menit', 'jam', 'hari', 'minggu', 'bulan', 'tahun', 'abad'])
	var angka = Math.floor(Math.random() * 100)

	var jawab = `Kayaknya ${angka} ${waktu} lagi ...`

	await conn.reply(m.chat, jawab, m)
}

handler.help = ['kapan <text>', 'kapankah <text>']
handler.tags = ['kerang']
handler.command = /^kapan(kah)?$/i

module.exports = handler

function pickRandom(list) {
	return list[Math.floor(Math.random() * list.length)]
}
