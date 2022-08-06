var handler = async (m, {
	conn
}) => {
	conn.tebakkata = conn.tebakkata ? conn.tebakkata : {}
	var id = m.chat
	if (!(id in conn.tebakkata)) throw false
	var json = conn.tebakkata[id][1]
	var ans = json.jawaban.trim()
	var clue = ans.replace(/[AIUEO]/gi, '_')
	m.reply('```' + clue + '```')
}
handler.command = /^teka$/i

handler.limit = true

module.exports = handler