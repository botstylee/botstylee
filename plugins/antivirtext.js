let handler = m => m

let linkRegex = /৭৭৭|๒๒๒|؋.ᄻ.ྜྷ.ᇸ.ྙ|๖ۣۜy๖ۣۜF๖ۣۜr๖|๑๑๑|৭৭৭৭৭৭৭৭|๑๑๑๑๑๑๑๑|ผิดุท้่เึางืผิดุท้่เึางื|๒๒๒๒๒๒๒๒|ผิดุท้่เึางืผิดุท้่เึางื/i

handler.before = function (m, { user, isAdmin, isBotAdmin }) {

  if (m.isBaileys && m.fromMe) throw false
  let chat = global.DATABASE.data.chats[m.chat]
  let name = this.getName(m.sender)
  let isGroupVirtex = linkRegex.exec(m.text)

  if (chat.antiVirtext && isGroupVirtex) {
 m.reply(`*「 ANTI VIRTEXT 」*\n\nTerdeteksi *${name}* bocah telah mengirim Virtext !\n\nMaaf Bocah Virtext Tidak Berguna Bagi Bot!`)
  this.groupRemove(m.chat, [m.sender])
    }
}

module.exports = handler
