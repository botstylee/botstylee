let handler = m => m
handler.before = async function (m) {
  let id = m.chat
  if (!m.quoted || !m.quoted.fromMe || !m.quoted.isBaileys || !/Ketik.*hint family100/i.test(m.quoted.text)) return
  conn.family100 = conn.family100 ? conn.family100 : {}
  if (!(id in conn.family100)) throw 'Soal itu telah berakhir!'
  if (m.quoted.id == conn.family100[id][0].id) {
    let json = JSON.parse(JSON.stringify(conn.family100[id][1]))
    // m.reply(JSON.stringify(json, null, '\t'))
    if (m.text.toLowerCase() == json.result.jawaban.toLowerCase()) {
      global.DATABASE._data.users[m.sender].exp += conn.family100[id][2]
      m.reply(`*Benar!*\n+${conn.family100[id][2]} XP`)
      clearTimeout(conn.family100[id][3])
      delete conn.family100[id]
    } else if (m.text.toLowerCase().endsWith(json.result.jawaban.split` `[1])) m.reply(`*Dikit Lagi!*`)
    else m.reply(`*Salah!*`)
  }
}
handler.exp = 0

module.exports = handler
