// plugins/kerang-who.cjs
// Fitur: Pilih member acak untuk menjawab pertanyaan

var handler = async (m, {
	conn,
	command,
	text,
	participants
}) => {
	// Guard: pastikan di grup & ada participants
	if (!m.isGroup) return m.reply('Fitur ini hanya bisa digunakan di grup.')
	if (!participants || !participants.length) {
		return m.reply('Tidak ada member di grup ini.')
	}

	// Ambil semua JID member
	var member = participants.map(u => u.id).filter(Boolean)
	if (!member.length) return m.reply('Tidak ada member yang valid.')

	// Pilih acak
	var siapa = member[Math.floor(Math.random() * member.length)]

	// Ambil command pertama (kalau array)
	var cmd = Array.isArray(command) ? command[0] : command

	// Susun pertanyaan
	var pertanyaan = text ? `${cmd} ${text}` : cmd
	var jawab = `*Pertanyaan:* ${pertanyaan}?\n*@${siapa.split('@')[0]}*`

	await conn.reply(m.chat, jawab, m, {
		mentions: [siapa]
	})
}

handler.help = ['who <text>', 'siapa <text>']
handler.tags = ['kerang']
handler.command = /^(who|siapa)$/i
handler.group = true

module.exports = handler
