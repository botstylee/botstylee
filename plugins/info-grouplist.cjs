let handler = async (m, { conn, isOwner }) => {
	try {
		let groups = Object.values(await conn.groupFetchAllParticipating())

		if (!groups.length) {
			return conn.reply(m.chat, '*GROUPS LIST*\n\nBot tidak tergabung di grup mana pun.', m)
		}

		let txt = `*GROUPS LIST*\n\n*Total:* ${groups.length}\n\n`

		for (let i = 0; i < groups.length; i++) {
			let g = groups[i]
			let botParticipant = g.participants?.find(v => v.id === conn.user?.jid)
			let isBotAdmin = !!botParticipant?.admin

			txt += `*• Subject:* ${g.subject}\n`
				+ `*• ID:* ${g.id}\n`
				+ (isOwner ? `*• Participants:* ${g.participants?.length || 0}\n` : '')
				+ (isOwner ? `*• isBotAdmin:* ${isBotAdmin}\n` : '')
				+ `\n`
		}

		await conn.reply(m.chat, txt.trim(), m)
	} catch (e) {
		console.error('[listgroup] Error:', e)
		await conn.reply(m.chat, 'Gagal mengambil daftar grup: ' + (e.message || e), m)
	}
}

handler.command = /^list(gc|gro?up)$/i
handler.help = ['listgroup']
handler.tags = ['info']

module.exports = handler
