var axios = require('axios')

var handler = m => m

handler.all = async function (m) {
    if (m.isBaileys) return
    if (!m.message) return
    if (m.fromMe) return

    var isGroup = m.chat?.endsWith('@g.us')

    // Cek command
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
    if (isCommand) return

    if (!m.text || m.text.trim().length === 0) return
    if (m.text.length > 1000) return

    if (isGroup) {
        var chat = db.data.chats[m.chat] || {}
        if (!chat.simi) return
    }

    try {
        if (!global.aiChatId) global.aiChatId = {}

        var params = {
            action: 'chat',
            text: m.text
        }

        // Hanya kirim chatId jika sudah ada sesi (bukan pertama kali)
        if (global.aiChatId[m.chat]) {
            params.chatId = global.aiChatId[m.chat]
        }

        var res = await axios.get('https://api.omegatech.app/api/ai/Dola', {
            params: params,
            timeout: 30000
        })

        // Simpan chatId dari response untuk pesan berikutnya
        var newChatId = res.data?.data?.chatId
        if (newChatId) {
            global.aiChatId[m.chat] = newChatId
        }

        // Balasan AI ada di data.answer
        var respon = res.data?.data?.answer

        if (!respon || typeof respon !== 'string') {
            console.error('[AI] Response tidak valid:', JSON.stringify(res.data).slice(0, 200))
            return
        }

        await m.reply(respon)
    } catch (e) {
        console.error('[AI] Error:', e?.response?.data || e.message)
    }
    return !0
}

module.exports = handler
