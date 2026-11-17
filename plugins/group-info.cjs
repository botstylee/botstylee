const formatDuration = milliseconds => {
	const remaining = Math.max(0, Number(milliseconds) || 0)
	const days = Math.floor(remaining / 86400000)
	const hours = Math.floor((remaining % 86400000) / 3600000)
	const minutes = Math.floor((remaining % 3600000) / 60000)
	return `${days} hari ${hours} jam ${minutes} menit`
}

const jidUser = jid => typeof jid === 'string' ? jid.split('@')[0].split(':')[0] : ''
const normalizeJid = (conn, jid) => {
	if (typeof jid !== 'string') return ''
	try {
		return conn.decodeJid?.(jid) || jid
	} catch {
		return jid
	}
}

const handler = async (m, { conn, participants = [], groupMetadata = {} }) => {
	const chat = db.data?.chats?.[m.chat] || {}
	const members = Array.isArray(participants) ? participants.filter(Boolean) : []
	const admins = members.filter(participant => participant.admin && participant.id)
	const owner = groupMetadata.owner || admins.find(participant => participant.admin === 'superadmin')?.id
	const adminLines = admins.length
		? admins.map((admin, index) => `${index + 1}. @${jidUser(admin.id)}`).join('\n')
		: 'Tidak ada admin yang terdeteksi'
	const expiry = Number(chat.expired) || 0
	const rentalText = chat.grouprental && expiry > 0
		? `*Sewa grup:* ${expiry > Date.now() ? formatDuration(expiry - Date.now()) : 'Kedaluwarsa'}`
		: null

	const text = [
		'*「 Informasi Grup 」*',
		`*ID:* ${groupMetadata.id || m.chat}`,
		`*Nama:* ${groupMetadata.subject || 'Tidak diketahui'}`,
		`*Deskripsi:* ${groupMetadata.desc?.toString() || 'Tidak ada deskripsi'}`,
		`*Jumlah anggota:* ${members.length}`,
		`*Pemilik grup:* ${owner ? `@${jidUser(owner)}` : 'Tidak diketahui'}`,
		'*Admin grup:*',
		adminLines,
		'',
		'*Pengaturan:*',
		`${chat.isBanned ? '✅' : '❌'} Bot diblokir di grup`,
		`${chat.welcome ? '✅' : '❌'} Pesan selamat datang`,
		`${chat.antiLink ? '✅' : '❌'} Anti-link`,
		`${chat.antiToxic ? '✅' : '❌'} Filter kata kasar`,
		`${chat.antiSWGroup ? '✅' : '❌'} Anti-Group Status`,
		rentalText
	].filter(Boolean).join('\n')

	const mentions = [...new Set([...admins.map(admin => admin.id), ...(owner ? [owner] : [])].map(jid => normalizeJid(conn, jid)).filter(Boolean))]
	return conn.sendMessage(m.chat, { text, mentions }, { quoted: m })
}

handler.help = ['infogrup']
handler.tags = ['group']
handler.command = /^(gro?upinfo|info(gro?up|gc))$/i
handler.group = true

module.exports = handler
