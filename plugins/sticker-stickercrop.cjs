const sharp = require('sharp')
const { sticker } = require('../lib/sticker.cjs')

let handler = async (m, { conn }) => {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || q.mediaType || ''
    if (!/image/.test(mime)) throw 'Reply gambar dengan .stickercrop'

    await m.reply('_Memproses sticker..._')
    let img = await q.download()

    try {
        // 1. Hapus background putih (threshold)
        let cropped = await sharp(img)
            .flatten({ background: '#FFFFFF' })
            .resize(512, 512, { fit: 'inside', withoutEnlargement: true })
            .png()
            .toBuffer()

        // 2. Deteksi area non-putih (simple threshold)
        let { data, info } = await sharp(cropped)
            .raw()
            .toBuffer({ resolveWithObject: true })

        let minX = info.width, minY = info.height, maxX = 0, maxY = 0
        for (let y = 0; y < info.height; y++) {
            for (let x = 0; x < info.width; x++) {
                let idx = (y * info.width + x) * info.channels
                let r = data[idx], g = data[idx + 1], b = data[idx + 2]
                // anggap "putih" jika > 240
                if (!(r > 240 && g > 240 && b > 240)) {
                    if (x < minX) minX = x
                    if (y < minY) minY = y
                    if (x > maxX) maxX = x
                    if (y > maxY) maxY = y
                }
            }
        }

        let w = Math.max(1, maxX - minX)
        let h = Math.max(1, maxY - minY)

        // 3. Crop ke area objek + padding
        let pad = 20
        let cropX = Math.max(0, minX - pad)
        let cropY = Math.max(0, minY - pad)
        let cropW = Math.min(info.width - cropX, w + pad * 2)
        let cropH = Math.min(info.height - cropY, h + pad * 2)

        let final = await sharp(cropped)
            .extract({ left: cropX, top: cropY, width: cropW, height: cropH })
            .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
            .png()
            .toBuffer()

        let stiker = await sticker(final, global.packname, global.author)
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
