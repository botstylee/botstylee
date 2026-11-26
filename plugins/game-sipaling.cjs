var handler = async (m, {
	conn,
	text,
	participants,
	usedPrefix
}) => {
	if (!text) {
		return conn.reply(m.chat, `Contoh:\n${usedPrefix}sipaling cantik`, m)
	}

	// ✅ Validasi participants
	if (!Array.isArray(participants) || !participants.length) {
		return conn.reply(m.chat, 'Tidak ada peserta di grup ini.', m)
	}

	var member = participants.map(u => u.id).filter(Boolean)
	if (!member.length) {
		return conn.reply(m.chat, 'Tidak ada peserta di grup ini.', m)
	}

	var cakep = member[Math.floor(Math.random() * member.length)]

	// ✅ Ambil nomor dari JID dengan benar
	var nomor = cakep.split('@')[0]
	var jawab = `Sipaling ${text} disini adalah @${nomor}`.trim()

	await conn.reply(m.chat, jawab, m, {
		mentions: [cakep]
	})
}

handler.help = ['sipaling *teks*']
handler.tags = ['game']
handler.command = /^(sipaling)$/i
handler.group = true

module.exports = handler
