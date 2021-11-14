const { MessageType } = require('@adiwajshing/baileys')
const { sticker } = require('../lib/sticker')
let handler = async (m, { conn, text }) => {
if (text.length>7) throw 'Maksimal 7 huruf'
if (!text) text = await conn.getName(m.sender)
await m.reply(global.wait)
  let apiUrl = global.API( 'http://hardianto-chan.herokuapp.com', '/api/bot/gura', {
    apikey: 'hardianto',
    nama: text
  })
try {
    let stiker = await sticker(null, apiUrl, 'Guraa', global.author)
    await conn.sendMessage(m.chat, stiker, MessageType.sticker, {
      quoted: m
    })
  } catch (e) {
    m.reply('Conversion failed')
    await conn.sendFile(m.chat, apiUrl, 'image.png', null, m)
  }
}
handler.help = ['gura <text>']
handler.tags = ['sticker']
handler.command = /^sgura$/i
handler.register = true
handler.limit = true
// Semoga di acc  >\\< //
module.exports = handler
