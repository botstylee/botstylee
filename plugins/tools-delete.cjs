var handler = async (m, {
	conn,
	isBotAdmin
}) => {
	if (!m.quoted) {
		return conn.reply(m.chat, 'Reply pesan yang mau dihapus dengan command *.del*', m)
	}

	var {
		id,
		chat,
		sender,
		fromMe,
		isBaileys
	} = m.quoted

	// ✅ Jika di grup dan bot admin → bisa hapus pesan siapa saja
	if (m.isGroup && isBotAdmin) {
		try {
			await conn.sendMessage(chat, {
				delete: {
					remoteJid: m.chat,
					id,
					participant: sender
				}
			})
		} catch (e) {
			console.error('[delete] Error (grup):', e)
			await conn.reply(m.chat, 'Gagal menghapus pesan: ' + (e.message || e), m)
		}
		return
	}

	// ✅ Selain itu → hanya bisa hapus pesan bot sendiri
	if (!fromMe) {
		return conn.reply(m.chat, 'Pesan tersebut bukan dikirim oleh bot!', m)
	}
	if (!isBaileys) {
		return conn.reply(m.chat, 'Pesan tersebut bukan dikirim oleh bot!', m)
	}

	try {
		await conn.sendMessage(chat, {
			delete: m.quoted.vM.key
		})
	} catch (e) {
		console.error('[delete] Error (pribadi):', e)
		await conn.reply(m.chat, 'Gagal menghapus pesan: ' + (e.message || e), m)
	}
}

handler.help = ['del (reply)', 'delete (reply)']
handler.tags = ['tools']
handler.command = /^del(ete)?$/i

module.exports = handler
