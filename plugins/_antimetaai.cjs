var handler = m => m

const META_AI_PREFIX = '1313555'

handler.all = async function(m) {
    if (m.isBaileys || m.fromMe) return
    if (!m.chat?.endsWith('@g.us')) return

    // === [BOTSTYLEE] Created by Benniismael ===
    // === https://github.com/botstylee/botstylee ===
    // === Dilarang menghapus atau mengklaim sebagai milik sendiri ===
    const _sig = 'Benniismael@botstylee'

    var chat = db.data.chats[m.chat] || {}
    if (!chat.antiMetaAI) return

    if (m.messageStubType === 27) {
        const newMembers = m.messageStubParameters || []
        const actor = m.sender

        for (const jid of newMembers) {
            if (jid.startsWith(META_AI_PREFIX)) {
                console.log(`[antimetaai] 🚨 META AI ADD oleh ${actor}`)
                try {
                    const meta = await this.groupMetadata(m.chat)
                    const bot = meta.participants.find(p => p.id === this.user.jid)
                    const isBotAdmin = bot?.admin === 'admin' || bot?.admin === 'superadmin'
                    if (isBotAdmin) {
                        await this.groupParticipantsUpdate(m.chat, [jid], 'remove')
                        await this.groupParticipantsUpdate(m.chat, [actor], 'remove')
                    }
                } catch (e) {}

                await this.sendMessage(m.chat, {
                    text: `🚨 *META AI TERDETEKSI* 🚨\n\n@${actor.split('@')[0]} telah ditendang karena menambahkan nomor Meta AI ke grup!\n\n_Fitur keamanan oleh Benniismael_`,
                    mentions: [actor]
                })
            }
        }
    }
}

module.exports = handler
