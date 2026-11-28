var axios = require('axios')

var handler = m => m

handler.all = async function (m) {
    // 1. Abaikan pesan dari bot sendiri atau pesan kosong
    if (m.isBaileys || m.fromMe || !m.message) return

    // 2. Deteksi apakah ini command (prefix)
    var prefix = global.prefix || /^[#./!]/
    var isCommand = false
    if (m.text) {
        if (prefix instanceof RegExp) {
            isCommand = prefix.test(m.text)
        } else if (Array.isArray(prefix)) {
            isCommand = prefix.some(p => {
                var re = p instanceof RegExp ? p : new RegExp(p.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&'))
                return re.test(m.text)
            })
        } else if (typeof prefix === 'string') {
            isCommand = m.text.startsWith(prefix)
        }
    }

    // 3. JIKA INI COMMAND, JANGAN DIBALAS OLEH SIMI
    // Biarkan handler utama (handler.js) yang memproses command .enable simi
    if (isCommand) return

    // 4. Validasi teks
    if (!m.text || m.text.trim().length === 0 || m.text.length > 1000) return

    // 5. Cek apakah fitur simi aktif
    var isGroup = m.chat?.endsWith('@g.us')
    if (isGroup) {
        // Di grup, harus diaktifkan dulu via .enable simi
        var chat = db.data.chats[m.chat] || {}
        if (!chat.simi) return
    }
    // Di private chat, langsung aktif (tidak perlu enable)

    try {
        // 6. Siapkan parameter untuk API
        if (!global.aiChatId) global.aiChatId = {}
        
        var params = {
            action: 'chat',
            text: m.text
        }

        // Hanya kirim chatId jika sudah ada sesi sebelumnya
        if (global.aiChatId[m.chat]) {
            params.chatId = global.aiChatId[m.chat]
        }

        // 7. Request ke API
        var res = await axios.get('https://api.omegatech.app/api/ai/Dola', {
            params: params,
            timeout: 30000
        })

        // 8. Simpan chatId dari respons untuk pesan berikutnya
        var newChatId = res.data?.data?.chatId
        if (newChatId) {
            global.aiChatId[m.chat] = newChatId
        }

        // 9. AMBIL BALASAN DARI FIELD YANG BENAR (data.answer)
        var respon = res.data?.data?.answer

        // 10. Jika tidak ada balasan, jangan kirim apa-apa (hindari "undefined")
        if (!respon || typeof respon !== 'string') {
            console.error('[AI] Respons tidak valid:', JSON.stringify(res.data).slice(0, 200))
            return
        }

        // 11. Kirim balasan
        await m.reply(respon)

    } catch (e) {
        console.error('[AI] Error:', e?.response?.data || e.message)
    }
    return !0
}

module.exports = handler
