const fetch = require('node-fetch')
const FormData = require('form-data')
const { MessageType } = require('@adiwajshing/baileys')

let handler  = async (m, { conn, text }) => {
  await m.reply('Sedang membuat...')
  if (text) conn.sendFile(m.chat, 'https://bsbt-api-rest.herokuapp.com/api/maker/attp?apikey=benniismaelapikey&text=' + encodeURIComponent(text), 'attp.webp', '', m, false, { asSticker: true })
  else throw 'Uhm...Teksnya?'
}
handler.help = ['attp <teks>']
handler.tags = ['creator']
handler.command = /^attp$/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = false
handler.private = false

handler.admin = false
handler.botAdmin = false

handler.fail = null
handler.limit = true

module.exports = handler
