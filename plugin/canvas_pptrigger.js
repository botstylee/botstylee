const uploadImage = require('../lib/uploadImage')
const uploadFile = require('../lib/uploadFile')
const { sticker } = require('../lib/sticker')
const { MessageType } = require('@adiwajshing/baileys')

let handler = async (m, { conn, text }) => {
   if (!text && m.mentionedJid.length == 0) return m.reply('Tag member kak, contoh *#pptrigger @member*')
try {
a = await conn.getProfilePicture(m.mentionedJid[0])
b = await require('node-fetch')(a).then(v => v.buffer())
c = await uploadImage(b).catch(e => uploadFile(b))
d = await (await fetch('https://tessyy-api.herokuapp.com/canvas/jail?url='+encodeURIComponent(c) )).buffer()
e = await uploadImage(d).catch(e => uploadFile(d))
  m.reply('_Tunggu Sebentar. . ._')
  stiker = await sticker(false, e, 'I hope you\'re fine', 'wuis')
  await conn.sendMessage(m.chat, stiker, MessageType.sticker, { quoted: m })
 } catch (e) {
   m.reply('Error || Mungkin foto profile orang tersebut depresi!')
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
