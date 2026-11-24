const { download } = require('@silent-tech-offc/ttdl')

const handler = async (m, { conn, args, usedPrefix, command }) => {
    // 1. Validasi input URL
    if (!args[0]) {
        return m.reply(`Mana link TikTok-nya?\n\nContoh:\n*${usedPrefix + command} https://vt.tiktok.com/xxxx*`)
    }
    if (!/tiktok\.com/i.test(args[0])) {
        return m.reply('Link tidak valid! Pastikan itu link TikTok.')
    }

    // 2. Reaksi loading
    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })

    try {
        // 3. Ambil data video menggunakan library @silent-tech-offc/ttdl
        const data = await download(args[0])

        // 4. Validasi hasil
        if (!data.videoNoWatermark) {
            throw new Error('Gagal menemukan link video tanpa watermark.')
        }

        // 5. Kirim video
        await conn.sendFile(
            m.chat, 
            data.videoNoWatermark, 
            `tiktok_${Date.now()}.mp4`, 
            `*${data.title || 'TikTok Video'}*`, 
            m
        )

        // 6. Reaksi sukses
        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

    } catch (e) {
        console.error('[tiktok-dl]', e)
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
        m.reply(`Gagal mengunduh video.\n\n*Error:* ${e.message}`)
    }
}

handler.help = ['tiktok'].map(v => v + ' <url>')
handler.tags = ['downloader']
handler.command = /^t(iktok(d(own(load(er)?)?|l))?|td(own(load(er)?)?|l))$/i
handler.limit = true // Opsional: jika bot Anda punya sistem limit

module.exports = handler
