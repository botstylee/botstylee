const sharp = require('sharp')
const { sticker } = require('../lib/sticker.cjs')

let handler = async (m, { conn }) => {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || q.mediaType || ''
    if (!/image/.test(mime)) throw 'Reply gambar dengan .stickerneon'

    await m.reply('_Membuat neon glow..._')
    let img = await q.download()

    try {
        // Buat glow dari gambar asli (blur + warna)
        let glow = await sharp(img)
            .resize(512, 512, { fit: 'cover' })
            .blur(20)
            .tint({ r: 0, g: 255, b: 255 })
            .png()
            .toBuffer()

        // Gabung glow + gambar asli
        let original = await sharp(img).resize(512, 512, { fit: 'cover' }).png().toBuffer()

        let final = await sharp({
            create: { width: 512, height: 512, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 1 } }
        })
            .composite([
                { input: glow, blend: 'screen' },
                { input: original, blend: 'over' }
            ])
            .png()
            .toBuffer()

        let stiker = await sticker(final, global.packname, global.author)
        await conn.sendFile(m.chat, stiker, 'sticker.webp', '', m, false, { asSticker: true })
    } catch (e) {
        console.error(e)
        throw 'Gagal membuat neon glow'
    }
}

handler.help = ['stickerneon']
handler.tags = ['sticker']
handler.command = /^stickerneon$/i
module.exports = handler
