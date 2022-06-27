const uploadFile = require('../lib/uploadFile.cjs');

async function handler(m, {
	conn,
	text,
	usedPrefix: _p,
	command
}) {
	let q = m.quoted ? m.quoted : m
	let mime = (q.msg || q).mimetype || q.mediaType || ''

	if (/webp|image/g.test(mime)) {
		let img = await q.download?.()
		if (!img) throw `balas gambar/stiker dengan perintah ${usedPrefix + command}`
		try {
			let out = await uploadFile(img)
			var a = (await axios.get(API('beni', 'api/canvas/jokeOverHead', {
				url: out
			}), {
				responseType: 'arraybuffer'
			})).data
			conn.sendFile(m.chat, a, '', 'nih bang', m)
		} catch (e) {
			if (e.response) {
				log(e.response.data.statusText)
				throw 'server error'
			} else {
				throw 'ada yang gak beres nih'
			}
		}
	}
}
handler.help = ['jokeoverhead']
handler.tags = ['canvas']
handler.command = /^jokeoverhead$/i
module.exports = handler
