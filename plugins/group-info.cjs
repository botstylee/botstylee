const formatDuration = milliseconds => {
	const remaining = Math.max(0, Number(milliseconds) || 0)
	const days = Math.floor(remaining / 86400000)
	const hours = Math.floor((remaining % 86400000) / 3600000)
	const minutes = Math.floor((remaining % 3600000) / 60000)
	return `${days} hari ${hours} jam ${minutes} menit`
}

const handler = async (m, { conn, participants = [], groupMetadata = {} }) => {
	const chat = db.data?.chats?.[m.chat] || {}
	const admins = participants.filter(participant => participant.admin)
	const owner = groupMetadata.owner || admins.find(participant => participant.admin === 'superadmin')?.id
	const ownerText = owner ? `@${owner.split('@')[0]}` : 'Tidak diketahui'
	const adminLines = admins.length
		? admins.map((admin, index) => `${index + 1}. @${admin.id.split('@')[0]}`).join('\n')
		: 'Tidak ada admin yang terdeteksi'
	const rentalExpiry = Number(chat.expired) || 0
	const rentalText = chat.grouprental && rentalExpiry
		? `\n*Sewa grup:* ${rentalExpiry > Date.now() ? formatDuration(rentalExpiry - Date.now()) : 'Kedaluwarsa'}`
		: ''

	const text = [
		'*「 Informasi Grup 」*',
		`*ID:* ${groupMetadata.id || m.chat}`,
		`*Nama:* ${groupMetadata.subject || 'Tidak diketahui'}`,
		`*Deskripsi:* ${groupMetadata.desc?.toString() || 'Tidak ada deskripsi'}`,
		`*Jumlah anggota:* ${participants.length}`,
		`*Pemilik grup:* ${ownerText}`,
		'*Admin grup:*',
		adminLines,
		'',
		'*Pengaturan:*',
		`${chat.isBanned ? '✅' : '❌'} Bot diblokir di grup`,
		`${chat.welcome ? '✅' : '❌'} Pesan selamat datang`,
		`${chat.antiLink ? '✅' : '❌'} Anti-link`,
		rentalText
	].filter(Boolean).join('\n')

	const mentions = [...admins.map(admin => admin.id), ...(owner ? [owner] : [])]
	await conn.sendMessage(m.chat, { text, mentions }, { quoted: m })
}

handler.help = ['infogrup']
handler.tags = ['group']
handler.command = /^(gro?upinfo|info(gro?up|gc))$/i
handler.group = true
module.exports = handler
