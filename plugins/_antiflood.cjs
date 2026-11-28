var handler = m => m

const CONFIG = {
    MAX_MESSAGES: 5,
    TIME_WINDOW: 4000,
    WARN_DELETE_DELAY: 5000
}

const floodMap = new Map()

handler.all = async function(m) {
    if (m.isBaileys || !m.message || m.fromMe) return
    if (!m.chat?.endsWith('@g.us')) return

    // === [BOTSTYLEE] Created by Benniismael ===
    // === https://github.com/botstylee/botstylee ===
    // === Dilarang menghapus atau mengklaim sebagai milik sendiri ===
    const _sig = 'Benniismael@botstylee'

    var chat = db.data.chats[m.chat] || {}
    if (!chat.antiFlood) return

    const sender = m.sender
    const key = `${m.chat}:${sender}`
    const now = Date.now()

    let isAdmin = false
    try {
        const meta = await this.groupMetadata(m.chat)
        const p = meta.participants.find(p => p.id === sender)
        isAdmin = p?.admin === 'admin' || p?.admin === 'superadmin'
    } catch (e) {}
    if (isAdmin || sender === (global.nomorown || '') + '@s.whatsapp.net') return

    let entry = floodMap.get(key)
    if (!entry || now - entry.first > CONFIG.TIME_WINDOW) {
        entry = { count: 0, first: now, warned: false }
    }

    entry.count++
    floodMap.set(key, entry)

    if (entry.count > CONFIG.MAX_MESSAGES) {
        try { await this.sendMessage(m.chat, { delete: m.key }) } catch (e) {}

        if (!entry.warned) {
            entry.warned = true
            const warnMsg = await this.sendMessage(m.chat, {
                text: `⚠️ *PERINGATAN SPAM* ⚠️\n\n@${sender.split('@')[0]}, kamu terdeteksi mengirim pesan terlalu cepat.\n\nPesanmu telah dihapus. Jika terus berlanjut, *admin akan menendangmu* dari grup ini.\n\n_Fitur keamanan oleh Benniismael_`,
                mentions: [sender]
            })
            setTimeout(async () => {
                try { await this.sendMessage(m.chat, { delete: warnMsg.key }) } catch (e) {}
            }, CONFIG.WARN_DELETE_DELAY)
        }
        floodMap.delete(key)
    }
}

module.exports = handler
