let handler = async (m, {
	conn,
	text
}) => {
	if (!text) throw 'mau ngobrol apa?'
	try {
		a = (await axios.get(API('ghst', 'api/simsimi', {
			pesan: text
		}, 'key'))).data
		console.log(a)
		if (a.respSentence.includes("simsimi error")) {
			return m.reply(a.respSentence)
		}
		m.reply(`*○S I M I* : ` + a.respSentence)
	} catch (e) {
		if (e.response) {
			console.log(e.response.data)
			return resolve(m.reply(require('util').format({
				status: e.response.status,
				msg: e.response.statusText
			})))
		} else {
			console.log(e)
			return resolve(m.reply(require('util').format({
				status: 500,
				msg: `ada yang error silahkan lapor ke Admin @${nomorown}`
			}), null, {
				mentions: [nomorown + `@s.whatsapp.net`]
			}))
		}
	}
}

handler.help = ['bot *teks*']
handler.tags = ['fun', 'game']
handler.command = /^ot$/i

module.exports = handler