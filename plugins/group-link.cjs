const handler = async (m, { conn, args = [] }) => {
	const group = (/^[0-9]{5,16}-?[0-9]+@g\.us$/.test(args[0] || '') ? args[0] : m.chat)
	if (!group?.endsWith('@g.us')) throw 'Perintah ini hanya bisa digunakan di grup.'

	try {
		const metadata = await conn.groupMetadata(group)
		if (!metadata?.participants) throw 'Metadata grup tidak tersedia.'

		const botJid = conn.decodeJid(conn.user?.jid || conn.user?.id || '')
		const botParticipant = metadata.participants.find(participant => conn.decodeJid(participant.id) === botJid)
		if (!botParticipant) throw 'Bot tidak ditemukan di grup tersebut.'
		if (botParticipant.admin !== 'admin' && botParticipant.admin !== 'superadmin') {
			throw 'Bot harus menjadi admin grup untuk mengambil tautan undangan.'
		}

		const inviteCode = await conn.groupInviteCode(group)
		await m.reply(`https://chat.whatsapp.com/${inviteCode}`)
	} catch (error) {
		console.error('Failed to get group link:', error)
		throw error instanceof Error ? error.message : 'Gagal mengambil tautan grup.'
	}
}

handler.help = ['linkgroup']
handler.tags = ['group']
handler.command = /^link(gro?up)?$/i
handler.group = true
handler.botAdmin = true

module.exports = handler
