var winScore = 5000
async function handler(m, { usedPrefix }) {
	var { family100 } = await import('@bochilteam/scraper')
	this.game = this.game || {}
	var id = 'family100_' + m.chat
	if (id in this.game) return this.reply(m.chat, `Masih ada kuis yang belum terjawab. Ketik ${usedPrefix}nyerah untuk menyerah.`, this.game[id].msg)

	var json = await family100()
	if (!Array.isArray(json?.jawaban) || !json.jawaban.length) throw 'Soal Family 100 tidak tersedia.'
	var caption = `*Soal:* ${json.soal}\nTerdapat *${json.jawaban.length}* jawaban${json.jawaban.some(value => value.includes(' ')) ? '\n(Beberapa jawaban terdiri dari beberapa kata)' : ''}\n+${winScore} XP tiap jawaban benar\nKetik ${usedPrefix}nyerah untuk menyerah.`
	this.game[id] = {
		id,
		msg: await this.reply(m.chat, caption, m),
		...json,
		terjawab: Array.from(json.jawaban, () => false),
		winScore
	}
}
handler.help = ['family100']
handler.tags = ['game']
handler.command = /^family100$/i
module.exports = handler
