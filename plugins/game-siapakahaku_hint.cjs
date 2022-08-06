var handler = async (m, {
	conn
}) => {
	conn.siapakahaku = conn.siapakahaku ? conn.siapakahaku : {}
	var id = m.chat
	if (!(id in conn.siapakahaku)) throw false
	var json = conn.siapakahaku[id][1]
	var ans = json.jawaban
	var clue = ans.replace(/[bcdfghjklmnpqrstvwxyz]/ig, '_')
	m.reply('```' + clue + '```')
}
handler.command = /^who$/i

handler.limit = true

module.exports = handler