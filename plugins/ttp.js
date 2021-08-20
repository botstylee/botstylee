const fetch = require('node-fetch')
const FormData = require('form-data')
const { MessageType } = require('@adiwajshing/baileys')
const { sticker } = require('../lib/sticker.js')

let handler  = async (m, { conn, text }) => {
  if (text) {
    let res = await fetch('https://bsbt-api-rest.herokuapp.com/api/maker/ttp?apikey=benniismaelapikey&text=' + text)
    let json = await res.buffer()
    let stiker = await sticker(json, false, 'image/jpeg')
    conn.sendMessage(m.chat, stiker, MessageType.sticker, {
      quoted: m
    })
  } else m.reply('Textnya apa sayang?')
}
handler.help = ['ttp <teks>']
handler.tags = ['creator']
handler.command = /^ttp$/i

handler.fail = null

module.exports = handler
