let fetch = require('node-fetch')
//plugin by Samu330

let handler  = async (m, { conn, text }) => {
//let text = args.join` `
if (!text) return conn.reply(m.chat, 'Tidak ada teks untuk membuat logo', m)
let url = 'https://bsbt-api-rest.herokuapp.com/api/photooxy/coffe-cup?apikey=benniismael&text=' + encodeURIComponent(text)

conn.sendFile(m.chat, url, m)

}
handler.help = ['coffe']
handler.tags = ['creator']
handler.command = /^coffe?$/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = false
handler.private = false

handler.admin = false
handler.botAdmin = false

handler.fail = null

module.exports = handler
