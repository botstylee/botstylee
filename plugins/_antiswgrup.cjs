var handler = m => m

handler.before = async function(m, {
	conn,
	groupMetadata
}) {
	if (!m.isGroup) return !0
	if (m.fromMe) return !0

	// Cek apakah fitur aktif di grup ini
	if (!db.data.chats[m.chat]?.antiSwGrup) return !0

	// ✅ Deteksi SW Grup yang lebih lengkap
	var isSwGrup = false

	// 1. Cek langsung dari message
	if (
		m.message?.groupStatusMessageV2 ||
		m.message?.groupStatusMessage
	) {
		isSwGrup = true
	}

	// 2. Cek dari mtype
	if (
		m.mtype === 'groupStatusMessageV2' ||
		m.mtype === 'groupStatusMessage'
	) {
		isSwGrup = true
	}

	// 3. Cek dari senderKeyDistributionMessage (SW Grup sering dibungkus ini)
	if (m.message?.senderKeyDistributionMessage?.groupId) {
		isSwGrup = true
	}

	// 4. Cek dari protocolMessage dengan type 5 (SW Grup)
	if (
		m.message?.protocolMessage?.type === 5 &&
		m.message?.protocolMessage?.key?.remoteJid === m.chat
	) {
		isSwGrup = true
	}

	// 5. Cek dari mtype yang mengandung "groupStatus"
	if (m.mtype && /groupStatus/i.test(m.mtype)) {
		isSwGrup = true
	}

	if (!isSwGrup) return !0

	var sender = m.sender || m.participant
	var senderName = m.pushName || m.name || 'Kak'
	var groupName = groupMetadata?.subject || 'grup ini'

	// ✅ Hapus SW Grup (dengan fallback)
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
		console.error('[antiswgrup] Gagal hapus dengan participant:', e.message)
		// Fallback: coba tanpa participant
		try {
			await conn.sendMessage(m.chat, {
				delete: {
					remoteJid: m.chat,
					fromMe: false,
					id: m.key.id
				}
			})
		} catch (e2) {
			console.error('[antiswgrup] Gagal hapus fallback:', e2.message)
		}
	}

	// ✅ Kirim peringatan ke grup
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

	try {
		await conn.reply(m.chat, warning, m)
	} catch (e) {
		console.error('[antiswgrup] Gagal kirim peringatan:', e.message)
	}

	return !0
}

module.exports = handler
