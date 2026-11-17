const jidUser = jid => typeof jid === 'string' ? jid.split('@')[0].split(':')[0] : ''

const handler = async (m, { conn, participants = [] }) => {
	const mentioned = Array.isArray(m.mentionedJid) ? m.mentionedJid : []
	const targets = [...new Set(mentioned.filter(jid => jid && jid.endsWith('@s.whatsapp.net')))]
	const botJid = conn.decodeJid ? conn.decodeJid(conn.user.id) : conn.user.id
	const botUser = jidUser(botJid)

	if (!targets.length) {
		return m.reply('Tag anggota yang ingin diturunkan dari admin.')
	}

	const results = []
	for (const target of targets) {
		if (jidUser(target) === botUser) {
			results.push(`@${jidUser(target)} tidak dapat diturunkan oleh perintah ini.`)
			continue
		}

		const participant = participants.find(item => jidUser(item.id) === jidUser(target))
		if (!participant) {
			results.push(`@${jidUser(target)} bukan anggota grup ini.`)
			continue
		}
		if (!participant.admin) {
			results.push(`@${jidUser(target)} bukan admin.`)
			continue
		}

		try {
			await conn.groupParticipantsUpdate(m.chat, [participant.id], 'demote')
			results.push(`@${jidUser(target)} berhasil diturunkan dari admin.`)
		} catch (error) {
			console.error('Gagal menurunkan admin:', error)
			results.push(`Gagal menurunkan @${jidUser(target)} dari admin.`)
		}
	}

	return conn.reply(m.chat, results.join('\n'), m, {
		mentions: targets
	})
}

handler.help = ['demote @tag']
handler.tags = ['group']
handler.command = /^(demote)$/i
handler.admin = true
handler.group = true
handler.botAdmin = true

module.exports = handler
