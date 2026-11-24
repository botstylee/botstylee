const axios = require('axios')
const { download: tiktokDl } = require('@silent-tech-offc/ttdl')
const yt = require('@denzy-official/youtube_scraper')
const { downloader } = require('@heavstal/api')
// Helper untuk memformat ukuran file
const formatSize = (bytes) => {
    if (!bytes) return 'Unknown'
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`
}

// Helper untuk mengunduh buffer dari URL (untuk dikirim sebagai dokumen)
const getBuffer = async (url) => {
    const res = await axios.get(url, { responseType: 'arraybuffer' })
    return Buffer.from(res.data)
}

async function handler(m, {
    conn,
    text,
    command,
    usedPrefix: _p,
    isPrems,
    isOwner,
    args
}) {
    // === BAGIAN 1: COMMAND DOWNLOAD (LINK LANGSUNG) ===
    if (command == 'download') {
        if (!args[0]) return m.reply('Mana linknya? Contoh: .download https://vt.tiktok.com/xxx')
        
        const url = args[0]
        const isUrl = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/gi.test(url)
        if (!isUrl) return m.reply('Link tidak valid!')

        // Reaksi loading
        await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })

        try {
            // --- TIKTOK ---
            if (/tiktok/i.test(url)) {
                const data = await tiktokDl(url)
                if (!data.videoNoWatermark) throw new Error('Gagal mengambil video TikTok.')
                
                await conn.sendFile(m.chat, data.videoNoWatermark, `tiktok_${Date.now()}.mp4`, '', m)
                await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
                return
            }

            // --- YOUTUBE (Audio/Video) ---
            if (/youtu\.?be/i.test(url)) {
                // Cek argumen kedua (mp3/mp4)
                const type = args[1] ? args[1].toLowerCase() : 'mp3'
                if (!['mp3', 'mp4'].includes(type)) return m.reply('Format harus mp3 atau mp4. Contoh: .download link mp3')

                const result = type === 'mp3' ? await yt.ytmp3(url) : await yt.ytmp4(url)
                if (!result.status || !result.download?.url) throw new Error('Gagal memproses YouTube.')

                // Cek limit (20MB free / 99MB premium)
                const fileSize = result.download.filesize || 0
                const limitSize = (isPrems || isOwner ? 99 : 20) * 1024 * 1024
                if (fileSize > limitSize) {
                    return m.reply(`File terlalu besar (${formatSize(fileSize)}).\nLimit Anda: ${formatSize(limitSize)}.\n\nLink download langsung: ${result.download.url}`)
                }

                const buffer = await getBuffer(result.download.url)
                await conn.sendFile(m.chat, buffer, `${result.metadata.title}.${type}`, '', m, null, { asDocument: true })
                await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
                return
            }

            // --- INSTAGRAM / FACEBOOK / TWITTER (X) ---
            if (/instagram|facebook|fb\.watch|twitter|x\.com/i.test(url)) {
                let res
                if (/instagram/i.test(url)) res = await downloader.instagram(url) // Asumsi API heavstaltech mendukung
                else if (/facebook|fb\.watch/i.test(url)) res = await downloader.facebook(url)
                else if (/twitter|x\.com/i.test(url)) res = await downloader.twitter(url)
                
                // Fallback: jika library heavstaltech tidak support, coba scrape manual via yt-dlp (jika ada di server)
                // Untuk kesederhanaan, kita asumsikan library mengembalikan URL media.
                if (res && res.status && res.url) {
                     await conn.sendFile(m.chat, res.url, `sosmed_${Date.now()}.mp4`, '', m)
                     await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
                     return
                }
                throw new Error('Platform ini belum didukung penuh oleh library. Coba gunakan link YouTube atau TikTok.')
            }

            // Jika link tidak dikenali
            return m.reply('Link tidak didukung. Gunakan link dari: TikTok, YouTube, Instagram, Facebook, atau Twitter.')

        } catch (e) {
            console.error(e)
            await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
            return m.reply(`Terjadi kesalahan: ${e.message}`)
        }
    }

    // === BAGIAN 2: COMMAND PLAY / YTSEARCH (PENCARIAN) ===
    if (['play', 'ytplay', 'ytsearch'].includes(command)) {
        // 'play' hanya untuk private chat sesuai kode lama
        if (command === 'play' && m.isGroup) {
            return m.reply('Gunakan command .play di private chat saja.')
        }

        const query = text
        if (!query) return m.reply(`Mau cari apa? Contoh: ${_p + command} hindia`)

        try {
            const search = await yt.search(query)
            if (!search.status || !search.results?.length) return m.reply('Video tidak ditemukan.')

            // Ambil hasil pertama
            const video = search.results[0]
            
            // Buat caption informasi
            const caption = `
*Y T  P L A Y*
*Judul*: ${video.title}
*Channel*: ${video.author?.name || '-'}
*Durasi*: ${video.duration || '-'}
*Views*: ${video.views || '-'}
*Link*: ${video.url}

Ketik *${_p}download ${video.url} mp3* untuk audio
Ketik *${_p}download ${video.url} mp4* untuk video
`.trim()

            // Kirim thumbnail + caption (tanpa button)
            if (video.thumbnail) {
                await conn.sendMessage(m.chat, { image: { url: video.thumbnail }, caption: caption }, { quoted: m })
            } else {
                await m.reply(caption)
            }

        } catch (e) {
            console.error(e)
            return m.reply(`Pencarian gagal: ${e.message}`)
        }
    }
}

handler.help = ['download <url>', 'play <query>', 'ytplay <query>', 'ytsearch <query>']
handler.tags = ['downloader']
handler.command = ['download', 'play', 'ytplay', 'ytsearch']
handler.limit = true
module.exports = handler
