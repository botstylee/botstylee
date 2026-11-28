const sharp = require('sharp')
const { sticker } = require('../lib/sticker.cjs')

let handler = async (m, { conn, text }) => {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || q.mediaType || ''
    if (!/image/.test(mime)) throw 'Reply gambar dengan .stickerframe <caption>'

    let caption = text || 'Memories'
    await m.reply('_Membuat polaroid..._')
    let img = await q.download()

    try {
        let innerSize = 460
        let frameSize = 512

        // Resize gambar ke inner
        let inner = await sharp(img)
            .resize(innerSize, innerSize, { fit: 'cover' })
            .png()
            .toBuffer()

        // Buat frame putih polaroid
        let frameSvg = `
        <svg width="${frameSize}" height="${frameSize}">
            <rect width="${frameSize}" height="${frameSize}" fill="white"/>
            <text x="${frameSize/2}" y="${frameSize - 20}" text-anchor="middle" 
                  font-family="Comic Sans MS, cursive" font-size="24" fill="#333">${caption.replace(/[<>&]/g, '')}</text>
        </svg>`
        let frame = await sharp(Buffer.from(frameSvg)).png().toBuffer()

        let final = await sharp(frame)
            .composite([{ input: inner, top: 26, left: 26 }])
            .png()
            .toBuffer()

        let stiker = await sticker(final, global.packname, global.author)
        await conn.sendFile(m.chat, stiker, 'sticker.webp', '', m, false, { asSticker: true })
    } catch (e) {
        console.error(e)
        throw 'Gagal membuat polaroid'
    }
}

handler.help = ['stickerframe <caption>']
handler.tags = ['sticker']
handler.command = /^stickerframe$/i
module.exports = handler
