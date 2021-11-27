const uploadImage = require('../lib/uploadImage')
const uploadFile = require('../lib/uploadFile')
const { sticker } = require('../lib/sticker')
const { MessageType } = require('@adiwajshing/baileys')

let handler = async (m, { conn, text }) => {
  await m.reply(global.wait)
try {
  let [text1, text2] = text.split('|')
  if (!text1) text1 = ' '
  if (!text2) text2 = ' '
  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || ''
  if (!mime) throw 'Tidak ada foto'
  if (!/image\/(jpe?g|png)/.test(mime)) throw `Mime ${mime} tidak support`
  let img = await q.download()
  let url = await uploadImage(img).catch(e => uploadFile(img))
  let meme = global.API('https://api.memegen.link', `/images/custom/${encodeURIComponent(text1)}/${encodeURIComponent(text2)}.png`, {
    background: url })
  let stiker = await sticker(null, meme, 'Sticker Meme', '@Kokoronationz')
  conn.sendMessage(m.chat, stiker, MessageType.sticker, {
    quoted: m
  })
 } catch (e) {
  }
}

handler.help = ['stickermeme <teks>|<teks>']
handler.tags = ['creator']
handler.command = /^(s(tic?ker)?meme)$/i
handler.limit = true
handler.group = false
handler.register = true
module.exports = handler
