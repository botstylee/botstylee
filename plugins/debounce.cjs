var handler = async (m, {
	conn
}) => {
	// ✅ Pastikan global.conn ada
	if (!global.conn?.user?.jid) {
		return conn.reply(m.chat, 'Bot belum siap, coba lagi nanti.', m)
	}

	// ✅ Hanya bisa dijalankan di koneksi utama
	if (global.conn.user.jid !== conn.user.jid) {
		return conn.reply(m.chat, '_eeeeeiiittsssss..._', m)
	}

	await conn.reply(m.chat, '🔄 Mereset bot...', m)

	// ✅ Beri waktu pesan terkirim sebelum exit
	await new Promise(r => setTimeout(r, 1500))

	// ✅ Coba kirim sinyal reset ke parent process (kalau ada)
	try {
		if (typeof process.send === 'function') {
			process.send('reset')
		}
	} catch (e) {
		console.error('[debounce] Gagal kirim sinyal reset:', e)
	}

	// ✅ Exit proses
	process.exit(0)
}

handler.help = ['debounce']
handler.tags = ['host']
handler.command = /^(debounce|refresh|r|refreshing|reload)$/i
handler.owner = true

module.exports = handler
