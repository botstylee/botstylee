var handler = async (m, {
	conn
}) => {
	conn.caklontong = conn.caklontong ? conn.caklontong : {}
	var id = m.chat
	if (!(id in conn.caklontong)) throw false
	var json = conn.caklontong[id][1]
	var ans = json.jawaban
	var clue = ans.replace(/[AIUEO]/gi, '_')
	m.reply('```' + clue + '```')
}
handler.command = /^calo$/i

handler.limit = true

module.exports = handler