let fetch = require('node-fetch')

let timeout = 120000
let poin = 4999
let handler  = async (m, { conn, usedPrefix }) => {
    conn.tebakbendera = conn.tebakbendera ? conn.tebakbendera : {}
    let id = m.chat
    if (id in conn.tebakbendera) {
        conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tebakbendera[id][0])
        throw false
    }
    let res = await fetch('https://zahirr-web.herokuapp.com/api/kuis/tebakgambar?apikey=zahirgans')
    let json = await res.json()
    conn.tebakbendera[id] = [
      await conn.reply(m.chat, `Soal: *${json.result.soal}*\nTimeout: *${(timeout / 1000).toFixed(2)} detik*\nKetik *${usedPrefix}hint tebakbendera* untuk hint\nBonus: ${poin} XP`, m),
      json, poin,
      setTimeout(() => {
        if (conn.tebakbendera[id]) conn.reply(m.chat, `Waktu habis!\n*${json.result.deskripsi}*`, conn.tebakbendera[id][0])
        delete conn.tebakbendera[id]
      }, timeout)
    ]
  }
  handler.help = ['tebakbendera']
  handler.tags = ['game']
  handler.command = /^tebakbendera/i
  
  module.exports = handler
