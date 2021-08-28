let fetch = require('node-fetch')
let handler = async (m, { conn, command }) => {
  if (/^tod$/i.test(command)) {
    conn.send3Button(m.chat, 'Truth or Dare', 'BOTSTYLE', 'Truth', ',truth', 'Dare', ',dare', 'RANDOM', `${pickRandom([',dare', ',truth'])}`, m)
  }
  if (/^truth$/i.test(command)) {
    let res = await fetch(global.API('pencarikode', '/api/truthid', {}, 'apikey'))
    if (!res.ok) throw eror
    let json = await res.json()
    if (json.message == "") throw json
    conn.send2Button(m.chat, json.message, 'BOTSTYLE', 'Truth', ',truth', 'Dare', ',dare', m)

  }
  if (/^dare$/i.test(command)) {
    let res = await fetch(global.API('pencarikode', '/api/dareid', {}, 'apikey'))
    if (!res.ok) throw eror
    let json = await res.json()
    if (json.message == "") throw json
    conn.send2Button(m.chat, json.message, 'BOTSTYLE', 'Truth', ',truth', 'Dare', ',dare', m)

  }
}
handler.help = ['tod']
handler.tags = ['game']
handler.command = /^(tod|truth|dare)$/i

module.exports = handler

function pickRandom(list) {
  return list[Math.floor(list.length * Math.random())]
}
