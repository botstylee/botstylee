var handler = m => m

handler.all = async function(m) {
    if (m.isBaileys) return
    if (!m.message) return
    if (m.fromMe) return // jangan balas pesan sendiri

    // ✅ Tentukan apakah ini chat pribadi atau grup
    var isGroup = m.chat?.endsWith('@g.us')
    var isPrivate = !isGroup

    // ✅ Cek apakah pesan ini command (diawali prefix)
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
    if (isCommand) return // biarkan command handler yang proses

    // ✅ Hanya balas pesan teks yang valid
    if (!m.text || m.text.trim().length === 0) return
    if (m.text.length > 1000) return // batasi panjang teks

    // ✅ Logika utama:
    // - Chat pribadi: SELALU aktif (tanpa #enable)
    // - Grup: hanya aktif jika chat.simi === true (dari #enable simi)
    if (isGroup) {
        var chat = db.data.chats[m.chat] || {}
        if (!chat.simi) return // grup harus #enable simi dulu
    }

    var serror = "AI error :("

    try {
        var res = await global.axios.get('https://api.omegatech.app/api/ai/Dola', {
            params: {
                action: 'chat',
                q: m.text,
                chatId: m.chat // memory per chat
            },
            timeout: 30000
        })

        var respon = res.data?.result
            || res.data?.message
            || res.data?.response
            || res.data?.data?.result
            || res.data?.data?.message

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
