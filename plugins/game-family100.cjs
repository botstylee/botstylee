const WIN_SCORE = 5000
const TIMEOUT_MS = 120000

async function handler(m, { usedPrefix = '.' }) {
	this.game = this.game && typeof this.game === 'object' ? this.game : {}
	const id = `family100_${m.chat}`
	if (this.game[id]) {
		return this.reply(m.chat, 'Masih ada kuis Family 100 yang belum selesai di chat ini.', this.game[id].msg || m)
	}

	try {
		const { family100 } = await import('@bochilteam/scraper')
		const data = await family100()
		if (!data || typeof data.soal !== 'string' || !Array.isArray(data.jawaban) || !data.jawaban.length) {
			throw new Error('Data soal Family 100 tidak valid.')
		}

		const answers = data.jawaban
			.filter(answer => typeof answer === 'string' && answer.trim())
			.map(answer => answer.trim())
		if (!answers.length) throw new Error('Soal tidak memiliki jawaban yang valid.')

		const room = {
			id,
			soal: data.soal,
			jawaban: answers,
			terjawab: answers.map(() => false),
			winScore: WIN_SCORE,
			msg: null,
			timeout: null
		}
		const hasMultiWord = answers.some(answer => answer.includes(' '))
		const caption = [
			'*Soal Family 100:*',
			room.soal,
			`Ada *${answers.length}* jawaban${hasMultiWord ? ' (beberapa jawaban terdiri dari beberapa kata)' : ''}.`,
			`Waktu: ${TIMEOUT_MS / 1000} detik.`,
			`Hadiah: ${WIN_SCORE} XP per jawaban benar.`,
			`Ketik *nyerah* untuk menyerah.`
		].join('\n')

		room.msg = await this.sendButton(m.chat, caption, global.author || '', null, [['Nyerah', 'nyerah']], m)
		this.game[id] = room
		room.timeout = setTimeout(async () => {
			if (this.game?.[id] !== room) return
			delete this.game[id]
			const answersText = room.jawaban.map((answer, index) => {
				const winner = room.terjawab[index]
				return `${index + 1}. ${answer}${winner ? ` — @${winner.split('@')[0]}` : ''}`
			}).join('\n')
			await this.sendMessage(m.chat, {
				text: `Waktu Family 100 habis.\n\n${answersText}`,
				mentions: room.terjawab.filter(Boolean)
			}, { quoted: room.msg || m }).catch(error => this.logger?.error?.({ err: error }, 'Gagal mengirim hasil Family 100'))
		}, TIMEOUT_MS)
		return room.msg
	} catch (error) {
		this.logger?.error?.({ err: error, chat: m.chat }, 'Gagal memulai Family 100')
		return this.reply(m.chat, 'Kuis Family 100 gagal dimulai. Coba lagi sebentar.', m)
	}
}

handler.help = ['family100']
handler.tags = ['game']
handler.command = /^family100$/i

module.exports = handler
