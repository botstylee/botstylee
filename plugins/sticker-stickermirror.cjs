const Jimp = require('jimp')
const { sticker } = require('../lib/sticker.cjs')

let handler = async (m, { conn }) => {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || q.mediaType || ''
    if (!/image/.test(mime)) throw 'Reply gambar dengan .stickermirror'

    await m.reply('_Membuat sticker refleksi..._')
    let img = await q.download()

    try {
        let jimpImg = await Jimp.read(img)
        let w = 512
        let h = Math.round((jimpImg.bitmap.height / jimpImg.bitmap.width) * w)
        jimpImg.resize(w, h)

        let top = jimpImg.clone()
        let bottom = jimpImg.clone().flip(false, true)

        // Fade bottom (kurangi opacity secara bertahap)
        bottom.scan(0, 0, w, h, function(x, y, idx) {
            let alpha = Math.max(0, 1 - (y / h)) * 255
            this.bitmap.data[idx + 3] = Math.min(this.bitmap.data[idx + 3], alpha)
        })

        let final = new Jimp(w, h * 2, 0x00000000)
        final.composite(top, 0, 0)
        final.composite(bottom, 0, h)

        let buffer = await final.getBufferAsync(Jimp.MIME_PNG)
        let stiker = await sticker(buffer, global.packname, global.author)
        await conn.sendFile(m.chat, stiker, 'sticker.webp', '', m, false, { asSticker: true })
    } catch (e) {
        console.error(e)
        throw 'Gagal membuat sticker refleksi'
    }
}

handler.help = ['stickermirror']
handler.tags = ['sticker']
handler.command = /^stickermirror$/i
module.exports = handler
