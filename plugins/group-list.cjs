const handler = async (m, { conn, isOwner }) => {
	try {
		const groups = Object.values(await conn.groupFetchAllParticipating?.() || {})
		let txt = `*GROUPS LIST*\n\n*Total:* ${groups.length}\n\n`

		for (let i = 0; i < groups.length; i++) {
			const group = groups[i]
			const chat = db.data?.chats?.[group.id] || {}
			const botParticipant = group.participants?.find(v => (v.id || '').endsWith('@s.whatsapp.net') && v.id === conn.user.jid)
			const isBotAdmin = !!(botParticipant && botParticipant.admin)
			const groupExpired = chat.grouprental && Number.isFinite(chat.expired) ? chat.expired : 0
			const remaining = groupExpired > 0 ? await msToDate(groupExpired - Date.now()) : null

			txt += `*• Subject:* ${group.subject || '-'}\n` +
				`*• ID:* ${group.id}\n` +
				`${isOwner ? `*• Participants:* ${group.participants?.length || 0}\n` : ''}` +
				`${isOwner ? `*• isBotAdmin:* ${isBotAdmin}\n` : ''}` +
				`${remaining ? `*• Expired:* ${remaining}\n` : ''}\n`
		}
		return m.reply(txt.trim())
	} catch (error) {
		console.error('Failed to fetch group list:', error)
		return m.reply('*Gagal mengambil daftar grup.*')
	}
}

handler.command = /^list(gc|gro?up)$/i
handler.help = ['listgroup']
handler.tags = ['info']

function msToDate(ms) {
	const safeMs = Math.max(0, Number(ms) || 0)
	const days = Math.floor(safeMs / (24 * 60 * 60 * 1000))
	const daysMs = safeMs % (24 * 60 * 60 * 1000)
	const hours = Math.floor(daysMs / (60 * 60 * 1000))
	const hoursMs = safeMs % (60 * 60 * 1000)
	const minutes = Math.floor(hoursMs / (60 * 1000))
	return `${days} Hari ${hours} Jam ${minutes} Menit`
}

module.exports = handler
