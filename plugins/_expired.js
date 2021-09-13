let handler = m => m
handler.before = async function (m) {

    if (m.isGroup && DATABASE.data.chats[m.chat].expired != 0) {
        if (new Date() * 1 >= DATABASE.data.chats[m.chat].expired) {
            this.reply(m.chat, `waktunya *${this.user.name}* untuk meninggalkan grup`, null).then(() => {
                this.sendContact(m.chat, owner[0], this.getName(owner[0] + '@s.whatsapp.net'), m).then(() => {
                    this.groupLeave(m.chat).then(() => {
                        DATABASE.data.chats[m.chat].expired = 0
                    })
                })
            })
        }
    }
}

module.exports = handler
