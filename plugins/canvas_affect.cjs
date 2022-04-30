const uploadImage = require('../lib/uploadImage.cjs')
const uploadFile = require('../lib/uploadFile.cjs')
let handler = async (m, { conn,usedPrefix, command, args ,text}) => {  
try {
  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || q.mediaType || ''
  if (!/webp|image/g.test(mime)) throw `balas gambar/stiker dengan perintah ${usedPrefix + command}`
  let img = await q.download?.()
  let url = await uploadImage(img).catch(e => uploadFile(img))
  let p = await (await fetch('https://tessyy-api.herokuapp.com/canvas/affect?url='+encodeURIComponent(url) )).buffer()
  m.reply('_Tunggu Sebentar. . ._')
  conn.sendFile(m.chat, p, 'image.png' , 'wuis!!', m)
  } catch (e) {
  m.reply (`apikey invalid atau server down`)} 
}
handler.help = ['affect']
handler.tags = ['canvascord']
handler.command = /^affect$/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = false
handler.private = false

handler.admin = false
handler.botAdmin = false

handler.fail = null

module.exports = handler
