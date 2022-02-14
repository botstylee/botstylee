const { MessageType } = require('@adiwajshing/baileys')
const fetch = require('node-fetch')

let handler = async (m, { conn }) => {
    try {
      await m.reply(global.wait)
        let res = await fetch(global.API('xteam', '/randomimage/husbu2', {}, 'APIKEY'))
        let img = await res.buffer()
       await conn.sendButtonImg(m.chat, img, 'Random Husbu', '© シエル', 'N e x t', '#husbu', m)
        
    } catch (e) {
        console.log(e)
        throw '_*Owner belum membayar tagihan fitur ini*_'
    }
}
handler.help = ['husbu']
handler.tags = ['internet']
handler.command = /^(husbu)$/i
handler.limit = true

module.exports = handler
