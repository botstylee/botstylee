const sharp = require('sharp')
const { sticker } = require('../lib/sticker.cjs')

let handler = async (m, { conn, args }) => {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || q.mediaType || ''
    if (!/image/.test(mime)) throw 'Reply gambar dengan .stickerpixel'

    let pixelSize = parseInt(args[0]) || 64
    if (pixelSize < 16) pixelSize = 16
    if (pixelSize > 128) pixelSize = 128

    await m.reply(`_Membuat pixel art ${pixelSize}px..._`)
    let img = await q.download()

    try {
        let png = await sharp(img)
            .resize(pixelSize, pixelSize, { fit: 'cover' })
            .resize(512, 512, { kernel: 'nearest' })
            .png()
            .toBuffer()

        let stiker = await sticker(png, global.packname, global.author)
        await conn.sendFile(m.chat, stiker, 'sticker.webp', '', m, false, { asSticker: true })
    } catch (e) {
        console.error(e)
        throw 'Gagal membuat pixel art'
    }
}

handler.help = ['stickerpixel [ukuran]']
handler.tags = ['sticker']
handler.command = /^stickerpixel$/i
module.exports = handler
