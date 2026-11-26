var handler = async (m, {
	conn
}) => {
	if (!m.quoted) {
		return conn.reply(m.chat, `Reply pesan bot yang mau dihapus dengan command *${usedPrefix || '.'}del*`, m)
	}

	var {
		chat,
		fromMe,
		isBaileys
	} = m.quoted

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
		console.error('[delete] Error:', e)
		await conn.reply(m.chat, 'Gagal menghapus pesan: ' + (e.message || e), m)
	}
}

handler.help = ['del (reply)', 'delete (reply)']
handler.tags = ['tools']
handler.command = /^del(ete)?$/i

module.exports = handler
