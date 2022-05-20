async function handler(m, {
	conn,
	text,
	command,
	usedPrefix: p
}) {
	if (!text) return m.reply('linknya mana gan?')
	if (/^.*tiktok/i.test(text)) {
		try {
			var a = await axios.get(API('ghst', '/tiktok', {
				url: text
			}, 'key'))
		} catch (e) {
			if (e.response) {
				console.log(e.response.data)
				return m.reply(require('util').format({
					status: e.response.status,
					msg: e.response.statusText
				}))
			} else {
				console.log(e)
				return m.reply(require('util').format({
					status: 500,
					msg: `ada yang error silahkan lapor ke Admin @${nomorown}`
				}), {
					mentions: [nomorown + `@s.whatsapp.net`]
				})
			}
		}
	}
}
handler.command = /^q$/i
module.exports = handler