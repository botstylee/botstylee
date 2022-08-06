var handler = async (m, {
	conn
}) => {
	conn.tebakgambar = conn.tebakgambar ? conn.tebakgambar : {}
	var id = m.chat
	if (!(id in conn.tebakgambar)) throw false
	var json = conn.tebakgambar[id][1]
	conn.sendButton(m.chat, '```' + json.jawaban.replace(/[bcdfghjklmnpqrstvwxyz]/ig, '_') + '```', author, null, [
		['nyerah', 'menyerah']
	], m)
}
handler.command = /^hint$/i

handler.limit = true

module.exports = handler