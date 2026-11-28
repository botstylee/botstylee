const sharp = require('sharp')
const { sticker } = require('../lib/sticker.cjs')

let handler = async (m, { conn }) => {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || q.mediaType || ''
    if (!/image/.test(mime)) throw 'Reply gambar dengan .stickerglitch'

    await m.reply('_Membuat glitch effect..._')
    let img = await q.download()

    try {
        let { data, info } = await sharp(img)
            .resize(512, 512, { fit: 'cover' })
            .ensureAlpha()
            .raw()
            .toBuffer({ resolveWithObject: true })

        let out = Buffer.from(data)
        let shiftR = 10
        let shiftB = -10

        for (let y = 0; y < info.height; y++) {
            // Baris tertentu di-glitch (random)
            if (Math.random() > 0.7) {
                let rowShift = Math.floor(Math.random() * 30) - 15
                for (let x = 0; x < info.width; x++) {
                    let srcX = Math.min(info.width - 1, Math.max(0, x + rowShift))
                    let si = (y * info.width + srcX) * info.channels
                    let di = (y * info.width + x) * info.channels
                    out[di] = data[si]
                }
            }

            // Geser channel merah
            for (let x = 0; x < info.width; x++) {
                let srcXR = Math.min(info.width - 1, Math.max(0, x + shiftR))
                let siR = (y * info.width + srcXR) * info.channels
                let di = (y * info.width + x) * info.channels
                out[di] = data[siR]

                let srcXB = Math.min(info.width - 1, Math.max(0, x + shiftB))
                let siB = (y * info.width + srcXB) * info.channels
                out[di + 2] = data[siB + 2]
            }
        }

        let png = await sharp(out, { raw: { width: info.width, height: info.height, channels: info.channels } })
            .png()
            .toBuffer()

        let stiker = await sticker(png, global.packname, global.author)
        await conn.sendFile(m.chat, stiker, 'sticker.webp', '', m, false, { asSticker: true })
    } catch (e) {
        console.error(e)
        throw 'Gagal membuat glitch effect'
    }
}

handler.help = ['stickerglitch']
handler.tags = ['sticker']
handler.command = /^stickerglitch$/i
module.exports = handler
