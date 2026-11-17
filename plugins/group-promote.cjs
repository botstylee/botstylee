const jidUser = jid => typeof jid === 'string' ? jid.split('@')[0].split(':')[0] : ''

const handler = async (m, { conn, participants = [] }) => {
	const mentioned = Array.isArray(m.mentionedJid) ? m.mentionedJid : []
	const targets = [...new Set(mentioned.filter(jid => jid && jid.endsWith('@s.whatsapp.net')))]
	const botJid = conn.decodeJid ? conn.decodeJid(conn.user.id) : conn.user.id
	const botUser = jidUser(botJid)

	if (!targets.length) {
		return m.reply('Tag anggota yang ingin dijadikan admin.')
	}

	const results = []
	for (const target of targets) {
		if (jidUser(target) === botUser) {
			results.push(`@${jidUser(target)} adalah akun bot; tidak dapat dipromosikan lewat perintah ini.`)
			continue
		}

		const participant = participants.find(item => jidUser(item.id) === jidUser(target))
		if (!participant) {
			results.push(`@${jidUser(target)} bukan anggota grup ini.`)
			continue
		}
		if (participant.admin) {
			results.push(`@${jidUser(target)} sudah menjadi admin.`)
			continue
		}

		try {
			await conn.groupParticipantsUpdate(m.chat, [participant.id], 'promote')
			results.push(`@${jidUser(target)} berhasil dijadikan admin.`)
		} catch (error) {
			console.error('Gagal mempromosikan admin:', error)
			results.push(`Gagal menjadikan @${jidUser(target)} admin.`)
		}
	}

	return conn.reply(m.chat, results.join('\n'), m, {
		mentions: targets
	})
}

handler.help = ['promote @tag']
handler.tags = ['group']
handler.command = /^(promote)$/i
handler.admin = true
handler.group = true
handler.botAdmin = true

module.exports = handler
