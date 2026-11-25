var {
	sticker
} = require('../lib/sticker.cjs');
var axios = require('axios');
var cheerio = require('cheerio');

var handler = async (m, {
	conn,
	text
}) => {
	var teks = text ? text : m.quoted && m.quoted.text ? m.quoted.text : m.text
	if (!teks) return conn.reply(m.chat, 'Masukkan teks atau reply pesan yang ingin dijadikan stiker.', m)

	try {
		var result = await ttp(teks)
		var stiker = await sticker(result, global.packname, global.author)
		if (stiker) return conn.sendMessage(m.chat, { sticker: stiker }, { quoted: m })
		throw new Error('Gagal membuat stiker.')
	} catch (e) {
		console.error('[ttp] Error:', e.message)
		await conn.reply(m.chat, 'Gagal memproses: ' + e.message, m)
	}
}
handler.help = ['ttp *teks*']
handler.tags = ['sticker']
handler.command = /^ttp$/i

module.exports = handler

var ttp = async (text) => {
	try {
		const formData = new URLSearchParams()
		formData.append('TextToRender', text)
		formData.append('FontSize', '100')
		formData.append('Margin', '30')
		formData.append('LayoutStyle', '0')
		formData.append('TextRotation', '0')
		formData.append('TextColor', 'ffffff')
		formData.append('TextTransparency', '0')
		formData.append('OutlineThickness', '3')
		formData.append('OutlineColor', '000000')
		formData.append('FontName', 'Lekton')
		formData.append('ResultType', 'view')

		const { data: body } = await axios.post(
			'https://www.picturetopeople.org/p2p/text_effects_generator.p2p/transparent_text_effect',
			formData.toString(),
			{
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
					'Cookie': '_ga=GA1.2.1667267761.1655982457; _gid=GA1.2.77586860.1655982457; __gads=ID=c5a896288a559a38-224105aab0d30085:T=1655982456:RT=1655982456:S=ALNI_MbtHcmgQmVUZI-a2agP40JXqeRnyQ; __gpi=UID=000006149da5cba6:T=1655982456:RT=1655982456:S=ALNI_MY1RmQtva14GH-aAPr7-7vWpxWtmg; _gat_gtag_UA_6584688_1=1'
				}
			}
		)

		const $ = cheerio.load(body)
		const result = 'https://www.picturetopeople.org' + $('#idResultFile').attr('value')
		if (!result || result === 'https://www.picturetopeople.orgundefined') {
			throw new Error('Gagal mengekstrak URL hasil dari halaman.')
		}
		return result
	} catch (e) {
		console.error('[ttp] Scraper error:', e.message)
		throw e
	}
}
