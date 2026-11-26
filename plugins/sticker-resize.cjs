// plugins/sticker-resize.cjs
// Fitur: Resize gambar (reply/caption) ke ukuran tertentu

const Jimp = require("jimp")
const uploadImage = require("../lib/uploadImage.cjs")

let handler = async (m, { conn, usedPrefix, args }) => {
    let toWidth = parseInt(args[0])
    let toHeight = parseInt(args[1])

    if (!toWidth) throw 'Masukkan lebar (width). Contoh: .resize 300 300'
    if (!toHeight) throw 'Masukkan tinggi (height). Contoh: .resize 300 300'
    if (isNaN(toWidth) || isNaN(toHeight)) throw 'Width dan height harus berupa angka.'
    if (toWidth < 1 || toHeight < 1) throw 'Width dan height harus lebih dari 0.'
    if (toWidth > 4000 || toHeight > 4000) throw 'Maksimal 4000x4000.'

    // Ambil media dari quoted atau pesan saat ini
    let quotedMsg = m.quoted ? m.quoted : m
    let mime = (quotedMsg.msg || quotedMsg).mimetype || ''
    if (!mime) throw 'Media tidak ditemukan. Reply gambar atau kirim dengan caption.'

    // Cek tipe media
    let isImage = /image\/(png|jpe?g|gif)/.test(mime)
    let isVideo = /video\/mp4/.test(mime)
    if (!isImage && !isVideo) throw `Tipe "${mime}" tidak didukung. Hanya gambar/video.`

    // Download media
    let media = await quotedMsg.download()
    if (!media) throw 'Gagal mengunduh media.'

    // Upload ke hosting untuk dapat URL
    let link = await uploadImage(media)

    // Baca gambar dengan Jimp
    let source
    try {
        source = await Jimp.read(media) // ✅ pakai buffer langsung, bukan URL
    } catch (e) {
        throw 'Gagal membaca gambar: ' + e.message
    }

    let before = {
        width: source.getWidth(),
        height: source.getHeight()
    }

    // Resize pakai conn.resize (sudah ada di lib/simple.js)
    // Fallback ke Jimp kalau conn.resize tidak tersedia
    let compressed
    if (typeof conn.resize === 'function') {
        compressed = await conn.resize(media, toWidth, toHeight)
    } else {
        compressed = await source
            .resize(toWidth, toHeight)
            .quality(90)
            .getBufferAsync(Jimp.MIME_JPEG)
    }

    // Upload hasil kompresi
    let linkCompressed = await uploadImage(compressed)

    // Susun caption
    let caption = `
• BEFORE
*+* Width : ${before.width}
*+* Height : ${before.height}

• AFTER
*+* Width : ${toWidth}
*+* Height : ${toHeight}

• LINK
*+* Original: ${link}
*+* Compressed: ${linkCompressed}`

    await conn.sendFile(m.chat, compressed, `resize_${toWidth}x${toHeight}.jpg`, caption.trim(), m)
}

handler.help = ['resize <width> <height> (reply|caption)']
handler.tags = ['sticker']
handler.command = /^(resize)$/i

module.exports = handler
