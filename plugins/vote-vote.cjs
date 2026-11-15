const handler = async (m, { conn, usedPrefix = '.', text = '' }) => {
	conn.vote ||= {}
	const id = m.chat
	if (!(id in conn.vote)) {
		throw `*Tidak ada voting di grup ini.*\nGunakan *${usedPrefix}mulaivote* untuk memulai vote.`
	}

	const [reason, upvote = [], devote = []] = conn.vote[id]
	const isVote = [...upvote, ...devote].includes(m.sender)
	if (isVote) throw 'Kamu sudah ikut voting di grup ini.'

	const voteType = /^(up|ya|setuju)$/i.test(text || m.text || '') ? 'upvote' : /^(de|tidak|tolak)$/i.test(text || m.text || '') ? 'devote' : null
	if (!voteType) {
		throw `Gunakan perintah ${usedPrefix}upvote atau ${usedPrefix}devote.`
	}

	if (voteType === 'upvote') upvote.push(m.sender)
	else devote.push(m.sender)

	const summary = [
		'*「 VOTE 」*',
		'',
		`*Alasan:* ${reason || 'Tidak ada alasan'}`,
		'',
		`*UPVOTE:* ${upvote.length}`,
		`*DEVOTE:* ${devote.length}`,
		'',
		`Gunakan *${usedPrefix}cekvote* untuk melihat hasil.`
	].join('\n')

	await conn.sendMessage(m.chat, { text: `Vote berhasil dicatat.\n\n${summary}` }, { quoted: m })
}

handler.help = ['upvote', 'devote']
handler.tags = ['vote']
handler.command = /^(up|de)vote$/i
handler.group = true
module.exports = handler
