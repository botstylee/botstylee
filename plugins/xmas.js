let util = require('util')
let path = require('path')
let { spawn } = require('child_process')

// Xmas Xteam
let handler  = async (m, { conn, text }) => {
  let d = new Date
  let tgl = d.toLocaleDateString('id-Id')
  let hari = d.toLocaleDateString('id-Id', { weekday: 'long' })
 text,
await conn.sendFile(m.chat, global.API('xteam', '/xmas', { text, }, 'APIKEY'), 'xmas.png', 'Nih udah jadi hasilnya sayang...\n *_Tetap Support:_* *BOTSTYLE*', m)
}
handler.help = ['xmas'].map(v => v + '<teks>')
handler.tags = ['creator']
handler.command = /^xmas$/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = true
handler.private = false

handler.admin = false
handler.botAdmin = false

handler.fail = null
handler.register = true

module.exports = handler
