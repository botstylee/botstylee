var request = require('request');
var axios = require('axios');
var cheerio = require('cheerio');
var { sticker } = require('../lib/sticker.cjs');

var handler = async (m, {
	conn,
	text
}) => {
	var teks = text ? text : m.quoted && m.quoted.text ? m.quoted.text : m.text
	if (!teks) return conn.reply(m.chat, 'harap masukan teksnya!', m)

	try {
		await m.reply('tunggu sebentar...')

		// ✅ Ambil gambar hasil dari bloggif
		var result = await attp(teks)
		console.log('[attp] URL hasil:', result.result)

		// ✅ Buat sticker dari gambar tersebut
		var stiker = await sticker(result.result, global.packname, global.author)
		if (!stiker) throw new Error('Gagal membuat sticker')

		// ✅ Kirim sticker
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

// ✅ Fungsi attp
var attp = async (text) => {
	return new Promise(async (resolve, reject) => {
		try {
			// Ambil ID form dari bloggif
			var getid = await axios.get('https://id.bloggif.com/text')
			var id = cheerio.load(getid.data)('form').attr('action')

			var options = {
				method: "POST",
				url: `https://id.bloggif.com${id}`,
				headers: {
					"content-type": 'application/x-www-form-urlencoded',
					"user-agent": 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36'
				},
				formData: {
					target: 1,
					text: text,
					glitter_id: Math.floor(Math.random() * 2821),
					font_id: 'lucida_sans_demibold_roman',
					size: 50,
					bg_color: 'FFFFFF',
					transparent: 1,
					border_color: '000000',
					border_width: 2,
					shade_color: '000000',
					shade_width: 1,
					angle: 0,
					text_align: 'center'
				},
			};

			request(options, async function(error, response, body) {
				if (error) return reject(error)
				try {
					var $ = cheerio.load(body)
					var url = $('.box.center > a').attr('href')
					if (!url) return reject(new Error('URL hasil tidak ditemukan'))
					resolve({
						status: 200,
						result: 'https://id.bloggif.com' + url
					})
				} catch (e) {
					reject(e)
				}
			})
		} catch (e) {
			reject(e)
		}
	})
}
