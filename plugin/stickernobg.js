const { MessageType } = require('@adiwajshing/baileys')
const { sticker } = require('../lib/sticker')
axios=require("axios");fetch=require("node-fetch");
let handler = async (m, { conn, args, usedPrefix, command }) => {
  let stiker = false
  try {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''
    if (/image/.test(mime)) {
      let img = await q.download()
      if (!img) throw `balas gambar dengan caption *${usedPrefix + command}*`
      let imgbase64 = img.toString('base64')
      let data = await axios.post('https://salisganteng.pythonanywhere.com/api/remove-bg', {
          'api-key': 'salisheker',
          'image': imgbase64,
      })
      stiker = await sticker(false, data.data.image, global.packname, global.author)
    } else if (/webp/.test(mime)) {
      let img = await q.download()
      if (!img) throw `balas sticker dengan caption *${usedPrefix + command}*`
      let imgbase64 = img.toString('base64')
      let data = await axios.post('https://salisganteng.pythonanywhere.com/api/remove-bg', {
          'api-key': 'salisheker',
          'image': imgbase64,
      })
      stiker = await sticker(false,data.data.image, global.packname, global.author)
    } else if (args[0]) {
      if (isUrl(args[0]))
        var a = await fetch(args[0]).then(b=>b.buffer())
        var b = a.toString('base64')
        var c = await axios.post('https://salisganteng.pythonanywhere.com/api/remove-bg', {
          'api-key': 'salisheker',
          'image': b,
      })
        stiker = await sticker(false, c.data.image, global.packname, global.author)
      
    } else return m.reply('URL tidak valid!')
  } finally {
    if (stiker) conn.sendMessage(m.chat, stiker, MessageType.sticker, {
      quoted: m
    })
    else throw 'Conversion failed'
  }
}
handler.help = ['stickernobg']
handler.tags = ['sticker']
handler.command = /^stickernobg$/i

module.exports = handler

const isUrl = (text) => {
  return text.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)(jpe?g|gif|png|webp)/, 'gi'))
}
