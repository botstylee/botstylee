var uploadFile = require('../lib/uploadFile.cjs');
var {
	webp2png
} = require('../lib/webp2mp4.cjs');
var toonme = require('../lib/toonme.cjs'); // ✅ Import lib/toonme yang baru

async function handler(m, {
	conn,
	text,
	usedPrefix: _p,
	command,
	args
}) {
	var q = m.quoted ? m.quoted : m
	var mime = (q.msg || q).mimetype || q.mediaType || ''

	if (!/webp|image/g.test(mime)) {
		throw `Balas gambar atau sticker dengan perintah ${_p + command}`
	}

	var img = await q.download?.()
	if (!img) throw `Balas gambar/stiker dengan perintah ${_p + command}`

	if (args.length == 0) {
		return m.reply(`Untuk menggunakan fitur ini
Silahkan balas gambar atau kirim gambar dengan caption : ${_p + command} [filter]

*Contoh:* ${_p + command} v2

filter yang tersedia:
1. v1
2. v2
3. v3
4. v4
5. v5
6. v6
7. v7
8. v8
9. v9
10. v10`)
	}

	var Pilihan = args[0].toLowerCase()
	var validFilters = ['v1', 'v2', 'v3', 'v4', 'v5', 'v6', 'v7', 'v8', 'v9', 'v10']
	if (!validFilters.includes(Pilihan)) {
		throw `Maaf filter tidak tersedia. Silahkan ketik ${_p + command} untuk melihat list filter`
	}

	try {
		var out
		// ✅ Konversi webp ke png dulu (karena toonme butuh jpg/png)
		if (/image\/webp/.test(mime)) {
			out = await webp2png(img)
		} else if (/image/g.test(mime)) {
			out = img // kirim buffer langsung, tidak perlu upload dulu
		} else {
			throw 'Format gambar tidak didukung'
		}

		// ✅ Panggil lib/toonme yang baru (OmegaTech API)
		var resultUrl = await toonme(out, Pilihan)

		// ✅ Kirim hasil gambar
		await conn.sendFile(m.chat, resultUrl, 'toonme.jpg', 'uiihhhh', m)

	} catch (e) {
		console.error('[toonme] Error:', e)
		return m.reply(`❌ Gagal memproses gambar\n\n${e.message || 'Terjadi kesalahan'}`)
	}
}

handler.help = ['toonme']
handler.tags = ['funnyphoto']
handler.command = ['toonme']
module.exports = handler
