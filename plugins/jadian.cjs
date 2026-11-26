// plugins/fun-jodoh.cjs
// Fitur: Jodohin diri sendiri atau orang acak dengan member grup

var handler = async (m, {
	conn,
	participants,
	command,
	usedPrefix
}) => {
	// Guard: harus di grup
	if (!m.isGroup) return m.reply('Fitur ini hanya bisa digunakan di grup.')

	// Guard: participants harus ada
	if (!participants || !participants.length) {
		return m.reply('Tidak ada member di grup ini.')
	}

	// Ambil semua JID member
	var member = participants.map(u => u.id).filter(Boolean)
	if (!member.length) return m.reply('Tidak ada member yang valid.')

	// Tentukan orang
	var cmd = Array.isArray(command) ? command[0] : command
	var orang
	if (/ku/i.test(cmd)) {
		orang = m.sender
	} else {
		orang = member[Math.floor(Math.random() * member.length)]
	}

	// Tentukan jodoh (beda dari orang)
	var jodoh
	var maxTry = 10
	do {
		jodoh = member[Math.floor(Math.random() * member.length)]
		maxTry--
	} while (jodoh === orang && maxTry > 0)

	// Kalau grup cuma 1 orang, jodoh = orang
	if (!jodoh) jodoh = orang

	// Susun jawaban
	var jawab = `@${orang.split('@')[0]} ❤️ @${jodoh.split('@')[0]}`

	await conn.sendMessage(m.chat, {
		text: jawab,
		mentions: [orang, jodoh]
	}, { quoted: m })
}

handler.help = ['jodohin', 'jodohku']
handler.tags = ['fun']
handler.command = /^(jodoh(in|ku)|jadian)$/i
handler.group = true

module.exports = handler
