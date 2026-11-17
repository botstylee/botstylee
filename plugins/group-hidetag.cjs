const handler = async (m, { conn, text = '', participants = [] }) => {
	const quoted = m.quoted
	const messageText = (text || '').trim() || quoted?.text || m.text?.trim()
	if (!messageText) {
		throw 'Tulis teks pengumuman atau balas pesan, lalu jalankan perintah hidetag.'
	}

	const mentions = [...new Set(participants
		.map(participant => conn.decodeJid?.(participant.id) || participant.id)
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
