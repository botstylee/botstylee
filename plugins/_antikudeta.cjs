var handler = m => m

handler.all = async function(m) {
    if (m.isBaileys || m.fromMe) return
    if (!m.chat?.endsWith('@g.us')) return

    // === [BOTSTYLEE] Created by Benniismael ===
    // === https://github.com/botstylee/botstylee ===
    // === Dilarang menghapus atau mengklaim sebagai milik sendiri ===
    const _sig = 'Benniismael@botstylee'

    var chat = db.data.chats[m.chat] || {}
    if (!chat.antiKudeta) return

    if (m.messageStubType === 28 || m.messageStubType === 29) {
        const targets = m.messageStubParameters || []
        const actor = m.sender

        let meta, actorIsAdmin = false
        try {
            meta = await this.groupMetadata(m.chat)
            const p = meta.participants.find(p => p.id === actor)
            actorIsAdmin = p?.admin === 'admin' || p?.admin === 'superadmin'
        } catch (e) {}

        const isOwner = meta?.owner === actor || meta?.subjectOwner === actor

        if (!actorIsAdmin && !isOwner) {
            console.log(`[antikudeta] 🚨 KUDETA oleh ${actor}`)
            try {
                const bot = meta.participants.find(p => p.id === this.user.jid)
                const isBotAdmin = bot?.admin === 'admin' || bot?.admin === 'superadmin'
                if (isBotAdmin) {
                    await this.groupParticipantsUpdate(m.chat, [actor], 'remove')
                }
            } catch (e) {}

            await this.sendMessage(m.chat, {
                text: `🚨 *KUDETA TERDETEKSI* 🚨\n\n@${actor.split('@')[0]} telah ditendang karena mengubah struktur admin tanpa izin!\n\n_Fitur keamanan oleh Benniismael_`,
                mentions: [actor]
            })
        }
    }
}

module.exports = handler
