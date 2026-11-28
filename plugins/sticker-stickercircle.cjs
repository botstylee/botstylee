const sharp = require('sharp')
const { sticker } = require('../lib/sticker.cjs')

let handler = async (m, { conn }) => {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || q.mediaType || ''
    if (!/image/.test(mime)) throw 'Reply gambar dengan .stickercircle'

    await m.reply('_Membuat sticker lingkaran..._')
    let img = await q.download()

    try {
        let size = 512
        let border = 20

        let circleSvg = `
        <svg width="${size}" height="${size}">
            <defs>
                <clipPath id="circle">
                    <circle cx="${size/2}" cy="${size/2}" r="${size/2 - border}"/>
                </clipPath>
            </defs>
            <circle cx="${size/2}" cy="${size/2}" r="${size/2 - border/2}" fill="none" stroke="#FFD700" stroke-width="${border}"/>
            <image href="data:image/png;base64,${(await sharp(img).resize(size, size, { fit: 'cover' }).png().toBuffer()).toString('base64')}" 
                   width="${size}" height="${size}" clip-path="url(#circle)"/>
        </svg>`

        let png = await sharp(Buffer.from(circleSvg)).png().toBuffer()

        let stiker = await sticker(png, global.packname, global.author)
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
