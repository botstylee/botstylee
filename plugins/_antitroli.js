let handler = m => m

handler.all = async function (m) {
    if (m.message && m.isBaileys && m.quoted && m.quoted.mtype === 'orderMessage' && !(m.quoted.token && m.quoted.orderId)) {
        m.reply('Bug Troli Detected\n\n' + require('util').format(m.key))
        this.reply('6282114499086@s.whatsapp.net', `Pelaku pengirim bug troli @${m.sender.split`@`[0]}`, null, { contextInfo: { mentionedJid: [m.sender] } })
        if (m.isBotAdmin)
        this.groupRemove(m.chat, [m.sender])
        // await this.clearMessage(m.chat, m.key)
        await this.modifyChat(m.chat, 'clear', {
            includeStarred: false
        }).catch(console.log)
    }
}

module.exports = handler
