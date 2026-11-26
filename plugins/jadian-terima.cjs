/*//////////////////////////////////
Cretor : Hairul Lana
https://github.com/hairullana
/*/ ///////////////////////////////*/

var handler = async (m, {
	conn,
	text
}) => {
	// === 1. Tentukan target JID ===
	var number, user

	if (!text && !m.quoted && !(m.mentionedJid && m.mentionedJid.length)) {
		return m.reply('Berikan nomor, tag atau balas pesan target.')
	}

	if (text) {
		var clean = String(text).replace(/\s/g, '').replace(/([@+-])/g, '')
		if (isNaN(clean)) {
			number = text.split('@')[1]
		} else {
			number = clean
		}
		if (!number) return m.reply('Nomor tidak valid.')
		if (number.length > 15) return m.reply('Format salah!')
		user = number + '@s.whatsapp.net'
	} else if (m.quoted && m.quoted.sender) {
		user = m.quoted.sender
	} else if (m.mentionedJid && m.mentionedJid.length) {
		user = m.mentionedJid[0]
	}

	if (!user) return m.reply('Target tidak ditemukan.')

	// === 2. Cek target ada di grup (kalau di grup) ===
	if (m.isGroup) {
		var groupMetadata = await conn.groupMetadata(m.chat).catch(() => null)
		var participants = groupMetadata?.participants || []
		var target = participants.find(u => conn.decodeJid(u.id) === user)
		if (!target) {
			return m.reply('Target atau Nomor tidak ditemukan, mungkin sudah keluar atau bukan anggota grup ini.')
		}
	}

	// === 3. Guard dasar ===
	if (user === m.sender) return m.reply('Tidak bisa berpacaran dengan diri sendiri!')
	if (user === conn.user.jid) return m.reply('Tidak bisa berpacaran dengan saya t_t')

	// === 4. Guard database ===
	var senderData = db.data.users[m.sender]
	if (!senderData) return m.reply('Kamu belum terdaftar di database.')

	var targetData = db.data.users[user]
	if (!targetData) return m.reply('Target tidak terdaftar di database.')

	// Pastikan field pasangan ada
	if (typeof senderData.pasangan !== 'string') senderData.pasangan = ''
	if (typeof targetData.pasangan !== 'string') targetData.pasangan = ''

	// === 5. Logika terima ===
	if (targetData.pasangan !== m.sender) {
		return conn.reply(
			m.chat,
			`Maaf @${user.split('@')[0]} tidak sedang menembak anda`,
			m,
			{ mentions: [user] }
		)
	}

	// Saling menerima → resmi pacaran
	senderData.pasangan = user
	return conn.reply(
		m.chat,
		`Selamat anda resmi berpacaran dengan @${user.split('@')[0]}\n\nSemoga langgeng dan bahagia selalu @${user.split('@')[0]} 💓 @${m.sender.split('@')[0]} 🥳🥳🥳`,
		m,
		{ mentions: [m.sender, user] }
	)
}

handler.help = ['terima *@tag*']
handler.tags = ['jadian']
handler.command = /^(terima)$/i
handler.group = true
handler.limit = false
handler.fail = null

module.exports = handler
