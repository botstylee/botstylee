let handler = m => m
handler.before = async (m, { conn }) => {
    if (m.isGroup && global.DATABASE.data.chats[m.chat].expired != 0) {
        if (new Date() * 1 >= global.DATABASE.data.chats[m.chat].expired) {
            let users = (await conn.groupMetadata(m.chat)).participants.map(u => u.jid)
            conn.reply(m.chat, `waktunya *${conn.user.name}* untuk meninggalkan grup :(\n*Chat owner jika ingin sewa bot lagi*`, null, { contextInfo: { mentionedJid: users } }).then(() => {
                conn.sendContact(m.chat, '6282114499086', 'Benniismael', m).then(() => {
                    conn.groupLeave(m.chat).then(() => {
                        global.DATABASE.data.chats[m.chat].expired = 0
                    })
                })
            })
        }
    }
}
module.exports = handler
