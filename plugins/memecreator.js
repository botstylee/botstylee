const uploadImage = require('../lib/uploadImage')
const { MessageType } = require('@adiwajshing/baileys')

let handler = async (m, { conn, text }) => {
  await m.reply(global.wait)
try {
  let [text1, text2] = text.split('|')
  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || ''
  if (!mime) throw 'Tidak ada foto'
  if (!/image\/(jpe?g|png)/.test(mime)) throw `Mime ${mime} tidak support`
  let img = await q.download()
  let url = await uploadImage(img)
  let meme = `https://docs-jojo.herokuapp.com/api/meme-gen?top=${text1}&bottom=${text2}&img=${url}`
  conn.sendFile(m.chat, meme, 'meme.jpg', '©Kuriyama-bot', m)
} catch (e) {
  m.reply('Conversion Failed')
  }
}

handler.help = ['memecreator <teks>|<teks>']
handler.tags = ['creator']
handler.command = /^(memecreator)$/i
handler.limit = true
handler.group = false
handler.register = true
module.exports = handler
