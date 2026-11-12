var handler = async (m, { conn }) => {
	conn.tebakgambar = conn.tebakgambar || {}
	var game = conn.tebakgambar[m.chat]
	if (!game) return m.reply('Tidak ada soal tebak gambar yang aktif.')
	var answer = String(game[1]?.jawaban || '')
	var clue = answer.replace(/[bcdfghjklmnpqrstvwxyz]/ig, '_')
	return conn.reply(m.chat, `Petunjuk: \`${clue}\`\nKetik .nyerah untuk menyerah.`, m)
}
handler.command = /^hint$/i
handler.limit = true
module.exports = handler
