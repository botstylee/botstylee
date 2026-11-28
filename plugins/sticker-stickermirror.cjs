const sharp = require('sharp')
const { sticker } = require('../lib/sticker.cjs')

let handler = async (m, { conn }) => {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || q.mediaType || ''
    if (!/image/.test(mime)) throw 'Reply gambar dengan .stickermirror'

    await m.reply('_Membuat sticker refleksi..._')
    let img = await q.download()

    try {
        let meta = await sharp(img).metadata()
        let w = 512
        let h = Math.round((meta.height / meta.width) * w)

        // Gambar asli
        let top = await sharp(img).resize(w, h).png().toBuffer()

        // Refleksi: flip vertikal
        let bottom = await sharp(img).resize(w, h).flip().png().toBuffer()

        // Overlay gradient fade di refleksi
        let fadeSvg = `
        <svg width="${w}" height="${h}">
            <defs>
                <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#000" stop-opacity="0.6"/>
                    <stop offset="100%" stop-color="#000" stop-opacity="0"/>
                </linearGradient>
            </defs>
            <rect width="${w}" height="${h}" fill="url(#fade)"/>
        </svg>`
        let fade = await sharp(Buffer.from(fadeSvg)).png().toBuffer()

        let bottomFaded = await sharp(bottom)
            .composite([{ input: fade, blend: 'dest-in' }])
            .png()
            .toBuffer()

        // Gabung atas + bawah
        let final = await sharp({
            create: {
                width: w,
                height: h * 2,
                channels: 4,
                background: { r: 0, g: 0, b: 0, alpha: 0 }
            }
        })
            .composite([
                { input: top, top: 0, left: 0 },
                { input: bottomFaded, top: h, left: 0 }
            ])
            .png()
            .toBuffer()

        let stiker = await sticker(final, global.packname, global.author)
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
