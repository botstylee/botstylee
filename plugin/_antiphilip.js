let handler = m => m

let linkRegex = /📄.PHILIP_RASHAN                                                             📄.PHILIP_RASHAN/i

handler.before = function (m, { user, isAdmin, isBotAdmin }) {

  if (m.isBaileys && m.fromMe) throw false
  let chat = global.db.data.chats[m.chat]
  let name = this.getName(m.sender)
  let isGroupPhilip = linkRegex.exec(m.text)

  if (chat.antiPhilip && isGroupPhilip && !isAdmin && !m.isBaileys && m.isGroup && !m.fromMe) {
 m.reply(`*「 ANTI PHILIP 」*\n\nTerdeteksi *${name}* kamu telah mengirim PHILIP di group ini!\n\nMaaf Kamu akan dikick dari grup ini bangsat!`)
   this.groupRemove(m.chat, [m.sender])
  }
}
handler.group = true

module.exports = handler
