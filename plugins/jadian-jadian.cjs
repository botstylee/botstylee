/*//////////////////////////////////
Cretor : Hairul Lana
https://github.com/hairullana
/*/ ///////////////////////////////*/

var handler = async (m, {
	conn,
	usedPrefix,
	text
}) => {
	// === 1. Tentukan target JID ===
	var number, user

	if (!text && !m.quoted && !(m.mentionedJid && m.mentionedJid.length)) {
		return m.reply('Masukan nomor, tag target atau balas pesan target')
	}

	if (text) {
		var clean = String(text).replace(/\s/g, '').replace(/([@+-])/g, '')
		if (isNaN(clean)) {
			// Format: @628xxx
			number = text.split('@')[1]
		} else {
			number = clean
		}
		if (!number) return m.reply('Nomor tidak valid.')
		if (number.length > 15) return m.reply('Format Tidak Valid.')
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
	if (user === m.sender) return m.reply('Tidak bisa berpacaran dengan diri sendiri.')
	if (user === conn.user.jid) return m.reply("Tidak bisa berpacaran dengan saya. :')")

	// === 4. Guard database ===
	var senderData = db.data.users[m.sender]
	if (!senderData) return m.reply('Kamu belum terdaftar di database.')

	var targetData = db.data.users[user]
	if (!targetData) return m.reply('Orang yang anda tag tidak terdaftar di dalam database.')

	// Pastikan field pasangan ada
	if (typeof senderData.pasangan !== 'string') senderData.pasangan = ''
	if (typeof targetData.pasangan !== 'string') targetData.pasangan = ''

	// === 5. Logika tembak ===
	var senderPasangan = senderData.pasangan
	var senderPasanganData = senderPasangan ? db.data.users[senderPasangan] : null

	// Kasus: sudah pacaran dengan orang lain
	if (senderPasangan && senderPasanganData && senderPasanganData.pasangan === m.sender && senderPasangan !== user) {
		return conn.reply(
			m.chat,
			`Kamu sudah berpacaran dengan @${senderPasangan.split('@')[0]}\n\nSilahkan putus dulu (ketik .putus untuk memutuskan hubungan) untuk menembak @${user.split('@')[0]}\n\nBtw yang setia dikit banget!`,
			m,
			{ mentions: [user, senderPasangan] }
		)
	}

	// Kasus: target sudah punya pasangan
	if (targetData.pasangan) {
		var pacar = targetData.pasangan
		var pacarData = db.data.users[pacar]

		if (pacarData && pacarData.pasangan === user) {
			// Target sudah pacaran dengan orang lain
			if (m.sender === pacar) {
				return conn.reply(
					m.chat,
					`Anda sudah berpacaran dengan @${user.split('@')[0]}`,
					m,
					{ mentions: [user] }
				)
			}
			return conn.reply(
				m.chat,
				`Maaf, @${user.split('@')[0]} sudah berpacaran dengan @${pacar.split('@')[0]}\nSilahkan cari pasangan lain!`,
				m,
				{ mentions: [user, pacar] }
			)
		} else {
			// Target "menembak" orang lain tapi belum diterima
			senderData.pasangan = user
			return conn.reply(
				m.chat,
				`Anda baru saja mengajak @${user.split('@')[0]} berpacaran\n\nSilahkan menunggu jawaban darinya!\n\nKetik *${usedPrefix}terima @user* untuk menerima\n*${usedPrefix}tolak @user untuk menolak*`,
				m,
				{ mentions: [user] }
			)
		}
	}

	// Kasus: target menembak balik sender (saling menembak)
	if (targetData.pasangan === m.sender) {
		senderData.pasangan = user
		return conn.reply(
			m.chat,
			`Selamat anda resmi berpacaran dengan @${user.split('@')[0]}\n\nSemoga langgeng dan bahagia selalu 🥳🥳🥳`,
			m,
			{ mentions: [user] }
		)
	}

	// Kasus default: kirim tembakan
	senderData.pasangan = user
	return conn.reply(
		m.chat,
		`Kamu baru saja mengajak @${user.split('@')[0]} berpacaran\n\nSilahkan menunggu jawaban darinya!\n\nKetik *${usedPrefix}terima @user* untuk menerima\n*${usedPrefix}tolak @user untuk menolak*`,
		m,
		{ mentions: [user] }
	)
}

handler.help = ['tembak *@tag*']
handler.tags = ['jadian']
handler.command = /^(tembak)$/i
handler.group = true
handler.limit = false
handler.fail = null

module.exports = handler
