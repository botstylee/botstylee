const uploadImage = require('../lib/uploadImage')
const uploadFile = require('../lib/uploadFile')
let fetch = require('node-fetch')
let handler = async (m, { conn,usedPrefix, command, args ,text}) => {  
try {
  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || ''
  if (!mime) throw 'Tidak ada foto'
  if (!/image\/(jpe?g|png)|webp/.test(mime)) throw `Mime ${mime} tidak support`
  let img = await q.download()
  let url = await uploadImage(img).catch(e => uploadFile(img))
  let p = await (await fetch('https://tessyy-api.herokuapp.com/canvas/pixelate?url='+encodeURIComponent(url) )).buffer()
  m.reply('_Tunggu Sebentar. . ._')
  conn.sendFile(m.chat, p, 'image.png' , 'wuis!!', m)
  } catch (e) {
  m.reply (`apikey invalid atau server down`)
  } 
}
handler.help = ['pixel']
handler.tags = ['sticker']
handler.command = /^8bit|pixel|pixelate$/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = false
handler.private = false

handler.admin = false
handler.botAdmin = false

handler.fail = null

module.exports = handler
