var handler = m => m

handler.before = async function (m, {
    conn,
    groupMetadata,
    isBotAdmin,
    isAdmin
}) {
    // Abaikan jika bukan grup, atau pesan dari bot sendiri
    if (!m.isGroup) return !0
    if (m.fromMe) return !0
    if (m.isBaileys) return !0

    // Cek apakah fitur aktif di grup ini
    if (!db.data.chats[m.chat]?.antiSwGrup) return !0

    // ============================================================
    // DETEKSI SW GRUP (diperluas)
    // ============================================================
    var isSwGrup = false
    var detectReason = ''

    // 1. Cek langsung dari message
    if (m.message?.groupStatusMessageV2) {
        isSwGrup = true
        detectReason = 'groupStatusMessageV2'
    }
    if (m.message?.groupStatusMessage) {
        isSwGrup = true
        detectReason = 'groupStatusMessage'
    }

    // 2. Cek dari mtype
    if (m.mtype === 'groupStatusMessageV2') {
        isSwGrup = true
        detectReason = 'mtype:groupStatusMessageV2'
    }
    if (m.mtype === 'groupStatusMessage') {
        isSwGrup = true
        detectReason = 'mtype:groupStatusMessage'
    }

    // 3. Cek dari senderKeyDistributionMessage (SW Grup sering dibungkus ini)
    if (m.message?.senderKeyDistributionMessage?.groupId) {
        isSwGrup = true
        detectReason = 'senderKeyDistributionMessage'
    }

    // 4. Cek dari mtype yang mengandung "groupStatus"
    if (m.mtype && /groupStatus/i.test(m.mtype)) {
        isSwGrup = true
        detectReason = 'mtype:regex-groupStatus'
    }

    if (!isSwGrup) return !0

    // ============================================================
    // LOG DEBUG (untuk memastikan key valid)
    // ============================================================
    console.log('[antiswgrup] Terdeteksi:', detectReason)
    console.log('[antiswgrup] mtype:', m.mtype)
    console.log('[antiswgrup] key:', JSON.stringify(m.key, null, 2))
    console.log('[antiswgrup] sender:', m.sender)
    console.log('[antiswgrup] isBotAdmin:', isBotAdmin)
    console.log('[antiswgrup] isAdmin (pengirim):', isAdmin)

    var sender = m.sender || m.participant
    var senderName = m.pushName || m.name || 'Kak'
    var groupName = groupMetadata?.subject || 'grup ini'

    // ============================================================
    // STRATEGI 1: Hapus dengan key yang dinormalisasi
    // ============================================================
    var deleted = false
    try {
        var keyToDelete = {
            remoteJid: m.chat,
            fromMe: false,
            id: m.key.id,
            participant: sender
        }
        await conn.sendMessage(m.chat, { delete: keyToDelete })
        deleted = true
        console.log('[antiswgrup] ✅ Strategi 1 berhasil (delete dengan participant)')
    } catch (e) {
        console.error('[antiswgrup] ❌ Strategi 1 gagal:', e.message)
    }

    // ============================================================
    // STRATEGI 2: Hapus dengan m.key langsung (jika strategi 1 gagal)
    // ============================================================
    if (!deleted) {
        try {
            await conn.sendMessage(m.chat, { delete: m.key })
            deleted = true
            console.log('[antiswgrup] ✅ Strategi 2 berhasil (delete m.key)')
        } catch (e) {
            console.error('[antiswgrup] ❌ Strategi 2 gagal:', e.message)
        }
    }

    // ============================================================
    // STRATEGI 3: Coba relayMessage protocolMessage REVOKE
    // ============================================================
    if (!deleted) {
        try {
            await conn.relayMessage(m.chat, {
                protocolMessage: {
                    key: {
                        remoteJid: m.chat,
                        fromMe: false,
                        id: m.key.id,
                        participant: sender
                    },
                    type: 0 // REVOKE
                }
            }, {})
            deleted = true
            console.log('[antiswgrup] ✅ Strategi 3 berhasil (relayMessage REVOKE)')
        } catch (e) {
            console.error('[antiswgrup] ❌ Strategi 3 gagal:', e.message)
        }
    }

    // ============================================================
    // STRATEGI 4: KICK PENGIRIM (fallback jika hapus gagal)
    // ============================================================
    var kicked = false
    if (!deleted && isBotAdmin && !isAdmin && sender) {
        try {
            await conn.groupParticipantsUpdate(m.chat, [sender], 'remove')
            kicked = true
            console.log('[antiswgrup] ✅ Pengirim berhasil di-kick')
        } catch (e) {
            console.error('[antiswgrup] ❌ Gagal kick:', e.message)
        }
    }

    // ============================================================
    // KIRIM PERINGATAN KE GRUP
    // ============================================================
    var statusMsg = deleted
        ? '✅ SW Grup berhasil dihapus otomatis.'
        : kicked
            ? '⚠️ SW Grup tidak bisa dihapus, tapi pengirim telah dikeluarkan dari grup.'
            : '❌ SW Grup terdeteksi, tapi gagal dihapus dan pengirim tidak bisa di-kick (pastikan bot admin & pengirim bukan admin).'

    var warning = `
⚠️ *STORY GRUP TERDETEKSI* ⚠️

Hai *${senderName}* 👋
Kamu mengirim Story Grup (SW Grup) di *${groupName}*.

${statusMsg}

📌 *Kenapa SW Grup dilarang?*
- Mengganggu kenyamanan anggota
- Memenuhi chat grup
- Bisa disalahgunakan untuk spam

🚫 *Mohon jangan mengirim SW Grup lagi.*
✅ Kalau mau story, gunakan *Status WhatsApp pribadi* saja.

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
