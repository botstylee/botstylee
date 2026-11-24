var linkRegex = /chat\.whatsapp\.com\/(?:invite\/)?([0-9A-Za-z]{20,24})/i
var handler = m => m
handler.before = async function(m, {
	conn,
	isAdmin,
	isBotAdmin,
	participants,
	groupMetadata
}) {
	// Abaikan pesan dari bot sendiri
	if (m.isBaileys && m.fromMe) return !0
	if (!m.isGroup) return !1

	var chat = db.data.chats[m.chat] || {}
	var isGroupLink = linkRegex.exec(m.text || '')

	// Jika fitur antiLink tidak aktif atau tidak ada link → lanjut
	if (!chat.antiLink || !isGroupLink || isAdmin) return !0

	// Ambil daftar admin untuk mention
	var groupAdmins = participants.filter(p => p.admin)
	var listAdmin = groupAdmins.map((v, i) => `${i + 1}. @${v.id.split('@')[0]}`).join('\n')

	// Cek apakah link yang dikirim adalah link grup ini sendiri → izinkan
	if (isBotAdmin) {
		try {
			var linkThisGroup = `https://chat.whatsapp.com/${await this.groupInviteCode(m.chat)}`
			if (m.text.includes(linkThisGroup)) return !0
		} catch (e) {
			// Gagal ambil invite code, lanjut saja
		}
	}

	// Hapus pesan link
	try {
		await conn.sendMessage(m.chat, {
			delete: {
				remoteJid: m.chat,
				fromMe: false,
				id: m.key.id,
				participant: m.sender
			}
		})
	} catch (e) {
		console.error('Gagal hapus pesan link:', e)
	}

	// Kirim peringatan
	var senderName = m.pushName || 'Kak'
	var groupName = groupMetadata?.subject || 'grup ini'
	var warning = `
🚫 *LINK GRUP TERDETEKSI* 🚫

Hai *${senderName}* 👋
Kamu mengirim link grup di *${groupName}*.

📌 *Kenapa dihapus?*
Mengirim link grup di grup ini **dilarang** untuk mencegah spam dan menjaga kenyamanan anggota.

⚠️ *Pesan kamu telah dihapus otomatis.*
${isBotAdmin ? '🚪 Kamu akan *dikeluarkan* dari grup jika mengulangi.' : ''}

Admin grup:
${listAdmin || '- (tidak ada admin)'}

Terima kasih atas pengertiannya 🙏
`.trim()

	await conn.reply(m.chat, warning, m, {
		mentions: groupAdmins.map(v => v.id)
	})

	// Kick pengirim (jika bot admin)
	if (isBotAdmin) {
		try {
			await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
		} catch (e) {
			console.error('Gagal kick member:', e)
		}
	}

	return !0
}
handler.group = true
module.exports = handler
