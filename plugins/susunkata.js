let fetch = require('node-fetch')

let timeout = 120000
let poin = 2500
let handler  = async (m, { conn, usedPrefix }) => {
    conn.susunkata = conn.susunkata ? conn.susunkata : {}
    let id = m.chat
    if (id in conn.susunkata) {
        conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.susunkata[id][0])
        throw false
    }
    let res = await fetch(global.API('xteam', '/game/susunkata', {}, 'APIKEY'))
    if (res.status !== 200) throw await res.text()
    let json = await res.json()
    if (!json.status) throw json
    let caption = `
*「 Susun Kata 」*
${json.result.level}
Soal: "${json.result.soal}"
Timeout *${(timeout / 1000).toFixed(2)} detik*
Ketik *${usedPrefix}skhint* untuk bantuan
Bonus: Rp${poin}
    `.trim()
    conn.susunkata[id] = [
      await conn.reply(m.chat, caption, m),
      json, poin,
      setTimeout(() => {
        if (conn.susunkata[id]) conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.result.jawaban}*`, conn.susunkata[id][0])
        delete conn.susunkata[id]
      }, timeout)
    ]
  }
  handler.help = ['susunkata']
  handler.tags = ['game']
  handler.command = /^susunkata/i
  
  
  module.exports = handler
