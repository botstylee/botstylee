const Jimp = require('jimp')
const { sticker } = require('../lib/sticker.cjs')

let handler = async (m, { conn }) => {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || q.mediaType || ''
    if (!/image/.test(mime)) throw 'Reply gambar dengan .stickercrop'

    await m.reply('_Memproses sticker..._')
    let img = await q.download()

    try {
        let jimpImg = await Jimp.read(img)
        jimpImg.resize(512, Jimp.AUTO)

        // Deteksi area non-putih (simple threshold)
        let minX = jimpImg.bitmap.width, minY = jimpImg.bitmap.height
        let maxX = 0, maxY = 0

        jimpImg.scan(0, 0, jimpImg.bitmap.width, jimpImg.bitmap.height, function(x, y, idx) {
            let r = this.bitmap.data[idx + 0]
            let g = this.bitmap.data[idx + 1]
            let b = this.bitmap.data[idx + 2]
            if (!(r > 240 && g > 240 && b > 240)) {
                if (x < minX) minX = x
                if (y < minY) minY = y
                if (x > maxX) maxX = x
                if (y > maxY) maxY = y
            }
        })

        let w = Math.max(1, maxX - minX)
        let h = Math.max(1, maxY - minY)
        let pad = 20

        jimpImg.crop(
            Math.max(0, minX - pad),
            Math.max(0, minY - pad),
            Math.min(jimpImg.bitmap.width - Math.max(0, minX - pad), w + pad * 2),
            Math.min(jimpImg.bitmap.height - Math.max(0, minY - pad), h + pad * 2)
        )

        jimpImg.contain(512, 512, Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE)

        let buffer = await jimpImg.getBufferAsync(Jimp.MIME_PNG)
        let stiker = await sticker(buffer, global.packname, global.author)
        await conn.sendFile(m.chat, stiker, 'sticker.webp', '', m, false, { asSticker: true })
    } catch (e) {
        console.error(e)
        throw 'Gagal memproses gambar'
    }
}

handler.help = ['stickercrop']
handler.tags = ['sticker']
handler.command = /^stickercrop$/i
module.exports = handler
