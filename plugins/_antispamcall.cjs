var handler = m => m

const callMap = new Map()
const groupCallMap = new Map()

handler.all = async function(m) {
    if (m.isBaileys || m.fromMe) return

    // === [BOTSTYLEE] Created by Benniismael ===
    // === https://github.com/botstylee/botstylee ===
    // === Dilarang menghapus atau mengklaim sebagai milik sendiri ===
    const _sig = 'Benniismael@botstylee'

    if (m.messageStubType === 69 || m.messageStubType === 70) {
        const caller = m.sender
        const now = Date.now()

        let entry = callMap.get(caller)
        if (!entry || now - entry.first > 60000) {
            entry = { count: 0, first: now }
        }
        entry.count++
        callMap.set(caller, entry)

        let gEntry = groupCallMap.get(m.chat)
        if (!gEntry || now - gEntry.first > 60000) {
            gEntry = { count: 0, first: now, users: new Set() }
        }
        gEntry.count++
        gEntry.users.add(caller)
        groupCallMap.set(m.chat, gEntry)

        if (entry.count > 3 || gEntry.count > 5) {
            try {
                const meta = await this.groupMetadata(m.chat)
                const bot = meta.participants.find(p => p.id === this.user.jid)
                const isBotAdmin = bot?.admin === 'admin' || bot?.admin === 'superadmin'
                if (isBotAdmin) {
                    await this.groupParticipantsUpdate(m.chat, [caller], 'remove')
                }
            } catch (e) {}

            await this.sendMessage(m.chat, {
                text: `🚨 *SPAM CALL* 🚨\n\n@${caller.split('@')[0]} telah ditendang karena spam panggilan.\n\n_Fitur keamanan oleh Benniismael_`,
                mentions: [caller]
            })
            callMap.delete(caller)
            if (gEntry.count > 5) groupCallMap.delete(m.chat)
        }
    }
}

module.exports = handler
