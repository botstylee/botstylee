const similarity = require('similarity')
const THRESHOLD = 0.72

const normalizeAnswer = value => String(value || '')
	.normalize('NFD')
	.replace(/[\u0300-\u036f]/g, '')
	.toLowerCase()
	.replace(/[^\p{L}\p{N}\s-]/gu, ' ')
	.replace(/\s+/g, ' ')
	.trim()

const handler = m => m
handler.before = async function (m) {
	if (!m || typeof m.text !== 'string' || !m.text.trim()) return false
	const session = this.caklontong?.[m.chat]
	if (!Array.isArray(session) || !session[0]?.key?.id || !session[1] || typeof session[1].jawaban !== 'string') return false

	const questionId = session[0].key.id
	const quotedId = m.quoted?.id || m.quoted?.key?.id
	if (quotedId !== questionId) return false

	const answer = normalizeAnswer(m.text)
	if (/^(nyerah|menyerah|surrender)$/i.test(answer)) {
		clearTimeout(session[3])
		delete this.caklontong[m.chat]
		await this.sendButton(m.chat, `Jawabannya: *${session[1].jawaban}*\n${session[1].deskripsi || ''}`, global.author || '', null, [
			['Cak Lontong', '.caklontong']
		], m).catch(error => this.logger?.error?.({ err: error }, 'Gagal menutup soal Cak Lontong'))
		return true
	}

	const expected = normalizeAnswer(session[1].jawaban)
	if (answer === expected) {
		// Close the room before sending a response so concurrent answers cannot award XP twice.
		clearTimeout(session[3])
		delete this.caklontong[m.chat]
		const user = db.data?.users?.[m.sender]
		if (user) user.exp = (Number(user.exp) || 0) + (Number(session[2]) || 0)
		await this.sendButton(m.chat, `*Benar!* +${Number(session[2]) || 0} XP\n${session[1].deskripsi || ''}`, global.author || '', null, [
			['Cak Lontong', '.caklontong']
		], m)
	} else if (typeof similarity === 'function' && similarity(answer, expected) >= THRESHOLD) {
		await m.reply('*Dikit lagi!*')
	} else {
		await m.reply('*Jawaban belum tepat.*')
	}
	return true
}

module.exports = handler
