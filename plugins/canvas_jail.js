const Canvacord = require('canvacord')
const uploadImage = require('../lib/uploadImage') 
const { sticker } = require('../lib/sticker')
const { MessageType } = require('@adiwajshing/baileys')

let handler = async (m, { conn, text }) => {
   if (!text && m.mentionedJid.length == 0) return m.reply('Tag member kak, contoh *#jail @member*')
try {
linknya = await conn.getProfilePicture(m.mentionedJid[0])
baper = await require('node-fetch')(linknya).then(v => v.buffer())
let image = baper

Canvacord.Canvas.jail(image)
  .then(async buffer => {
 conn.sendMessage(m.chat, buffer, 'imageMessage', { quoted: m, caption: '*Hehey boy, Tertangkap kau badut*'})
  }) 
 } catch (e) {
   m.reply('Error || Mungkin foto profile orang tersebut depresi!')
  }
}
handler.help = ['jail (@tag)']
handler.tags = ['sticker']
handler.command = /^jail$/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = true
handler.private = false

handler.admin = false
handler.botAdmin = false

handler.fail = null

module.exports = handler
