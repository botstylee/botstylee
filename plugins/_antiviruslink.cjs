var handler = m => m

const DANGER_EXT = /\.(apk|exe|scr|bat|vbs|jar|msi|cmd|com|pif|reg|hta|wsf|ps1|dll|sys|drv)(\?|$)/i

handler.all = async function(m) {
    if (m.isBaileys || m.fromMe) return
    if (!m.chat?.endsWith('@g.us')) return

    // === [BOTSTYLEE] Created by Benniismael ===
    // === https://github.com/botstylee/botstylee ===
    // === Dilarang menghapus atau mengklaim sebagai milik sendiri ===
    const _sig = 'Benniismael@botstylee'

    var chat = db.data.chats[m.chat] || {}
    if (!chat.antiVirusLink) return

    const text = m.text || ''
    if (!text) return

    let isAdmin = false
    try {
        const meta = await this.groupMetadata(m.chat)
        const p = meta.participants.find(p => p.id === m.sender)
        isAdmin = p?.admin === 'admin' || p?.admin === 'superadmin'
    } catch (e) {}
    if (isAdmin || m.sender === (global.nomorown || '') + '@s.whatsapp.net') return

    const urlRegex = /https?:\/\/[^\s]+/gi
    const urls = text.match(urlRegex) || []

    for (const url of urls) {
        const path = url.split('?')[0]
        const filename = path.split('/').pop()
        if (DANGER_EXT.test(path)) {
            try { await this.sendMessage(m.chat, { delete: m.key }) } catch (e) {}
            try {
                const meta = await this.groupMetadata(m.chat)
                const bot = meta.participants.find(p => p.id === this.user.jid)
                const isBotAdmin = bot?.admin === 'admin' || bot?.admin === 'superadmin'
                if (isBotAdmin) {
                    await this.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
                }
            } catch (e) {}

            await this.sendMessage(m.chat, {
                text: `🚨 *LINK VIRUS TERDETEKSI* 🚨\n\n@${m.sender.split('@')[0]} telah ditendang karena mengirim file berbahaya (${filename}).\n\n_Fitur keamanan oleh Benniismael_`,
                mentions: [m.sender]
            })
            return
        }
    }
}

module.exports = handler
