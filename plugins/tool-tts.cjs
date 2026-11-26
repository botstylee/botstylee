var gtts = require('node-gtts')
var {
	readFileSync,
	unlinkSync,
	existsSync
} = require('fs')
var {
	join
} = require('path')

var defaultLang = 'id'

var handler = async (m, {
	conn,
	args
}) => {
	var lang = args[0]
	var text = args.slice(1).join(' ')

	// ✅ Kalau argumen pertama bukan kode bahasa 2 huruf, anggap semua sebagai teks
	if ((args[0] || '').length !== 2) {
		lang = defaultLang
		text = args.join(' ')
	}

	// ✅ Fallback ke quoted text
	if (!text && m.quoted && m.quoted.text) text = m.quoted.text

	// ✅ Validasi teks
	if (!text || !text.trim()) {
		return conn.reply(m.chat, `Kirim teks atau reply pesan.\nContoh: *.tts halo dunia* atau *.tts en hello world*`, m)
	}

	// ✅ Validasi kode bahasa (2 huruf)
	if (!/^[a-z]{2}$/i.test(lang)) lang = defaultLang

	var res
	try {
		res = await tts(text, lang)
	} catch (e) {
		console.error('[tts] Error pertama:', e)
		try {
			// Fallback ke default bahasa
			res = await tts(text, defaultLang)
		} catch (e2) {
			console.error('[tts] Error fallback:', e2)
			return conn.reply(m.chat, 'Gagal membuat TTS: ' + (e2.message || e2), m)
		}
	}

	// ✅ Pastikan res valid sebelum kirim
	if (!res || !Buffer.isBuffer(res) || res.length === 0) {
		return conn.reply(m.chat, 'Gagal membuat TTS: hasil kosong.', m)
	}

	// ✅ Kirim sebagai voice note (ptt), file MP3 dari gtts
	try {
		await conn.sendMessage(m.chat, {
			audio: res,
			mimetype: 'audio/mpeg',
			ptt: true
		}, { quoted: m })
	} catch (e) {
		console.error('[tts] Gagal kirim:', e)
		await conn.reply(m.chat, 'Gagal mengirim audio: ' + (e.message || e), m)
	}
}

handler.help = ['tts *lang teks*']
handler.tags = ['tools']
handler.command = /^g?tts$/i

module.exports = handler

function tts(text, lang = 'id') {
	return new Promise((resolve, reject) => {
		try {
			var ttsClient = gtts(lang)
			var filePath = join(__dirname, '../tmp', Date.now() + '.mp3')

			ttsClient.save(filePath, text, (err) => {
				try {
					if (err) return reject(err)
					if (!existsSync(filePath)) return reject(new Error('File TTS tidak ditemukan'))

					var buffer = readFileSync(filePath)
					// ✅ Hapus file setelah dibaca
					try { unlinkSync(filePath) } catch {}
					resolve(buffer)
				} catch (e) {
					// Pastikan file terhapus meskipun error
					try { if (existsSync(filePath)) unlinkSync(filePath) } catch {}
					reject(e)
				}
			})
		} catch (e) {
			reject(e)
		}
	})
}
