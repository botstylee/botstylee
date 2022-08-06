var uploadFile = require('../lib/uploadFile.cjs');
var {
	webp2png
} = require('../lib/webp2mp4.cjs');
async function handler(m, {
	conn,
	text,
	usedPrefix: _p,
	command
}) {
	var q = m.quoted ? m.quoted : m
	var mime = (q.msg || q).mimetype || q.mediaType || ''

	if (/webp|image/g.test(mime)) {
		var img = await q.download?.()
		if (!img) throw `balas gambar/stiker dengan perintah ${usedPrefix + command} user&count_post&follower&following\ncontoh: ${usedPrefix + command} jokowi&12&1000&0`
		var [l1, l2, l3, l4] = text.split(/[&|,]/i).trim()
		if(!(l1 || l2 || l3 || l4)) {
		l1 = author
		l2 = 12
		l3 = 1000
		l4 = 0
		}
		try {
			var out
			if (/image/g.test(mime)) out = await uploadFile(img)
			if ('image/webp'.includes(mime)) out = await webp2png(img)
			var a = (await axios.get(API('beni', 'api/canvas/instagram', {
				pp: out,
				username: l1,
				post: l2,
				followers: l3,
				following: l4
			}), {
				responseType: 'arraybuffer'
			})).data
			conn.sendFile(m.chat, a, '', 'nih bang', m)
		} catch (e) {
			if (e.response) {
				log(e.response.statusText)
				throw 'server error'
			} else {
				throw 'ada yang gak beres nih'
			}
		}
	}
}
handler.help = ['insta']
handler.tags = ['canvas']
handler.command = /^insta$/i
module.exports = handler
