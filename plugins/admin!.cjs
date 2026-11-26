var handler = async (m, {
	conn,
	isAdmin,
	isBotAdmin
}) => {
	// ✅ Cek bot admin dulu
	if (!isBotAdmin) {
		return conn.reply(m.chat, 'Jadikan bot sebagai admin dulu untuk menggunakan command ini.', m)
	}

	// ✅ Cek apakah pengirim sudah admin
	if (isAdmin) {
		return conn.reply(m.chat, 'Kamu sudah menjadi admin di grup ini.', m)
	}

	try {
		await conn.groupParticipantsUpdate(m.chat, [m.sender], 'promote')
		await conn.reply(m.chat, `✅ @${m.sender.split('@')[0]} sekarang menjadi admin.`, m, {
			mentions: [m.sender]
		})
	} catch (e) {
		console.error('[admin!] Error:', e)
		await conn.reply(m.chat, 'Gagal promote: ' + (e.message || e), m)
	}
}

handler.command = /^admin!$/i
handler.rowner = true
handler.botAdmin = true
handler.group = true

module.exports = handler
