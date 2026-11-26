/*//////////////////////////////////
Cretor : Hairul Lana
https://github.com/hairullana
/*/ ///////////////////////////////*/

var handler = async (m, {
	conn
}) => {
	// Guard: user harus terdaftar
	var user = db.data.users[m.sender]
	if (!user) return m.reply('Kamu belum terdaftar di database.')

	// Guard: user harus punya pasangan
	var pasanganJid = user.pasangan || ''
	if (!pasanganJid) {
		return m.reply('Kamu sedang tidak menembak siapapun!')
	}

	// Guard: pasangan harus terdaftar
	var pasangan = db.data.users[pasanganJid]
	if (!pasangan) {
		// Pasangan tidak ada di DB → reset saja
		user.pasangan = ''
		return m.reply('Pasanganmu tidak terdaftar di database. Status menembak sudah direset.')
	}

	// Kalau sudah saling menerima → tidak perlu ikhlasin
	if (pasangan.pasangan === m.sender) {
		return conn.reply(
			m.chat,
			`Kamu telah berpacaran dengan @${pasanganJid.split('@')[0]}`,
			m,
			{ mentions: [pasanganJid] }
		)
	}

	// Ikhlasin
	await conn.reply(
		m.chat,
		`Kamu sudah mengikhlaskan @${pasanganJid.split('@')[0]} karena dia tidak memberikan jawaban diterima atau ditolak`,
		m,
		{ mentions: [pasanganJid] }
	)

	// Reset status
	user.pasangan = ''
}

handler.help = ['ikhlasin']
handler.tags = ['jadian']
handler.command = /^(ikhlasin|ikhlas)$/i
handler.mods = false
handler.premium = false
handler.group = true
handler.fail = null

module.exports = handler
