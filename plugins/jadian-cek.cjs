// plugins/jadian-cekpacar.cjs
// Fitur: Cek status pacar target (tag / reply / diri sendiri)

var handler = async (m, {
	conn,
	usedPrefix,
	text
}) => {
	// Bersihkan input jadi angka
	function no(number) {
		return String(number).replace(/\s/g, '').replace(/([@+-])/g, '')
	}

	text = text ? no(text) : ''

	var number, user, orang

	if (text) {
		// Ada teks → anggap nomor
		number = isNaN(text) ? text.split('@')[1] : text
	} else if (m.quoted && m.quoted.sender) {
		// Reply → pakai sender quoted
		number = m.quoted.sender.split('@')[0]
	} else if (m.mentionedJid && m.mentionedJid.length) {
		// Tag → pakai mention pertama
		number = m.mentionedJid[0].split('@')[0]
	}

	// Validasi nomor
	if (number) {
		number = no(number)
		if (number.length > 15 || (number.length < 9 && number.length > 0)) {
			return m.reply('Maaf, Nomor yang anda masukan salah!')
		}
	}

	// Tentukan target
	if (!text && !m.quoted && !(m.mentionedJid && m.mentionedJid.length)) {
		user = m.sender
		orang = 'Kamu'
	} else if (text) {
		user = number + '@s.whatsapp.net'
		orang = 'Orang yang kamu tag'
	} else if (m.quoted && m.quoted.sender) {
		user = m.quoted.sender
		orang = 'Orang yang kamu balas'
	} else if (m.mentionedJid && m.mentionedJid.length) {
		user = m.mentionedJid[0]
		orang = 'Orang yang kamu tag'
	}

	// Guard: target tidak valid
	if (!user) return m.reply('Target tidak ditemukan. Tag, reply, atau masukkan nomor.')

	// Guard: target tidak terdaftar
	var target = db.data.users[user]
	if (!target) return m.reply('Target tidak terdaftar di dalam database!')

	// Guard: pasangan target tidak valid
	var pasanganJid = target.pasangan || ''
	if (pasanganJid && !db.data.users[pasanganJid]) {
		return m.reply('Target tidak terdaftar di dalam database!')
	}

	// Logika status pacar
	if (!pasanganJid) {
		return m.reply(
			`${orang} tidak memiliki pasangan dan tidak sedang menembak siapapun\n\n*Ketik .tembak @user untuk menembak seseorang*`
		)
	}

	var pasangan = db.data.users[pasanganJid]

	if (pasangan.pasangan !== user) {
		return conn.reply(
			m.chat,
			`${orang} sedang menunggu jawaban dari @${pasanganJid.split('@')[0]} karena sedang tidak diterima atau di tolak\n\nKetik *${usedPrefix}ikhlasin* untuk mengikhlaskan!`,
			m,
			{ mentions: [pasanganJid] }
		)
	}

	return conn.reply(
		m.chat,
		`${orang} sedang menjalani hubungan dengan @${pasanganJid.split('@')[0]} 💓💓💓`,
		m,
		{ mentions: [pasanganJid] }
	)
}

handler.help = ['cekpacar']
handler.tags = ['jadian']
handler.command = /^(cekpacar)$/i
handler.fail = null

module.exports = handler
