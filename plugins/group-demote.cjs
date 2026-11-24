const jidUser = jid => (typeof jid === 'string' ? jid.split('@')[0].split(':')[0] : '')

const normalizeJid = (conn, jid) => {
	if (typeof jid !== 'string') return ''
	try {
		return conn.decodeJid?.(jid) || jid
	} catch {
		return jid
	}
}

const isAdmin = participant =>
	participant?.admin === 'admin' || participant?.admin === 'superadmin'

const handler = async (m, { conn, participants = [] }) => {
	// 1. Validasi: harus ada yang di-tag
	const targets = [
		...new Set(
			(Array.isArray(m.mentionedJid) ? m.mentionedJid : [])
				.map(jid => normalizeJid(conn, jid))
				.filter(jid => jid.endsWith('@s.whatsapp.net') || jid.endsWith('@lid'))
		)
	]

	if (!targets.length) {
		return m.reply(
			`*Format salah!*\n\nTag admin yang ingin diturunkan.\n\nContoh:\n*.demote @admin*`
		)
	}

	const botJid = normalizeJid(conn, conn.user?.jid || conn.user?.id || '')
	const botUser = jidUser(botJid)

	// 2. Cek bot admin
	const botParticipant = participants.find(
		item => jidUser(normalizeJid(conn, item?.id)) === botUser
	)
	if (!isAdmin(botParticipant)) {
		return m.reply('*Bot bukan admin!* Jadikan bot admin terlebih dahulu.')
	}

	const results = []
	const mentions = []

	for (const target of targets) {
		const participant = participants.find(
			item => jidUser(normalizeJid(conn, item?.id)) === jidUser(target)
		)
		const displayJid = participant?.id || target
		mentions.push(displayJid)

		// 3. Cek target = bot sendiri
		if (jidUser(target) === botUser) {
			results.push(`@${jidUser(displayJid)} adalah akun bot dan tidak diproses.`)
			continue
		}

		// 4. Cek target anggota grup
		if (!participant) {
			results.push(`@${jidUser(displayJid)} bukan anggota grup ini.`)
			continue
		}

		// 5. Cek target admin
		if (!isAdmin(participant)) {
			results.push(`@${jidUser(displayJid)} bukan admin.`)
			continue
		}

		// 6. Proses demote
		try {
			// Gunakan JID utama (bukan @lid) untuk groupParticipantsUpdate
			const targetJid = participant.id.endsWith('@lid')
				? participant.phoneNumber || participant.id
				: participant.id

			const response = await conn.groupParticipantsUpdate(m.chat, [targetJid], 'demote')
			const item = Array.isArray(response) ? response[0] : null

			if (item?.status && !['200', 200].includes(item.status)) {
				results.push(
					`Penurunan admin @${jidUser(displayJid)} gagal (status ${item.status}).`
				)
			} else {
				results.push(`@${jidUser(displayJid)} berhasil diturunkan dari admin.`)
			}
		} catch (error) {
			// Log aman (tidak semua bot punya conn.logger)
			console.error('[demote]', error)
			results.push(`Gagal menurunkan @${jidUser(displayJid)} dari admin.`)
		}
	}

	return conn.reply(m.chat, results.join('\n'), m, { mentions: [...new Set(mentions)] })
}

handler.help = ['demote @tag']
handler.tags = ['group']
handler.command = /^(demote)$/i
handler.admin = true
handler.group = true
handler.botAdmin = true

module.exports = handler
