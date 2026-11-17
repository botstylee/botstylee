const handler = async (m, { conn }) => {
	try {
		if (typeof conn.groupRevokeInvite !== 'function') throw new Error('Fitur rotasi tautan tidak tersedia.')
		const code = await conn.groupRevokeInvite(m.chat)
		if (typeof code !== 'string' || !code.trim()) throw new Error('WhatsApp tidak mengembalikan kode undangan.')
		return conn.reply(m.chat, `*Tautan undangan grup sudah diperbarui:*\nhttps://chat.whatsapp.com/${code}`, m)
	} catch (error) {
		console.error('Gagal memperbarui tautan undangan grup:', error)
		return conn.reply(m.chat, '*Gagal memperbarui tautan grup. Pastikan bot masih menjadi admin lalu coba lagi.*', m)
	}
}

handler.help = ['revoke']
handler.tags = ['group']
handler.command = /^revoke$/i
handler.group = true
handler.admin = true
handler.botAdmin = true

module.exports = handler
