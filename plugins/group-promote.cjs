const jidUser = jid => typeof jid === 'string' ? jid.split('@')[0].split(':')[0] : ''
const normalizeJid = (conn, jid) => {
	if (typeof jid !== 'string') return ''
	try {
		return conn.decodeJid?.(jid) || jid
	} catch {
		return jid
	}
}
const isAdmin = participant => participant?.admin === 'admin' || participant?.admin === 'superadmin'

const handler = async (m, { conn, participants = [] }) => {
	const targets = [...new Set((Array.isArray(m.mentionedJid) ? m.mentionedJid : [])
		.map(jid => normalizeJid(conn, jid))
		.filter(jid => jid.endsWith('@s.whatsapp.net') || jid.endsWith('@lid')))]

	if (!targets.length) return m.reply('Tag atau balas pesan anggota yang ingin dijadikan admin.')

	const botJid = normalizeJid(conn, conn.user?.jid || conn.user?.id || '')
	const botUser = jidUser(botJid)
	const results = []
	const mentions = []

	for (const target of targets) {
		const participant = participants.find(item => jidUser(normalizeJid(conn, item?.id)) === jidUser(target))
		const displayJid = participant?.id || target
		mentions.push(displayJid)

		if (jidUser(target) === botUser) {
			results.push(`@${jidUser(displayJid)} adalah akun bot dan tidak diproses.`)
			continue
		}
		if (!participant) {
			results.push(`@${jidUser(displayJid)} bukan anggota grup ini.`)
			continue
		}
		if (isAdmin(participant)) {
			results.push(`@${jidUser(displayJid)} sudah menjadi admin.`)
			continue
		}

		try {
			const response = await conn.groupParticipantsUpdate(m.chat, [participant.id], 'promote')
			const item = Array.isArray(response) ? response[0] : null
			if (item?.status && !['200', 200].includes(item.status)) {
				results.push(`Promosi @${jidUser(displayJid)} gagal (status ${item.status}).`)
			} else {
				results.push(`@${jidUser(displayJid)} berhasil dijadikan admin.`)
			}
		} catch (error) {
			conn.logger?.error?.({ err: error, group: m.chat, target: participant.id }, 'Gagal mempromosikan anggota')
			results.push(`Gagal menjadikan @${jidUser(displayJid)} admin.`)
		}
	}

	return conn.reply(m.chat, results.join('\n'), m, { mentions: [...new Set(mentions)] })
}

handler.help = ['promote @tag']
handler.tags = ['group']
handler.command = /^(promote)$/i
handler.admin = true
handler.group = true
handler.botAdmin = true

module.exports = handler
