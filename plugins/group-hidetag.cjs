const handler = async (m, { conn, text = '', participants = [] }) => {
	const quotedText = typeof m.quoted?.text === 'string' ? m.quoted.text.trim() : ''
	const messageText = (typeof text === 'string' ? text.trim() : '') || quotedText
	if (!messageText) {
		throw 'Tulis teks pengumuman atau balas pesan yang ingin diteruskan dengan hidetag.'
	}

	const members = Array.isArray(participants) ? participants : []
	const mentions = [...new Set(members
		.map(participant => {
			const jid = participant?.id
			if (typeof jid !== 'string') return ''
			try {
				return conn.decodeJid?.(jid) || jid
			} catch {
				return jid
			}
		})
		.filter(jid => typeof jid === 'string' && jid.includes('@')))]

	return conn.sendMessage(m.chat, { text: messageText, mentions }, { quoted: m })
}

handler.help = ['pengumuman <teks>', 'announce <teks>', 'hidetag <teks>']
handler.tags = ['group']
handler.command = /^(pengumuman|announce|hiddentag|hidetag)$/i
handler.group = true
handler.admin = true

module.exports = handler
