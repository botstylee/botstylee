// plugins/group-hidetag.cjs
// Fitur: Kirim pesan tersembunyi yang men-tag semua member grup (hidetag / announcement)

var {
	generateWAMessageFromContent
} = require('@whiskeysockets/baileys')

var handler = async (m, {
	conn,
	text
}) => {
	// Pastikan di grup
	if (!m.isGroup) return m.reply('Fitur ini hanya bisa digunakan di grup.')

	// Ambil metadata grup untuk dapat participants
	var metadata = await conn.groupMetadata(m.chat)
	if (!metadata || !metadata.participants) {
		return m.reply('Gagal mengambil data grup.')
	}

	// Decode JID semua participant
	var users = metadata.participants
		.map(u => conn.decodeJid(u.id))
		.filter(Boolean)

	// Kalau tidak ada teks, pakai teks default
	var txt = text || m.quoted?.text || ''

	// Ambil source message (quoted atau pesan saat ini)
	var q = m.quoted ? m.quoted : m
	var c = m.quoted ? m.quoted : m.msg

	// Guard: kalau tidak ada konten sama sekali
	if (!c) return m.reply('Tidak ada pesan yang bisa di-hidetag.')

	// Bangun konten
	var content
	if (c.toJSON) {
		// Kalau quoted message, ambil type & content aslinya
		content = {
			[q.mtype]: c.toJSON()
		}
	} else {
		// Kalau teks biasa
		content = {
			extendedTextMessage: {
				text: typeof c === 'string' ? c : txt
			}
		}
	}

	var msg = conn.cMod(
		m.chat,
		generateWAMessageFromContent(m.chat, content, {
			quoted: m,
			userJid: conn.user.id
		}),
		txt,              // teks baru (kalau ada)
		conn.user.jid,    // sender
		{ mentions: users }
	)

	await conn.relayMessage(m.chat, msg.message, {
		messageId: msg.key.id
	})
}

handler.help = ['pengumuman', 'announce', 'hidetag'].map(v => v + ' [teks]')
handler.tags = ['group']
handler.command = /^(pengumuman|announce|hiddentag|hidetag)$/i

handler.group = true
handler.admin = true

module.exports = handler
