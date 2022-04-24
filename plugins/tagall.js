let { MessageType } = require('@adiwajshing/baileys')

let handler = async (m, { conn, text, participants }) => {
	let user = global.DATABASE._data.users[m.sender]
/*     let [l, r] = text.split `|`
         if (!l) return conn.reply(m.chat, 'Silahkan masukan nama anda\ncontoh: *#tagall Udin|Woy nimbrunggg lah*', m)
    if (!r) return conn.reply(m.chat, 'Silahkan masukan pesan anda', m)*/

  let users = participants.map(u => u.jid)
//  conn.reply(m.chat, '*「 TAG ALL 」*\n\n*Nama:* ' + l +  '\n*Pesan:* ' + r +'\n\n' + users.map(v => '@' + v.replace(/@.+/, '')).join`\n`, m, {
  conn.reply(m.chat, '*「 TAG ALL 」*\n\n❖ ' + users.map(v => '@' + v.replace(/@.+/, '')).join`\n❖ `, m, {
    contextInfo: { mentionedJid: users }
 
  
})
}
handler.help = ['tagall']
handler.tags = ['group']
handler.command = /^tagall$/i
handler.owner = false 
handler.mods = false
handler.premium = false
handler.group = true
handler.private = false
handler.register = true

handler.admin = true
handler.botAdmin = false

handler.fail = null
handler.limit = true

module.exports = handler
