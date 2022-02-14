const { MessageType } = require('@adiwajshing/baileys')
const fetch = require('node-fetch')

let handler = async (m, { conn }) => {
    try {
      await m.reply(global.wait)
        let res = await fetch(global.API('xteam', '/randomimage/wallpaper', {}, 'APIKEY'))
        let img = await res.buffer()
        await conn.sendButtonImg(m.chat, img, 'Random Anime Picture', '© Botstylee', 'N e x t', '#wpanime', m)
    } catch (e) {
        console.log(e)
        throw '_*Owner belum membayar tagihan fitur ini*_'
    }
}
handler.help = ['wallpaperanime','wpanime']
handler.tags = ['internet']
handler.command = /^(wallpaper|wp)anime$/i
handler.limit = true

module.exports = handler
