// plugins/group-listmember.cjs
// Fitur: Menampilkan daftar member grup (admin & member biasa)

var handler = async (m, {
	conn,
	isOwner,
	isAdmin,
	isBotAdmin
}) => {
	// Pastikan hanya di grup
	if (!m.isGroup) return m.reply('Fitur ini hanya bisa digunakan di grup.')

	// Ambil metadata grup
	var metadata = await conn.groupMetadata(m.chat)
	if (!metadata || !metadata.participants) {
		return m.reply('Gagal mengambil data grup.')
	}

	var participants = metadata.participants || []

	// Pisahkan admin dan member biasa
	var admins = participants.filter(v => v.admin === 'admin' || v.admin === 'superadmin')
	var members = participants.filter(v => !v.admin)

	// Format daftar admin
	var adminList = ''
	if (admins.length > 0) {
		adminList = admins.map((v, i) => {
			var jid = v.id || v.jid || ''
			var name = conn.getName(jid) || jid.split('@')[0]
			var role = v.admin === 'superadmin' ? '👑' : '⭐'
			return `${role} ${i + 1}. @${jid.split('@')[0]} ~ ${name}`
		}).join('\n')
	} else {
		adminList = '_Tidak ada admin_'
	}

	// Format daftar member biasa
	var memberList = ''
	if (members.length > 0) {
		memberList = members.map((v, i) => {
			var jid = v.id || v.jid || ''
			var name = conn.getName(jid) || jid.split('@')[0]
			return `👤 ${i + 1}. @${jid.split('@')[0]} ~ ${name}`
		}).join('\n')
	} else {
		memberList = '_Tidak ada member biasa_'
	}

	// Susun pesan
	var txt = `*📋 DAFTAR MEMBER AKTIF*\n\n` +
		`*• Subject:* ${metadata.subject || m.chat}\n` +
		`*• ID:* ${m.chat}\n` +
		`*• Total:* ${participants.length} member\n` +
		`*• Admin:* ${admins.length}\n` +
		`*• Member:* ${members.length}\n` +
		`*• isBotAdmin:* ${isBotAdmin}\n\n` +
		`*👑 ADMIN (${admins.length}):*\n${adminList}\n\n` +
		`*👤 MEMBER (${members.length}):*\n${memberList}\n\n` +
		`_Data diambil dari metadata grup saat ini._`

	// Mention semua member agar dapat notifikasi
	var mentions = participants.map(v => v.id || v.jid).filter(Boolean)

	await conn.sendMessage(m.chat, { text: txt, mentions }, { quoted: m })
}

handler.command = /^(listmember|memberaktif|listaktif)$/i
handler.help = ['listmember']
handler.tags = ['group']

module.exports = handler
