const Canvacord = require('canvacord')
const uploadImage = require('../lib/uploadImage') 
const { sticker } = require('../lib/sticker')
const { MessageType } = require('@adiwajshing/baileys')

let handler = async (m, { conn, text }) => {
   if (!text && m.mentionedJid.length == 0) return m.reply('Tag member kak, contoh *#pptrigger @member*')
try {
linknya = await conn.getProfilePicture(m.mentionedJid[0])
baper = await require('node-fetch')(linknya).then(v => v.buffer())
let image = baper

Canvacord.Canvas.trigger(image)
  .then(async buffer => {
stik = await require('../lib/sticker').sticker(buffer, null, packname, author); conn.sendMessage(m.chat, stik, 'stickerMessage', { quoted: m })
  }) 
 } catch (e) {
   m.reply('Error || Mungkin karena foto profil orang tersebut private/depresi')
//m.reply(`${e}`)
  }
}
handler.help = ['pptrigger (@tag)']
handler.tags = ['sticker']
handler.command = /^pptrigger$/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = true
handler.private = false

handler.admin = false
handler.botAdmin = false

handler.fail = null

module.exports = handler
