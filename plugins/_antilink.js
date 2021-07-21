let handler = m => m

let linkRegex = /chat.whatsapp.com\/([0-9A-Za-z]{20,24})/i

handler.before = function (m, { user, isAdmin, isBotAdmin }) {

  if (m.isBaileys && m.fromMe) throw false
  let chat = global.DATABASE.data.chats[m.chat]
  let name = this.getName(m.sender)
  let link = linkRegex.exec(m.text)

  if (chat.antiLink && link && !isAdmin && !m.isBaileys && m.isGroup && !m.fromMe) {
 m.reply(`*「 ANTI LINK 」*\n\nTerdeteksi *${name}* kamu telah mengirim link group!\n\nMaaf Kamu akan dikick dari grup ini bangsat!`)
   this.groupRemove(m.chat, [m.sender])
  }
}
handler.group = true

module.exports = handler
