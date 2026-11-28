const sharp = require('sharp')
const { sticker } = require('../lib/sticker.cjs')

let handler = async (m, { conn }) => {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || q.mediaType || ''
    if (!/image/.test(mime)) throw 'Reply salah satu gambar dengan .stickercollage\nPastikan kamu kirim 2-4 gambar di chat ini.'

    // Ambil semua gambar di chat (dari cache pesan)
    let images = []
    let chatMessages = Object.values(global.msgCache || {})
        .filter(msg => msg.key?.remoteJid === m.chat && /image/.test(msg.message?.imageMessage ? 'image' : ''))
        .slice(-4) // ambil 4 terakhir

    if (chatMessages.length < 2) throw 'Kirim minimal 2 gambar dulu, lalu reply salah satunya dengan .stickercollage'

    await m.reply(`_Membuat kolase dari ${chatMessages.length} gambar..._`)

    try {
        // Download semua gambar
        for (let msg of chatMessages) {
            try {
                let buf = await conn.downloadM(msg.message.imageMessage, 'image')
                if (buf && buf.length) images.push(buf)
            } catch (e) { /* skip */ }
        }

        if (images.length < 2) throw 'Gagal mendownload gambar'

        // Tentukan layout grid
        let cols = images.length <= 2 ? 2 : 2
        let rows = Math.ceil(images.length / cols)
        let cellSize = 512 / cols
        let finalSize = 512

        // Resize tiap gambar ke cellSize x cellSize
        let processed = await Promise.all(images.map(async (buf, i) => {
            return await sharp(buf)
                .resize(cellSize, cellSize, { fit: 'cover' })
                .png()
                .toBuffer()
        }))

        // Gabungkan ke kanvas
        let composites = processed.map((buf, i) => {
            let x = (i % cols) * cellSize
            let y = Math.floor(i / cols) * cellSize
            return { input: buf, top: y, left: x }
        })

        let collage = await sharp({
            create: {
                width: finalSize,
                height: finalSize,
                channels: 4,
                background: { r: 255, g: 255, b: 255, alpha: 1 }
            }
        })
            .composite(composites)
            .png()
            .toBuffer()

        // Tambah sudut membulat
        let rounded = await sharp(collage)
            .composite([{
                input: Buffer.from(`<svg width="${finalSize}" height="${finalSize}"><rect width="${finalSize}" height="${finalSize}" rx="40" ry="40" fill="white"/></svg>`),
                blend: 'dest-in'
            }])
            .png()
            .toBuffer()

        let stiker = await sticker(rounded, global.packname, global.author)
        await conn.sendFile(m.chat, stiker, 'sticker.webp', '', m, false, { asSticker: true })
    } catch (e) {
        console.error(e)
        throw 'Gagal membuat kolase'
    }
}

handler.help = ['stickercollage']
handler.tags = ['sticker']
handler.command = /^stickercollage$/i
module.exports = handler
