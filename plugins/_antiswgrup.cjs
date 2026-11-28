// plugins/_antiswgrup.cjs
// Fitur: Hapus otomatis SW Grup (deteksi via groupStatusMessageV2)

var handler = m => m

handler.before = async function (m, { conn, groupMetadata }) {
    // 1. Hanya proses di grup, bukan dari bot sendiri
    if (!m.isGroup || m.fromMe) return true

    // 2. Cek apakah fitur aktif di grup ini
    if (!db.data.chats[m.chat]?.antiSwGrup) return true

    // 3. DETEKSI SW GRUP (logika kamu sudah bagus, saya pertahankan)
    var isSwGrup = false

    if (m.message?.groupStatusMessageV2 || m.message?.groupStatusMessage) isSwGrup = true
    if (m.mtype === 'groupStatusMessageV2' || m.mtype === 'groupStatusMessage') isSwGrup = true
    if (m.message?.senderKeyDistributionMessage?.groupId) isSwGrup = true
    if (m.message?.protocolMessage?.type === 5 && m.message?.protocolMessage?.key?.remoteJid === m.chat) isSwGrup = true
    if (m.mtype && /groupStatus/i.test(m.mtype)) isSwGrup = true

    if (!isSwGrup) return true

    // 4. CEK BOT ADMIN (wajib untuk hapus)
    var isBotAdmin = false
    try {
        var botJid = conn.user.id.split(':')[0] + '@s.whatsapp.net'
        var botParticipant = groupMetadata?.participants?.find(p => p.id === botJid)
        isBotAdmin = botParticipant && (botParticipant.admin === 'admin' || botParticipant.admin === 'superadmin')
    } catch (e) {
        console.error('[antiswgrup] Gagal cek admin:', e.message)
    }

    if (!isBotAdmin) {
        console.log('[antiswgrup] Bot bukan admin, tidak bisa hapus SW Grup.')
        return true
    }

    // 5. HAPUS SW GRUP (CARA YANG BENAR)
    //    Cukup kirim key asli, jangan dimanipulasi.
    try {
        await conn.sendMessage(m.chat, { delete: m.key })
        console.log(`[antiswgrup] SW Grup dari ${m.sender} dihapus.`)
    } catch (e) {
        console.error('[antiswgrup] Gagal hapus:', e.message)
        // Jika masih gagal, kemungkinan bukan admin atau key tidak valid.
    }

    // 6. KIRIM PERINGATAN (opsional, kamu bisa hapus jika terlalu berisik)
    var senderName = m.pushName || m.name || 'Kak'
    var groupName = groupMetadata?.subject || 'grup ini'
    var warning = `
⚠️ *STORY GRUP TERDETEKSI* ⚠️

Hai *${senderName}* 👋
Story grup (SW Grup) yang kamu kirim di *${groupName}* sudah *dihapus otomatis* oleh bot.

📌 *Kenapa?*
SW Grup sering mengganggu kenyamanan anggota dan memenuhi chat grup.

🚫 *Mohon jangan mengirim SW Grup lagi*, ya.
✅ Kalau mau story, silakan pakai *Status WhatsApp pribadi* saja.

Terima kasih atas pengertiannya 🙏
`.trim()

    try {
        await conn.reply(m.chat, warning, m)
    } catch (e) {
        console.error('[antiswgrup] Gagal kirim peringatan:', e.message)
    }

    return true
}

module.exports = handler
