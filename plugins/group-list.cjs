const decode = jid => typeof jid === 'string' ? (conn.decodeJid?.(jid) || jid) : ''

const handler = async (m, { conn, isOwner }) => {
	try {
		if (typeof conn.groupFetchAllParticipating !== 'function') {
			return m.reply('*Fitur daftar grup tidak tersedia di koneksi ini.*')
		}

		const result = await conn.groupFetchAllParticipating()
		const groups = Object.values(result || {})
		if (!groups.length) return m.reply('*Bot belum bergabung ke grup mana pun.*')

		let txt = `*DAFTAR GRUP*\n\n*Total:* ${groups.length}\n\n`
		const botJid = decode(conn.user?.jid || conn.user?.id || '')

		for (const group of groups) {
			if (!group?.id) continue
			const chat = db.data?.chats?.[group.id] || {}
			const members = Array.isArray(group.participants) ? group.participants : []
			const botParticipant = members.find(participant => decode(participant?.id) === botJid)
			const expiry = Number(chat.expired)
			const expiryText = chat.grouprental && Number.isFinite(expiry) && expiry > 0
				? `*• Sewa berakhir:* ${expiry <= Date.now() ? 'Kedaluwarsa' : formatDuration(expiry - Date.now())}\n`
				: ''

			txt += `*• Nama:* ${group.subject || '(tanpa nama)'}\n` +
				`*• ID:* ${group.id}\n` +
				`${isOwner ? `*• Anggota:* ${members.length}\n*• Bot admin:* ${Boolean(botParticipant?.admin)}\n` : ''}` +
				expiryText + '\n'
		}

		return m.reply(txt.trim())
	} catch (error) {
		console.error('Gagal mengambil daftar grup:', error)
		return m.reply('*Gagal mengambil daftar grup. Periksa koneksi WhatsApp lalu coba lagi.*')
	}
}

function formatDuration(milliseconds) {
	const remaining = Math.max(0, Number(milliseconds) || 0)
	const days = Math.floor(remaining / 86400000)
	const hours = Math.floor((remaining % 86400000) / 3600000)
	const minutes = Math.floor((remaining % 3600000) / 60000)
	return `${days} hari ${hours} jam ${minutes} menit`
}

handler.command = /^list(gc|gro?up)$/i
handler.help = ['listgroup']
handler.tags = ['info']

module.exports = handler
