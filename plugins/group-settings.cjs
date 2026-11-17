const handler = async (m, { conn, args = [], usedPrefix, command }) => {
	const option = typeof args[0] === 'string' ? args[0].trim().toLowerCase() : ''
	const setting = { open: 'not_announcement', close: 'announcement' }[option]

	if (!setting) {
		return conn.reply(m.chat, `*Format salah! Contoh:*\n○ ${usedPrefix + command} close\n○ ${usedPrefix + command} open`, m)
	}

	try {
		await conn.groupSettingUpdate(m.chat, setting)
		return conn.reply(m.chat, option === 'open' ? '*Grup berhasil dibuka; semua anggota dapat mengirim pesan.*' : '*Grup berhasil ditutup; hanya admin yang dapat mengirim pesan.*', m)
	} catch (error) {
		console.error('Gagal mengubah pengaturan grup:', error)
		return conn.reply(m.chat, '*Pengaturan grup gagal diubah. Pastikan bot admin dan coba lagi.*', m)
	}
}

handler.help = ['group open/close']
handler.tags = ['group']
handler.command = /^(group)$/i
handler.group = true
handler.admin = true
handler.botAdmin = true

module.exports = handler
