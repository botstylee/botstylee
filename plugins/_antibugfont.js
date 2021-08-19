let handler = m => m

let linkRegex = /ℛ/i

handler.before = function (m, { user, isAdmin, isBotAdmin }) {

  if (m.isBaileys && m.fromMe) throw false
  let chat = global.DATABASE.data.chats[m.chat]
  let name = this.getName(m.sender)
  let Font = linkRegex.exec(m.text)

  if (chat.antiBugfont && Font) {
 m.reply(`*「 ANTI BUG ℛ 」*\n\nTerdeteksi *${name}* bocah telah mengirim bug ℛ !\n\nMaaf Bocah Bug ℛ Tidak Berguna Bagi Bot!`)
   await this.modifyChat(m.chat, 'clear', {
            includeStarred: false
        }).catch(console.log)
  }
}

module.exports = handler
