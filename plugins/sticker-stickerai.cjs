const sharp = require('sharp')
const { sticker } = require('../lib/sticker.cjs')

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `Contoh: ${usedPrefix + command} Halo Dunia | #FF00FF`
    let [teks, warnaHex] = text.split('|').map(v => v.trim())
    warnaHex = warnaHex || '#00FFFF'

    await m.reply('_Membuat sticker teks..._')

    try {
        // Buat SVG dengan gradient + glow
        let svg = `
        <svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:${warnaHex};stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#FF00FF;stop-opacity:1" />
                </linearGradient>
                <filter id="glow">
                    <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
                    <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>
            <rect width="512" height="512" fill="#000000" />
            <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle"
                  font-family="Arial Black, sans-serif" font-size="64" fill="url(#grad)"
                  filter="url(#glow)" font-weight="bold">${teks.replace(/[<>&]/g, '')}</text>
        </svg>`

        let png = await sharp(Buffer.from(svg)).png().toBuffer()
        let stiker = await sticker(png, global.packname, global.author)
        await conn.sendFile(m.chat, stiker, 'sticker.webp', '', m, false, { asSticker: true })
    } catch (e) {
        console.error(e)
        throw 'Gagal membuat sticker teks'
    }
}

handler.help = ['stickerai <teks>|<warna>']
handler.tags = ['sticker']
handler.command = /^stickerai$/i
module.exports = handler
