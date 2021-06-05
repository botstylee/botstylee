let handler = m => m
handler.before = async function (m) {
  let id = m.chat
  if (!m.quoted || !m.quoted.fromMe || !m.quoted.isBaileys || !/「 Tebak-tebakan 」/i.test(m.quoted.text)) return !0
  conn.tebaktebakan = conn.tebaktebakan ? conn.tebaktebakan : {}
  if (!(id in conn.tebaktebakan)) return m.reply('Soal itu telah berakhir')
  if (m.quoted.id == conn.tebaktebakan[id][0].id) {
    let json = JSON.parse(JSON.stringify(conn.tebaktebakan[id][1]))
    // m.reply(JSON.stringify(json, null, '\t'))
    if (m.text.toLowerCase() == json.result.jawaban.toLowerCase()) {
      global.DATABASE._data.users[m.sender].uang += conn.tebaktebakan[id][2]
      m.reply(`*Benar!*\n+Rp${conn.tebaktebakan[id][2]}`)
      clearTimeout(conn.tebaktebakan[id][3])
      delete conn.tebaktebakan[id]
    } else if (m.text.toLowerCase().endsWith(json.result.jawaban.split` `[1])) m.reply(`*Dikit Lagi!*`)
    else m.reply(`*Salah!*`)
  }
}
handler.exp = 0

module.exports = handler
