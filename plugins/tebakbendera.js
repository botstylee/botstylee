let fetch = require('node-fetch')

let timeout = 100000
let poin = 4999
let handler  = async (m, { conn, usedPrefix }) => {
    conn.tebakbendera = conn.tebakbendera ? conn.tebakbendera : {}
    let id = m.chat
    if (id in conn.tebakbendera) {
        conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tebakbendera[id][0])
        throw false
    }
    let res = await fetch(global.API('botstyle', '/api/tebakbendera', {}, 'apikey'))
    let json = await res.json()
    let caption = `
*「 Tebak Bendera 」*

"${json.bendera} Bendera negara manakah ini ?"

Timeout *${(timeout / 1000).toFixed(2)} detik*
Ketik *${usedPrefix}tbhint* untuk bantuan
Bonus: ${poin} XP
`.trim()
    conn.tebakbendera[id] = [
      await conn.sendButton(m.chat, caption, '© Botstylee', 'Bantuan', `.tbhint`, m), 
      json, poin, 
      setTimeout(() => { 
               if (conn.tebakbendera[id]) conn.sendButton(m.chat, `Waktu habis!\nJawabannya adalah *${json.jawaban}*`, '© Botstylee', 'Tebak Bendera', `.tebakbendera`, conn.tebakbendera[id][0]) 
               delete conn.tebakbendera[id]
       }, timeout)
    ]
  }
  handler.help = ['tebakbendera']
  handler.tags = ['game']
  handler.command = /^tebakbendera/i
  
  module.exports = handler
