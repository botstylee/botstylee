/*//////////////////////////////////
Cretor : Hairul Lana
https://github.com/hairullana
/*/ ///////////////////////////////*/

var handler = async (m, {
	conn
}) => {
	// Guard: user harus terdaftar
	var ayg = db.data.users[m.sender]
	if (!ayg) return m.reply('Kamu belum terdaftar di database.')

	// Guard: user harus punya pasangan
	var pasanganJid = ayg.pasangan || ''
	if (!pasanganJid) {
		return m.reply('Anda tidak memiliki pasangan.')
	}

	// Cek pasangan terdaftar
	var beb = db.data.users[pasanganJid]

	// Kasus 1: pasangan tidak terdaftar di DB → reset saja
	if (!beb) {
		ayg.pasangan = ''
		return conn.reply(
			m.chat,
			`Berhasil putus hubungan dengan @${pasanganJid.split('@')[0]}`,
			m,
			{ mentions: [pasanganJid] }
		)
	}

	// Kasus 2: saling pacaran → putus keduanya
	if (beb.pasangan === m.sender) {
		ayg.pasangan = ''
		beb.pasangan = ''
		return conn.reply(
			m.chat,
			`Berhasil putus hubungan dengan @${pasanganJid.split('@')[0]}`,
			m,
			{ mentions: [pasanganJid] }
		)
	}

	// Kasus 3: target menembak orang lain (bukan sender) → tidak bisa putus
	return m.reply('Anda tidak memiliki pasangan.\nKasian😂👆')
}

handler.help = ['putus']
handler.tags = ['jadian']
handler.command = /^(putus)$/i
handler.group = true
handler.fail = null

module.exports = handler
