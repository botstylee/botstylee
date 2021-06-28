let handler = m => m

handler.before = function(m, { text }) {

  let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
  let username = conn.getName(who)
  let mentionedJid = [m.sender]
  let name = m.fromMe ? conn.user : conn.contacts[m.sender]
  let users = m.sender

    if (m.text > 📄.PHILIP_                                                             📄.PHILIP_) {
  this.reply(m.chat, '*「 ANTI Philip 」*\n\nTerdeteksi *${username}* telah mengirim Philip!\n\nMaaf Kamu akan dikick dari grup ini!', m)
     this.groupRemove(m.chat, [users])
  }
}
handler.group = true

module.exports = handler
