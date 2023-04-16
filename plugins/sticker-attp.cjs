var request = require('request');
var {
	sticker
} = require('../lib/sticker.cjs');
var handler = async (m, {
	conn,
	text
}) => {
	var teks = text ? text : m.quoted && m.quoted.text ? m.quoted.text : m.text
	var stiker = await sticker((await attp(teks)).result, global.packname, global.author)
	conn.sendFile(m.chat, stiker, 'attp.webp', '', null, false, {
		asSticker: true
	})
}
handler.help = ['attp *teks*']
handler.tags = ['sticker']

handler.command = /^attp$/i

module.exports = handler

var attp = async (text) => {
	return new Promise(async (resolve, reject) => {
		const getid = await axios.get('https://id.bloggif.com/text')
		const id = cheerio.load(getid.data)('form').attr('action')
		const options = {
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
			if (error) return new Error(error)
			const $ = cheerio.load(body)
			const url = $('.box.center > a').attr('href')
			resolve({
				status: 200,
				result: 'https://id.bloggif.com' + url
			})
		})
	})
}
