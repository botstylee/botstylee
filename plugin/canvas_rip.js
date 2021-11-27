const uploadImage = require('../lib/uploadImage')
const uploadFile = require('../lib/uploadFile')
const { sticker } = require('../lib/sticker')
const { MessageType } = require('@adiwajshing/baileys')

let handler = async (m, { conn, text }) => {
   if (!text && m.mentionedJid.length == 0) return m.reply('Tag member kak, contoh *#rip @member*')
try {
a = await conn.getProfilePicture(m.mentionedJid[0])
b = await require('node-fetch')(a).then(v => v.buffer())
c = await uploadImage(b).catch(e => uploadFile(b))
d = await (await fetch('https://tessyy-api.herokuapp.com/canvas/rip?url='+encodeURIComponent(c) )).buffer()
  m.reply('_Tunggu Sebentar. . ._')
  conn.sendFile(m.chat, d, 'image.png' , 'Berhasil Kill member hingga ke alam baka:v', m)
 } catch (e) {
   m.reply('Error || Mungkin foto profile orang tersebut depresi!')
  }
}
handler.help = ['rip (@tag)']
handler.tags = ['sticker']
handler.command = /^rip$/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = true
handler.private = false

handler.admin = false
handler.botAdmin = false

handler.fail = null

module.exports = handler
