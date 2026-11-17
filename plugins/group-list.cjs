const formatDuration = milliseconds => {
	const remaining = Math.max(0, Number(milliseconds) || 0)
	const days = Math.floor(remaining / 86400000)
	const hours = Math.floor((remaining % 86400000) / 3600000)
	const minutes = Math.floor((remaining % 3600000) / 60000)
	return `${days} hari ${hours} jam ${minutes} menit`
}

const decodeJid = (conn, jid) => {
	if (typeof jid !== 'string') return ''
	try {
		return conn.decodeJid?.(jid) || jid
	} catch {
		return jid
	}
}

const handler = async (m, { conn, isOwner }) => {
	try {
		if (typeof conn.groupFetchAllParticipating !== 'function') {
			return m.reply('*Fitur daftar grup tidak tersedia di koneksi ini.*')
		}

		const result = await conn.groupFetchAllParticipating()
		const groups = Object.values(result || {}).filter(group => group?.id)
		if (!groups.length) return m.reply('*Bot belum bergabung ke grup mana pun.*')

		const botJid = decodeJid(conn, conn.user?.jid || conn.user?.id || '')
		const sections = groups.map(group => {
			const chat = db.data?.chats?.[group.id] || {}
			const members = Array.isArray(group.participants) ? group.participants : []
			const bot = members.find(participant => decodeJid(conn, participant?.id) === botJid)
			const expiry = Number(chat.expired)
			const rental = chat.grouprental && Number.isFinite(expiry) && expiry > 0
				? `\n*• Sewa berakhir:* ${expiry <= Date.now() ? 'Kedaluwarsa' : formatDuration(expiry - Date.now())}`
				: ''
			return `*• Nama:* ${group.subject || '(tanpa nama)'}\n*• ID:* ${group.id}` +
				`${isOwner ? `\n*• Anggota:* ${members.length}\n*• Bot admin:* ${Boolean(bot?.admin)}` : ''}${rental}`
		})

		// Avoid oversized WhatsApp payloads; output in multiple messages when necessary.
		const header = `*DAFTAR GRUP*\n*Total:* ${groups.length}\n\n`
		const chunks = []
		let chunk = header
		for (const section of sections) {
			const next = `${section}\n\n`
			if (chunk.length + next.length > 3500 && chunk !== header) {
				chunks.push(chunk.trim())
				chunk = header + next
			} else {
				chunk += next
			}
		}
		if (chunk.trim()) chunks.push(chunk.trim())
		for (const part of chunks) await m.reply(part)
	} catch (error) {
		conn.logger?.error?.({ err: error }, 'Gagal mengambil daftar grup')
		return m.reply('*Gagal mengambil daftar grup. Periksa koneksi WhatsApp lalu coba lagi.*')
	}
}

handler.command = /^list(gc|gro?up)$/i
handler.help = ['listgroup']
handler.tags = ['info']
handler.owner = true

module.exports = handler
