var uploadFile = require('../lib/uploadFile.cjs');
var {
	webp2png
} = require('../lib/webp2mp4.cjs');
async function handler(m, {
	conn,
	text,
	usedPrefix: _p,
	command,
	args
}) {
	var q = m.quoted ? m.quoted : m
	var mime = (q.msg || q).mimetype || q.mediaType || ''

	if (/webp|image/g.test(mime)) {
		var img = await q.download?.()
		if (!img) throw `balas gambar/stiker dengan perintah ${usedPrefix + command}`
		if (args.length == 0) return m.reply(`Untuk menggunakan fitur ini\nSilahkan balas gambar atau kirim gambar dengan caption : ${_p+command} [filter]\n\n*Contoh:* ${_p+command} v2\n\nfilter yang tersedia:\n1. v1\n2. v2\n3. v3\n4. v4\n5. v5\n6. v6\n7. v7\n8. v8\n9. v9\n10. v10`)
		let Pilihan = args[0]
		let uuid = {
			v1: 't1',
			v2: 't2',
			v3: 't3',
			v4: 'fm4',
			v5: 'm2',
			v6: 'm3',
			v7: 'm4',
			v8: 'fm1',
			v9: 'fm2',
			v10: 'fm3'
		} [Pilihan]
		if (!uuid) throw `Maaf filter tidak tersedia. Silahkan ketik ${usedPrefix+command} untuk melihat list filter`
		try {
			var out
			if ('image/webp'.includes(mime)) out = await webp2png(img)
			else if (/image/g.test(mime)) out = await uploadFile(img)
			try {
				var a = (await axios.get(API('ghst', 'api/toonme', {
					filter: uuid,
					urlimg: out
				}, 'key'))).data
				conn.sendFile(m.chat, a.url, '', 'uiihhhh', m)
			} catch (e) {
				if (e.response) {
					console.log(e.response.data)
					return (m.reply(require('util').format({
						status: e.response.status,
						msg: e.response.data.data.description[0] ? e.response.data.data.description[0] : e.response.data.message ? e.response.data.message : 'gk ada mukanya tuh fotonya'
					})))
				} else {
					console.log(e)
					return (m.reply(require('util').format({
						status: 500,
						msg: `ada yang error silahkan lapor ke Admin @${nomorown}`
					}), null, {
						mentions: [nomorown + `@s.whatsapp.net`]
					}))
				}
			}
		} catch (e) {
			if (e.response) {
				console.log(e.response.data)
				return (m.reply(require('util').format({
					status: e.response.status,
					msg: e.response.data.info ? e.response.data.info : e.response.data.message
				})))
			} else {
				console.log(e)
				return (m.reply(require('util').format({
					status: 500,
					msg: `ada yang error silahkan lapor ke Admin @${nomorown}`
				}), null, {
					mentions: [nomorown + `@s.whatsapp.net`]
				}))
			}
		}
	}
}
handler.help = ['toonme']
handler.tags = ['funnyphoto']
handler.command = ['toonme']
module.exports = handler