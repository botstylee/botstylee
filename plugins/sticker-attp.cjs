var axios = require('axios')
var cheerio = require('cheerio')
var { sticker } = require('../lib/sticker.cjs')

var handler = async (m, { conn, text }) => {
    var teks = text ? text : m.quoted && m.quoted.text ? m.quoted.text : m.text
    if (!teks) return conn.reply(m.chat, 'Harap masukkan teksnya!', m)

    try {
        await m.reply('Tunggu sebentar...')

        // 1. Ambil URL gambar dari bloggif
        var imageUrl = await attp(teks)
        console.log('[attp] URL hasil:', imageUrl)

        // 2. Buat sticker dari gambar tersebut
        var stiker = await sticker(imageUrl, global.packname, global.author)
        if (!stiker) throw new Error('Gagal membuat sticker')

        // 3. Kirim sticker
        await conn.sendFile(m.chat, stiker, 'attp.webp', '', m, false, {
            asSticker: true
        })

    } catch (e) {
        console.error('[attp] Error:', e.message)
        throw 'emror bruh (scraper error)'
    }
}

handler.help = ['attp *teks*']
handler.tags = ['sticker']
handler.command = /^attp$/i

module.exports = handler

// Fungsi attp (diperbaiki: pakai axios, bukan request)
var attp = async (text) => {
    // 1. Ambil ID form dari bloggif
    var getid = await axios.get('https://id.bloggif.com/text')
    var id = cheerio.load(getid.data)('form').attr('action')

    // 2. Kirim data ke form
    var formData = new URLSearchParams()
    formData.append('target', '1')
    formData.append('text', text)
    formData.append('glitter_id', Math.floor(Math.random() * 2821))
    formData.append('font_id', 'lucida_sans_demibold_roman')
    formData.append('size', '50')
    formData.append('bg_color', 'FFFFFF')
    formData.append('transparent', '1')
    formData.append('border_color', '000000')
    formData.append('border_width', '2')
    formData.append('shade_color', '000000')
    formData.append('shade_width', '1')
    formData.append('angle', '0')
    formData.append('text_align', 'center')

    var response = await axios.post(`https://id.bloggif.com${id}`, formData, {
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36'
        }
    })

    // 3. Parse HTML hasil untuk ambil link gambar
    var $ = cheerio.load(response.data)
    var url = $('.box.center > a').attr('href')
    if (!url) throw new Error('URL hasil tidak ditemukan')

    return 'https://id.bloggif.com' + url
}
