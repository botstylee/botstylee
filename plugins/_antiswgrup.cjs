var handler = m => m
handler.before = async function(m, {
	conn,
	groupMetadata
}) {
	if (!m.isGroup) return !0
	if (m.fromMe) return !0

	// Cek apakah fitur aktif di grup ini
	if (!db.data.chats[m.chat]?.antiSwGrup) return !0

	// Deteksi SW Grup
	var isSwGrup = false
	if (
		m.message?.groupStatusMessageV2 ||
		m.message?.groupStatusMessage ||
		m.mtype === 'groupStatusMessageV2' ||
		m.mtype === 'groupStatusMessage'
	) {
		isSwGrup = true
	}
	if (!isSwGrup) return !0

	var sender = m.sender || m.participant
	var senderName = m.pushName || m.name || 'Kak'
	var groupName = groupMetadata?.subject || 'grup ini'

	// Hapus SW Grup
	try {
		await conn.sendMessage(m.chat, {
			delete: {
				remoteJid: m.chat,
				fromMe: false,
				id: m.key.id,
				participant: sender
			}
		})
	} catch (e) {
		console.error('Gagal hapus SW Grup:', e)
	}

	// Kirim peringatan
	var warning = `
⚠️ *STORY GRUP TERDETEKSI* ⚠️

Hai *${senderName}* 👋
Story grup (SW Grup) yang kamu kirim di *${groupName}* sudah *dihapus otomatis* oleh bot.

📌 *Kenapa?*
SW Grup sering mengganggu kenyamanan anggota dan memenuhi chat grup. Fitur ini juga bisa disalahgunakan untuk spam.

🚫 *Mohon jangan mengirim SW Grup lagi* di grup ini, ya.
✅ Kalau mau story, silakan pakai *Status WhatsApp pribadi* saja.

Terima kasih atas pengertiannya 🙏
`.trim()

	await conn.reply(m.chat, warning, m)

	return !0
}

module.exports = handler
