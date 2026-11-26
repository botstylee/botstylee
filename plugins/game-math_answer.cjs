var handler = m => m

handler.before = async function (m, { conn }) {
	// ✅ Hanya proses pesan yang berupa angka
	if (!/^-?[0-9]+(\.[0-9]+)?$/.test(m.text || '')) return !0

	var id = m.chat
	this.math = this.math ? this.math : {}

	// ✅ Kalau tidak ada sesi math di chat ini, abaikan
	if (!(id in this.math)) return !0

	try {
		var session = this.math[id]
		if (!session || !session[1]) return !0

		var math = session[1]
		var jawab = parseFloat(m.text)

		// ✅ Cek jawaban (pakai toleransi float)
		if (Math.abs(jawab - math.result) < 0.0001) {
			clearTimeout(session[3])
			delete this.math[id]

			// ✅ Inisialisasi exp user kalau belum ada
			var db = global.db || require('../lib/database.js').default
			if (db?.data?.users?.[m.sender]) {
				var user = db.data.users[m.sender]
				if (typeof user.exp !== 'number') user.exp = 0
				user.exp += math.bonus
			}

			await conn.reply(m.chat, `✅ *Jawaban Benar!*\n+${math.bonus} XP\n\nKetik *.math ${math.mode}* untuk main lagi.`, m)
			return !0
		}

		// ✅ Jawaban salah → kurangi kesempatan
		session[2] = (typeof session[2] === 'number' ? session[2] : 0) - 1

		if (session[2] <= 0) {
			clearTimeout(session[3])
			delete this.math[id]
			await conn.reply(m.chat, `💀 *Kesempatan habis!*\nJawaban: *${math.result}*\n\nKetik *.math ${math.mode}* untuk main lagi.`, m)
		} else {
			await conn.reply(m.chat, `❌ *Jawaban Salah!*\nMasih ada ${session[2]} kesempatan`, m)
		}
	} catch (e) {
		console.error('[math-answer] Error:', e)
	}
	return !0
}

module.exports = handler
