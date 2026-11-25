var winScore = 5000
async function handler(m) {
	var {
		family100
	} = await import('@bochilteam/scraper');
	this.game = this.game ? this.game : {}
	var id = 'family100_' + m.chat
	if (id in this.game) {
		this.reply(m.chat, 'Masih ada kuis yang belum terjawab di chat ini', this.game[id].msg)
		throw false
	}
	var json = await family100()
	var caption = `
*Soal:* ${json.soal}
Terdapat *${json.jawaban.length}* jawaban${json.jawaban.find(v => v.includes(' ')) ? `
(beberapa jawaban terdapat spasi)
`: ''}
+${winScore} XP tiap jawaban benar
    `.trim()
	this.game[id] = {
		id,
		msg: await this.sendButton(m.chat, caption, author, null, [
			['Nyerah', 'nyerah']
		], m),
		...json,
		terjawab: Array.from(json.jawaban, () => false),
		winScore,
	}
}
handler.help = ['family100']
handler.tags = ['game']
handler.command = /^family100$/i

module.exports = handler