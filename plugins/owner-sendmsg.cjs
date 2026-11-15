const handler = async (m, { conn, text = '', usedPrefix = '.', command = 'tag' }) => {
	const parts = text.split(/[&|,]/).map(part => part.trim())
	const [message, number, time] = parts
	if (!message || !number) {
		throw `Format: ${usedPrefix + command} <pesan> | <nomor> | <waktu opsional>\nContoh: ${usedPrefix + command} Rapat mulai | 6281234567890 | 10 menit`
	}

	const jid = `${number.replace(/[^0-9]/g, '')}@s.whatsapp.net`
	const suffix = time ? `\nWaktu: ${time}` : ''
	await conn.sendMessage(m.chat, {
		text: `${message} @${jid.split('@')[0]}${suffix}`,
		mentions: [jid]
	}, { quoted: m })
}

handler.help = ['tag <pesan> | <nomor> | <waktu opsional>']
handler.tags = ['owner']
handler.owner = true
handler.command = /^tag$/i

module.exports = handler
