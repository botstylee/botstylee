const sharp = require('sharp')
const { sticker } = require('../lib/sticker.cjs')

let handler = async (m, { conn }) => {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || q.mediaType || ''
    if (!/image/.test(mime)) throw 'Reply gambar dengan .stickerwave'

    await m.reply('_Membuat sticker gelombang..._')
    let img = await q.download()

    try {
        let { data, info } = await sharp(img)
            .resize(512, 512, { fit: 'cover' })
            .ensureAlpha()
            .raw()
            .toBuffer({ resolveWithObject: true })

        let out = Buffer.alloc(data.length)
        let amp = 20
        let freq = 0.05

        for (let y = 0; y < info.height; y++) {
            let offset = Math.round(Math.sin(y * freq) * amp)
            for (let x = 0; x < info.width; x++) {
                let srcX = Math.min(info.width - 1, Math.max(0, x + offset))
                let si = (y * info.width + srcX) * info.channels
                let di = (y * info.width + x) * info.channels
                out[di] = data[si]
                out[di + 1] = data[si + 1]
                out[di + 2] = data[si + 2]
                out[di + 3] = data[si + 3]
            }
        }

        let png = await sharp(out, { raw: { width: info.width, height: info.height, channels: info.channels } })
            .png()
            .toBuffer()

        let stiker = await sticker(png, global.packname, global.author)
        await conn.sendFile(m.chat, stiker, 'sticker.webp', '', m, false, { asSticker: true })
    } catch (e) {
        console.error(e)
        throw 'Gagal membuat sticker gelombang'
    }
}

handler.help = ['stickerwave']
handler.tags = ['sticker']
handler.command = /^stickerwave$/i
module.exports = handler
