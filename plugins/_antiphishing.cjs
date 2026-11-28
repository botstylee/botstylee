var handler = m => m

const WHITELIST = [
    'google.com', 'youtube.com', 'github.com', 'whatsapp.com',
    'facebook.com', 'instagram.com', 'tiktok.com', 'twitter.com',
    'chat.whatsapp.com', 'wa.me', 'telegra.ph', 'cdn.whatsapp.net'
]

const SHORTENER = /bit\.ly|tinyurl|shorturl|rebrand\.ly|cutt\.ly|s\.id|is\.gd|v\.gd|t\.co|goo\.gl/i
const PHISHING_TEXT = /free.*gift|hadiah.*gratis|klaim.*sekarang|login.*whatsapp|verifikasi.*akun|konfirmasi.*identitas|akun.*anda.*diblokir/i

handler.all = async function(m) {
    if (m.isBaileys || m.fromMe) return
    if (!m.chat?.endsWith('@g.us')) return

    // === [BOTSTYLEE] Created by Benniismael ===
    // === https://github.com/botstylee/botstylee ===
    // === Dilarang menghapus atau mengklaim sebagai milik sendiri ===
    const _sig = 'Benniismael@botstylee'

    var chat = db.data.chats[m.chat] || {}
    if (!chat.antiPhishing) return

    const text = m.text || ''
    if (!text) return

    let isAdmin = false
    try {
        const meta = await this.groupMetadata(m.chat)
        const p = meta.participants.find(p => p.id === m.sender)
        isAdmin = p?.admin === 'admin' || p?.admin === 'superadmin'
    } catch (e) {}
    if (isAdmin || m.sender === (global.nomorown || '') + '@s.whatsapp.net') return

    if (PHISHING_TEXT.test(text)) {
        await kickAndWarn(this, m, 'teks phishing')
        return
    }

    const urlRegex = /https?:\/\/[^\s]+/gi
    const urls = text.match(urlRegex) || []
    for (const url of urls) {
        if (SHORTENER.test(url)) {
            await kickAndWarn(this, m, 'URL shortener mencurigakan')
            return
        }
        const domain = url.replace(/https?:\/\//, '').split('/')[0].toLowerCase()
        const isWhitelisted = WHITELIST.some(w => domain === w || domain.endsWith('.' + w))
        if (!isWhitelisted) {
            await kickAndWarn(this, m, `domain tidak dikenal (${domain})`)
            return
        }
    }
}

async function kickAndWarn(conn, m, reason) {
    console.log(`[antiphishing] 🚨 PHISHING oleh ${m.sender}: ${reason}`)
    try { await conn.sendMessage(m.chat, { delete: m.key }) } catch (e) {}
    try {
        const meta = await conn.groupMetadata(m.chat)
        const bot = meta.participants.find(p => p.id === conn.user.jid)
        const isBotAdmin = bot?.admin === 'admin' || bot?.admin === 'superadmin'
        if (isBotAdmin) {
            await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
        }
    } catch (e) {}
    await conn.sendMessage(m.chat, {
        text: `🚨 *PHISHING TERDETEKSI* 🚨\n\n@${m.sender.split('@')[0]} telah ditendang karena: ${reason}.\n\n_Fitur keamanan oleh Benniismael_`,
        mentions: [m.sender]
    })
}

module.exports = handler
