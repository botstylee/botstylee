const handler = async (m, { conn, usedPrefix = '.' }) => {
	conn.vote ||= {}
	const id = m.chat
	if (!(id in conn.vote)) {
		throw `*Tidak ada voting di grup ini.*\nGunakan *${usedPrefix}mulaivote* untuk memulai vote.`
	}

	delete conn.vote[id]
	await conn.sendMessage(m.chat, { text: 'Vote di grup ini telah dihapus.' }, { quoted: m })
}

handler.help = ['hapusvote']
handler.tags = ['vote']
handler.command = /^(delete|hapus)vote$/i
handler.group = true
handler.admin = true
module.exports = handler
