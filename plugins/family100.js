let fetch = require('node-fetch')

let timeout = 120000
let poin = 4999
let handler  = async (m, { conn, usedPrefix }) => {
    conn.family100 = conn.family100 ? conn.family100 : {}
    let id = m.chat
    if (id in conn.family100) {
        conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.family100[id][0])
        throw false
    }
    let res = await fetch('https://bsbt-api-rest.herokuapp.com/api/kuis/family100?apikey=benniismael')
    let json = await res.json()
    conn.family100[id] = [
      await conn.reply(m.chat, `Soal: *${json.result.result.soal}*\nTimeout: *${(timeout / 1000).toFixed(2)} detik*\nKetik *${usedPrefix}hint family100* untuk hint\nBonus: ${poin} XP`, m),
      json, poin,
      setTimeout(() => {
        if (conn.family100[id]) conn.reply(m.chat, `Waktu habis!\n*${json.result.jawaban}*`, conn.family100[id][0])
        delete conn.family100[id]
      }, timeout)
    ]
  }
  handler.help = ['family100']
  handler.tags = ['game']
  handler.command = /^family100/i
  
  module.exports = handler
