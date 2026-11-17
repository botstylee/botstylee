const TIMEOUT_MS = 120000
const POINTS = 5000

const handler = async (m, { usedPrefix = '.' }) => {
	this.caklontong = this.caklontong && typeof this.caklontong === 'object' ? this.caklontong : {}
	const id = m.chat
	if (this.caklontong[id]) return this.reply(m.chat, 'Masih ada soal Cak Lontong yang belum terjawab di chat ini.', this.caklontong[id][0] || m)

	try {
		const { caklontong } = await import('@bochilteam/scraper')
		const data = await caklontong()
		if (!data || typeof data.soal !== 'string' || typeof data.jawaban !== 'string' || !data.jawaban.trim()) {
			throw new Error('Data soal Cak Lontong tidak valid.')
		}

		const caption = [
			'*Cak Lontong*',
			data.soal,
			`Waktu: ${TIMEOUT_MS / 1000} detik.`,
			`Hadiah: ${POINTS} XP.`,
			`Ketik *${usedPrefix}calo* untuk petunjuk atau *nyerah* untuk menyerah.`
		].join('\n')
		const questionMessage = await this.sendButton(m.chat, caption, global.author || '', null, [
			['Petunjuk', `${usedPrefix}calo`],
			['Nyerah', 'nyerah']
		], m)
		const session = [questionMessage, data, POINTS, null]
		this.caklontong[id] = session
		session[3] = setTimeout(async () => {
			if (this.caklontong?.[id] !== session) return
			delete this.caklontong[id]
			await this.sendButton(m.chat, `Waktu habis!\nJawabannya: *${data.jawaban}*\n${data.deskripsi || ''}`, global.author || '', null, [
				['Cak Lontong', `${usedPrefix}caklontong`]
			], questionMessage).catch(error => this.logger?.error?.({ err: error }, 'Gagal mengirim hasil Cak Lontong'))
		}, TIMEOUT_MS)
		return questionMessage
	} catch (error) {
		this.logger?.error?.({ err: error, chat: m.chat }, 'Gagal memulai Cak Lontong')
		return this.reply(m.chat, 'Soal Cak Lontong gagal dimulai. Coba lagi sebentar.', m)
	}
}

handler.help = ['caklontong']
handler.tags = ['game']
handler.command = /^caklontong$/i

module.exports = handler
