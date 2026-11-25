const TextPro = require('@sl-code-lords/text-pro-me')
const textpro = new TextPro()

/**
 * TextPro Scraper (versi package)
 * @param {String} url - URL textpro.me
 * @param {String|String[]} text - Teks yang akan diproses
 */
async function textproScraper(url, text) {
	if (!/^https:\/\/textpro\.me\/.+\.html$/.test(url))
		throw new Error("Url Salah!!")

	try {
		// Package ini butuh text dalam bentuk array
		const texts = Array.isArray(text) ? text : [text]
		
		const result = await textpro.create({
			url: url,
			text: texts
		})

		// Kembalikan URL gambar hasil
		return result.url
	} catch (e) {
		console.error('[textpro] Error:', e.message)
		throw new Error('Gagal memproses TextPro: ' + e.message)
	}
}

module.exports = textproScraper
