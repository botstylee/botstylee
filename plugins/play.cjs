// plugins/downloader-play.cjs By Botstylee
// Fitur: Play audio YouTube dari judul

var { youtubedl, youtubedlv2, youtubedlv3 } = require('@bochilteam/scraper')
var yts = require('yt-search')

var handler = async (m, {
	conn,
	command,
	text,
	usedPrefix
}) => {
	// Guard: harus ada judul
	if (!text) throw `Judulnya? Contoh: ${usedPrefix + command} lagu favorit`

	// Pesan tunggu
	var wm = global.wm || 'Bot'
	await m.reply('🔍 Mencari video...')

	// Cari video
	var search = await yts(text)
	if (!search || !search.videos || !search.videos.length) {
		throw 'Tidak Ditemukan'
	}

	var vid = search.videos[Math.floor(Math.random() * search.videos.length)]
	var { title, thumbnail, timestamp, views, ago, url } = vid

	var captvid = `╭──── 〔 Y O U T U B E 〕
• Judul: ${title}

• Durasi: ${timestamp}

• Views: ${views}

• Upload: ${ago}

• Link: ${url}

• Note: Untuk Video Ketik .ytv Masukan Link Atas

• Contoh: .ytv ${url}
╰────────⬣`

	// Kirim info video
	await conn.sendMessage(m.chat, {
		image: { url: thumbnail },
		caption: captvid
	}, { quoted: m })

	// Ambil audio (fallback ke 3 scraper)
	var yt
	try {
		yt = await youtubedlv2(url)
	} catch {
		try {
			yt = await youtubedl(url)
		} catch {
			yt = await youtubedlv3(url)
		}
	}

	// Guard: audio tersedia
	if (!yt || !yt.audio || !yt.audio['128kbps']) {
		throw 'Gagal mengambil audio. Coba lagu lain.'
	}

	var link = await yt.audio['128kbps'].download()

	// Guard: link valid
	if (!link) throw 'Gagal mengunduh audio.'

	// Ambil thumbnail buffer (opsional)
	var thumbBuffer = null
	try {
		thumbBuffer = await (await conn.getFile(thumbnail)).data
	} catch {}

	// Kirim audio
	var doc = {
		audio: { url: link },
		mimetype: 'audio/mp4',
		fileName: title.replace(/[^\w\s]/gi, '').slice(0, 100) || 'audio',
		contextInfo: {
			externalAdReply: {
				showAdAttribution: true,
				mediaType: 2,
				mediaUrl: url,
				title: title,
				body: wm,
				sourceUrl: url,
				thumbnail: thumbBuffer
			}
		}
	}

	return conn.sendMessage(m.chat, doc, { quoted: m })
}

handler.help = ['play']
handler.tags = ['downloader']
handler.command = /^play$/i

module.exports = handler
