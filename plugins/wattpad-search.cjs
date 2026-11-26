// plugins/wattpad-search.cjs
// Fitur: Cari cerita Wattpad, lihat detail, baca part

var { wpsearch, wpviews, wpreads } = require('../lib/wattpad.cjs')

// Helper: format angka
var fmt = (n) => {
	if (typeof formatnum === 'function') return formatnum(n).en
	return Number(n || 0).toLocaleString('en-US')
}

// Helper: tiny text (fallback)
var tn = async (s) => {
	if (typeof tiny === 'function') return await tiny(s)
	return s
}

// Helper: get buffer (fallback)
var buf = async (url) => {
	if (!url) return null
	if (typeof getbuffer === 'function') return await getbuffer(url)
	try {
		var res = await axios.get(url, { responseType: 'arraybuffer' })
		return Buffer.from(res.data)
	} catch { return null }
}

// Helper: error
var handleError = (m, e, context) => {
	if (e.response) {
		console.log(e.response.data)
		return m.reply(require('util').format({
			status: e.response.status,
			msg: e.response.data.info
				? e.response.data.info
				: e.response.data.message
					? e.response.data.message
					: `tidak di temukan ${context}`
		}))
	}
	console.log(e)
	return m.reply(require('util').format({
		status: 500,
		msg: 'ada yang error silahkan lapor ke Admin'
	}))
}

async function handler(m, {
	args,
	usedPrefix: _p,
	command,
	text,
	conn
}) {
	var wmText = typeof wm !== 'undefined' ? wm : 'Bot'

	// === Command: wattpad (search) ===
	if (command === 'wattpad') {
		if (!text) throw 'Mau nyari story apa kak?'
		try {
			var a = await wpsearch(text)

			if (a.status !== 200 || !a.stories || !a.stories.length) {
				return m.reply(`Tidak ada story ditemukan untuk: "${text}"`)
			}

			var hasil = a.stories.map((i, idx) => {
				var status = i.completed ? 'Completed' : 'Ongoing'
				return `${idx + 1}. *${i.title}*\n   ${status} | Parts: ${i.numParts || 0} | Reads: ${fmt(i.readCount)} | Votes: ${fmt(i.voteCount)} | Comment: ${fmt(i.commentCount)} | By: ${i.user?.name || '-'}\n   → ${_p}wpdet ${i.id}`
			}).join('\n\n')

			return conn.sendMessage(m.chat, {
				text: `*𓅪 W A T T P A D 𓅪*\n\nMenampilkan hasil pencarian untuk: "${text}"\n\n${hasil}\n\n_${wmText}_`
			}, { quoted: m })
		} catch (e) {
			return handleError(m, e, 'story dari query tersebut')
		}
	}

	// === Command: wpdet (detail) ===
	if (command === 'wpdet') {
		if (!args[0]) throw 'Masukkan ID story!\nContoh: .wpdet 123456'
		try {
			var a = await wpviews(args[0])

			if (a.status !== 200) {
				return m.reply('Story tidak ditemukan.')
			}

			var detail = `*𓅪 W A T T P A D 𓅪*\n\n` +
				`• *Title* : ${a.title || '-'}\n` +
				`• *Reads* : ${fmt(a.readCount)}\n` +
				`• *Votes* : ${fmt(a.voteCount)}\n` +
				`• *Parts* : ${fmt(a.numParts)}\n` +
				`• *Author* : ${a.user?.name || '-'}\n\n` +
				`*${await tn(wmText)}*`

			// Kirim detail + cover
			var cover = a.cover ? await buf(a.cover) : null
			await conn.sendMessage(m.chat, {
				text: detail,
				contextInfo: cover ? {
					externalAdReply: {
						mediaType: 1,
						title: '*' + await tn(wmText) + '*',
						thumbnail: cover,
						sourceUrl: '',
						showAdAttribution: false,
						renderLargerThumbnail: true
					}
				} : undefined
			}, { quoted: m })

			await delay(1000)

			// Daftar part
			if (a.parts && a.parts.length) {
				var parts = a.parts.map((i, idx) => `${idx + 1}. ${i.title}\n   → ${_p}wpreads ${i.id}`).join('\n\n')
				return conn.sendMessage(m.chat, {
					text: `*Daftar Part:*\n\n${parts}\n\n_${wmText}_`
				}, { quoted: m })
			}
		} catch (e) {
			return handleError(m, e, 'story dari id tersebut')
		}
	}

	// === Command: wpreads (baca) ===
	if (command === 'wpreads') {
		if (!args[0]) throw 'Masukkan ID part!\nContoh: .wpreads 123456'
		try {
			var a = await wpreads(args[0])

			if (a.status !== 200 || !a.read) {
				return m.reply('Part tidak ditemukan atau kosong.')
			}

			// Potong kalau terlalu panjang (WhatsApp limit ~65536 char)
			var readText = a.read.length > 60000 ? a.read.slice(0, 60000) + '\n\n...(dipotong)' : a.read

			var photo = a.data?.photoUrl ? await buf(a.data.photoUrl) : null

			return conn.sendMessage(m.chat, {
				text: readText,
				contextInfo: photo ? {
					externalAdReply: {
						mediaType: 1,
						title: '*' + await tn(wmText) + '*',
						thumbnail: photo,
						sourceUrl: '',
						showAdAttribution: false,
						renderLargerThumbnail: true
					}
				} : undefined
			}, { quoted: m })
		} catch (e) {
			return handleError(m, e, 'story dari id tersebut')
		}
	}
}

handler.help = ['wattpad *query*']
handler.tags = ['wattpad']
handler.command = ['wattpad', 'wpdet', 'wpreads']

module.exports = handler
