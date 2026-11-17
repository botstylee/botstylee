const handler = async (m, { conn }) => {
	try {
		const code = await conn.groupRevokeInvite(m.chat)
		return conn.reply(m.chat, `*Link grup baru:* https://chat.whatsapp.com/${code}`, m)
	} catch (error) {
		console.error('Failed to revoke invite:', error)
		return conn.reply(m.chat, '*Gagal memperbarui link grup.*', m)
	}
}

handler.help = ['revoke']
handler.tags = ['group']
handler.command = /^revoke$/i
handler.group = true
handler.botAdmin = true
handler.admin = true

module.exports = handler
