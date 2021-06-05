let fetch = require('node-fetch')

let timeout = 120000
let poin = 2500
let handler  = async (m, { conn, usedPrefix }) => {
    conn.tebaktebakan = conn.tebaktebakan ? conn.tebaktebakan : {}
    let id = m.chat
    if (id in conn.tebaktebakan) {
        conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tebaktebakan[id][0])
        throw false
    }
    let res = await fetch(global.API('xteam', '/game/tebaktebakan', {}, 'APIKEY'))
    if (res.status !== 200) throw await res.text()
    let json = await res.json()
    if (!json.status) throw json
    let caption = `
*「 Tebak-tebakan 」*
${json.result.level}
Soal: "${json.result.soal}"
Timeout *${(timeout / 1000).toFixed(2)} detik*
Ketik *${usedPrefix}tthint* untuk bantuan
Bonus: Rp${poin}
    `.trim()
    conn.tebaktebakan[id] = [
      await conn.reply(m.chat, caption, m),
      json, poin,
      setTimeout(() => {
        if (conn.tebaktebakan[id]) conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.result.jawaban}*`, conn.tebaktebakan[id][0])
        delete conn.tebaktebakan[id]
      }, timeout)
    ]
  }
  handler.help = ['tebaktebakan']
  handler.tags = ['game']
  handler.command = /^tebaktebakan/i
  
  module.exports = handler
