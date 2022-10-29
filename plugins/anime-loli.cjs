var fetch = require('node-fetch')
var handler = async(m, { conn }) => {
  var res = await fetch(global.API('botstyle', '/api/loli', {}, 'apikey'))

  if (!res.ok) throw await res.text()
  var json = await res.json()
  if (!json.result) throw 'Error!'
  conn.sendButton(m.chat, 'Ini lolinya kak', author, json.result, [['Loli', `.loli`]], m)
}
handler.help = ['loli']
handler.tags = ['anime']
handler.command = /^(loli)$/i

module.exports = handler
