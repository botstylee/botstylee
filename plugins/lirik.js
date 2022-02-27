let fetch = require('node-fetch')
let handler = async (m, { text, usedPrefix, command }) => {
  if (!text) throw `uhm.. cari apa sayang?\n\ncontoh:\n${usedPrefix + command} dandelions`
  let res = await fetch("https://bsbt-api-rest.herokuapp.com/api/lirik?judul="+text)
  if (!res.ok) throw await `${res.status} ${res.statusText}`
  let json = await res.json()
  //if (!json.status) 
  throw json
  //m.reply(json.result)
/**
*
* a = await fetch("https://tessyy-api.herokuapp.com/lirik?q="+text)
* if (await a.json()) throw "tidak dapat menemukan lirik tersebut"
* b = await a.text() 
* m.reply(b)
*
*/
}
handler.help = ['lirik'].map(v => v + ' <teks>')
handler.tags = ['internet']
handler.command = /^(lirik|lyrics?)$/i

module.exports = handler
