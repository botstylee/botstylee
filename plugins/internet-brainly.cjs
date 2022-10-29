var brainly = require('brainly-scraper-v2')
var handler = async function(m, {
	text
}) {
	if (!text) throw 'Soalnya?'
	var res = await brainly(text)
	var answer = res.data.map((v, i) => `_*PERTANYAAN KE ${i + 1}*_\n${v.pertanyaan}\n${v.jawaban.map((v,i) => `*JAWABAN KE ${i + 1}*\n${v.text}`).join('\n')}`).join('\n\n•------------•\n\n')
	m.reply(answer)
}
handler.help = ['brainly [soal]']
handler.tags = ['internet']
handler.command = /^brainly$/i
handler.limit = true
module.exports = handler
