let fetch = require('node-fetch')
let handler = async (m, { conn, command, usedPrefix }) => {
  if (/^tod$/i.test(command)) {
    conn.sendButton(m.chat, 'Truth or Dare', 'BOTSTYLE', [
    ['Truth', `${usedPrefix}truth`],
    ['Dare', `${usedPrefix}dare`],
    ['RANDOM', `${pickRandom([`${usedPrefix}truth`, `${usedPrefix}dare`])}`]
  ], m)
  }
  if (/^truth$/i.test(command)) {
    let res = await fetch(global.API('botstyle', '/api/truth', {}, 'apikey'))
    let json = await res.json()
    if (json.result == "") throw json
    conn.sendButton(m.chat, json.result, 'BOTSTYLEE', [
    ['Truth', `${usedPrefix}truth`],
    ['Dare', `${usedPrefix}dare`]
], m)
  }
  if (/^dare$/i.test(command)) {
    let res = await fetch(global.API('botstyle','/api/dare', {}, 'apikey'))
    let json = await res.json()
    if (json.result == "") throw json
    conn.sendButton(m.chat, json.result, 'BOTSTYLEE', [
    ['Truth', `${usedPrefix}truth`],
    ['Dare', `${usedPrefix}dare`]
], m)


  }
}
handler.help = ['tod']
handler.tags = ['game']
handler.command = /^(tod|truth|dare)$/i

module.exports = handler

function pickRandom(list) {
  return list[Math.floor(list.length * Math.random())]
}
