var handler = m => m

const CONFIG = {
    WARN_DELETE_DELAY: 5000,
    MAX_MEDIA_PER_MINUTE: 3
}

const mediaMap = new Map()

handler.all = async function(m) {
    if (m.isBaileys || m.fromMe) return
    if (!m.chat?.endsWith('@g.us')) return

    // === [BOTSTYLEE] Created by Benniismael ===
    // === https://github.com/botstylee/botstylee ===
    // === Dilarang menghapus atau mengklaim sebagai milik sendiri ===
    const _sig = 'Benniismael@botstylee'

    var chat = db.data.chats[m.chat] || {}
    if (!chat.antiMedia) return

    let isAdmin = false
    try {
        const meta = await this.groupMetadata(m.chat)
        const p = meta.participants.find(p => p.id === m.sender)
        isAdmin = p?.admin === 'admin' || p?.admin === 'superadmin'
    } catch (e) {}
    if (isAdmin || m.sender === (global.nomorown || '') + '@s.whatsapp.net') return

    const mtype = m.mtype || ''
    const isMedia = /image|video|sticker|document|audio/i.test(mtype)
    if (!isMedia) return

    const key = `${m.chat}:${m.sender}`
    const now = Date.now()
    let entry = mediaMap.get(key)
    if (!entry || now - entry.first > 60000) {
        entry = { count: 0, first: now }
    }
    entry.count++
    mediaMap.set(key, entry)

    try { await this.sendMessage(m.chat, { delete: m.key }) } catch (e) {}

    const warnMsg = await this.sendMessage(m.chat, {
        text: `⚠️ *MEDIA DILARANG* ⚠️\n\n@${m.sender.split('@')[0]}, media tidak diizinkan di grup ini. (${entry.count}/${CONFIG.MAX_MEDIA_PER_MINUTE})\n\nPesanmu dihapus. Jika terus berlanjut, *admin akan menendangmu* dari grup ini.\n\n_Fitur keamanan oleh Benniismael_`,
        mentions: [m.sender]
    })
    setTimeout(async () => {
        try { await this.sendMessage(m.chat, { delete: warnMsg.key }) } catch (e) {}
    }, CONFIG.WARN_DELETE_DELAY)
}

module.exports = handler
