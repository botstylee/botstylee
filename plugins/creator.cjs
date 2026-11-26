var handler = async (m, {
	conn
}) => {
	// ✅ Pastikan global.owner ada
	if (!Array.isArray(global.owner) || !global.owner.length) {
		return conn.reply(m.chat, 'Owner belum diatur.', m)
	}

	// ✅ Ambil owner yang valid
	// Struktur umum: [id, isCreator, name] atau [id, name]
	var data = global.owner
		.filter(v => Array.isArray(v) && v[0])
		.map(v => {
			// ✅ Format [id, isCreator, name] → [id, name]
			// ✅ Format [id, name] → [id, name]
			var id = String(v[0]).replace(/[^0-9]/g, '')
			var name = typeof v[2] === 'string' ? v[2] : (typeof v[1] === 'string' ? v[1] : 'Owner')
			return [id, name]
		})
		.filter(([id]) => id)

	if (!data.length) {
		return conn.reply(m.chat, 'Owner belum diatur.', m)
	}

	try {
		await conn.sendContact(m.chat, data, m)
	} catch (e) {
		console.error('[owner] Error:', e)
		await conn.reply(m.chat, 'Gagal mengirim kontak owner: ' + (e.message || e), m)
	}
}

handler.help = ['owner', 'creator']
handler.tags = ['info']
handler.command = /^(owner|creator)$/i

module.exports = handler
