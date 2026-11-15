const handler = async (m, { conn, usedPrefix = '.' }) => {
	conn.vote ||= {}
	const id = m.chat
	if (!(id in conn.vote)) {
		throw `*Tidak ada voting di grup ini.*\nGunakan *${usedPrefix}mulaivote* untuk memulai vote.`
	}

	const [reason, upvote = [], devote = []] = conn.vote[id]
	const result = [
		'*「 VOTE 」*',
		'',
		`*Alasan:* ${reason || 'Tidak ada alasan'}`,
		'',
		`*UPVOTE:* ${upvote.length}`,
		`*DEVOTE:* ${devote.length}`,
		'',
		`*Total peserta:* ${upvote.length + devote.length}`,
		'',
		`Gunakan *${usedPrefix}hapusvote* untuk menghapus vote.`
	].join('\n')

	await conn.sendMessage(m.chat, { text: result }, { quoted: m })
}

handler.help = ['cekvote']
handler.tags = ['vote']
handler.command = /^cekvote$/i
handler.group = true
module.exports = handler
