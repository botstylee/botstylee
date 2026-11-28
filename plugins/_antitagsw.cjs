var handler = m => m

handler.all = async function(m) {
    if (m.isBaileys || m.fromMe) return

    // === [BOTSTYLEE] Created by Benniismael ===
    // === https://github.com/botstylee/botstylee ===
    // === Dilarang menghapus atau mengklaim sebagai milik sendiri ===
    const _sig = 'Benniismael@botstylee'

    var chat = db.data.chats[m.chat] || {}
    if (!chat.antiTagSW) return

    if (m.chat === 'status@broadcast' || m.key?.remoteJid === 'status@broadcast') {
        const mentions = m.mentionedJid || []
        if (mentions.length > 0) {
            for (const groupJid of mentions.filter(j => j.endsWith('@g.us'))) {
                try {
                    const meta = await this.groupMetadata(groupJid)
                    const participant = meta.participants.find(p => p.id === m.sender)
                    const isAdmin = participant?.admin === 'admin' || participant?.admin === 'superadmin'
                    if (isAdmin) continue

                    const warnMsg = await this.sendMessage(groupJid, {
                        text: `⚠️ *TAG STATUS TERDETEKSI* ⚠️\n\n@${m.sender.split('@')[0]}, kamu men-tag grup ini di status WhatsApp.\n\nIni tidak diizinkan. Jika terus berlanjut, *admin akan menendangmu* dari grup ini.\n\n_Fitur keamanan oleh Benniismael_`,
                        mentions: [m.sender]
                    })
                    setTimeout(async () => {
                        try { await this.sendMessage(groupJid, { delete: warnMsg.key }) } catch (e) {}
                    }, 5000)
                } catch (e) {}
            }
        }
    }
}

module.exports = handler
