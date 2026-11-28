const Jimp = require('jimp')
const { sticker } = require('../lib/sticker.cjs')

let handler = async (m, { conn }) => {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || q.mediaType || ''
    if (!/image/.test(mime)) throw 'Reply gambar dengan .stickercircle'

    await m.reply('_Membuat sticker lingkaran..._')
    let img = await q.download()

    try {
        let jimpImg = await Jimp.read(img)
        jimpImg.resize(512, 512, Jimp.RESIZE_BILINEAR)

        let circle = await Jimp.read(512, 512)
        circle.scan(0, 0, 512, 512, function(x, y, idx) {
            let dx = x - 256
            let dy = y - 256
            let dist = Math.sqrt(dx * dx + dy * dy)
            if (dist > 240) {
                this.bitmap.data[idx + 3] = 0
            }
        })

        jimpImg.mask(circle, 0, 0)

        // Border emas
        let border = await Jimp.read(512, 512)
        border.scan(0, 0, 512, 512, function(x, y, idx) {
            let dx = x - 256
            let dy = y - 256
            let dist = Math.sqrt(dx * dx + dy * dy)
            if (dist > 236 && dist < 256) {
                this.bitmap.data[idx + 0] = 255
                this.bitmap.data[idx + 1] = 215
                this.bitmap.data[idx + 2] = 0
                this.bitmap.data[idx + 3] = 255
            } else {
                this.bitmap.data[idx + 3] = 0
            }
        })

        let final = new Jimp(512, 512, 0x00000000)
        final.composite(border, 0, 0)
        final.composite(jimpImg, 0, 0)

        let buffer = await final.getBufferAsync(Jimp.MIME_PNG)
        let stiker = await sticker(buffer, global.packname, global.author)
        await conn.sendFile(m.chat, stiker, 'sticker.webp', '', m, false, { asSticker: true })
    } catch (e) {
        console.error(e)
        throw 'Gagal membuat sticker lingkaran'
    }
}

handler.help = ['stickercircle']
handler.tags = ['sticker']
handler.command = /^stickercircle$/i
module.exports = handler
