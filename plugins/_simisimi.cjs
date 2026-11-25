var handler = m => m
handler.all = async function(m) {
    if (m.isBaileys) return
    if (!m.message) return

    // ... (bagian pengecekan command prefix tetap sama, tidak saya ubah) ...
    // Saya asumsikan variabel isIdMessage sudah terdefinisi dari kode asli kamu

    var chat = db.data.chats[m.chat]
    var user = db.data.users[m.sender]
    var serror = "simi error :("
    
    // Syarat: chat.simi aktif, tidak banned, bukan dari bot, bukan command, ada teks
    if (chat.simi && !chat.isBanned && !user.banned && !m.fromMe && !isIdMessage && m.text) {
        try {
            // Pindahkan require ke luar blok if agar tidak di-require berulang kali
            // (require sebenarnya cached, tapi lebih rapi)
            const simi = require('node-simipro')
            
            const res = await simi.simitalk(m.text, 'id')
            
            // Cek apakah respons valid
            if (!res || !res.success || !res.message) {
                console.error('[simisimi] Respons tidak valid:', res)
                return m.reply(serror)
            }

            // Jika SimSimi tidak tahu jawabannya, beri tahu user (opsional)
            // Atau tetap kirim pesan default dari SimSimi
            if (res.isUnknownResponse) {
                // Kamu bisa ganti dengan pesan custom atau tetap kirim pesan asli SimSimi
                // return m.reply('SimSimi tidak tahu jawabannya. Coba ajari dia!')
            }

            // Kirim respons
            await m.reply(res.message)
            
        } catch (e) {
            console.error('[simisimi] Error:', e)
            await m.reply(serror)
        }
        return !0
    }
    return true
}
module.exports = handler
