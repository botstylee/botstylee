const handler = async (m, { conn, text = '', participants = [] }) => {
	const quotedText = m.quoted?.text || m.quoted?.caption || ''
	const messageText = text.trim() || quotedText.trim()
	if (!messageText) throw 'Tulis teks pengumuman atau balas pesan yang ingin diumumkan.'

	const mentions = [...new Set(participants
		.map(participant => conn.decodeJid(participant.id))
		.filter(Boolean))]

	await conn.sendMessage(m.chat, {
		text: messageText,
		mentions
	}, { quoted: m })
}

handler.help = ['pengumuman <teks>', 'announce <teks>', 'hidetag <teks>']
handler.tags = ['group']
handler.command = /^(pengumuman|announce|hiddentag|hidetag)$/i
handler.group = true
handler.admin = true

module.exports = handler
