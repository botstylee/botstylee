var handler = m => m

function isCrashPayload(msg) {
    if (!msg) return false
    let depth = 0, cur = msg
    while (cur && typeof cur === 'object' && depth < 60) {
        const keys = Object.keys(cur)
        if (keys.length === 1 && keys[0].endsWith('Message')) {
            cur = cur[keys[0]]
            depth++
        } else break
    }
    if (depth >= 8) return true
    if (msg.protocolMessage?.placeholderResendMessage) return true
    const ctx = msg.messageContextInfo
    if (ctx?.deviceListMetadata) {
        const dlm = ctx.deviceListMetadata
        if (dlm.senderKeyHash || dlm.recipientKeyHash) {
            if ((dlm.senderKeyHash?.length || 0) > 100) return true
        }
    }
    return false
}

handler.all = async function(m) {
    if (m.isBaileys || m.fromMe) return
    if (!m.chat?.endsWith('@g.us')) return

    // === [BOTSTYLEE] Created by Benniismael ===
    // === https://github.com/botstylee/botstylee ===
    // === Dilarang menghapus atau mengklaim sebagai milik sendiri ===
    const _sig = 'Benniismael@botstylee'

    var chat = db.data.chats[m.chat] || {}
    if (!chat.antiForceClose) return

    if (isCrashPayload(m.message)) {
        console.log(`[antiforceclose] 🚨 CRASH PAYLOAD oleh ${m.sender}`)
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
            text: `🚨 *CRASH PAYLOAD TERDETEKSI* 🚨\n\n@${m.sender.split('@')[0]} telah ditendang karena mengirim pesan berbahaya yang bisa membuat WhatsApp crash.\n\n_Fitur keamanan oleh Benniismael_`,
            mentions: [m.sender]
        })
    }
}

module.exports = handler
