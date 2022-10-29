var handler = async (m, {
	conn,
	text
}) => {
	if (!text) throw 'Hai!!, saya robot. ada yang bisa saya bantu?. ketik #menu untuk melihat fitur🗿'
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
			return m.reply(require('util').format({
				status: e.response.status,
				msg: e.response.data.info ? e.response.data.info : e.response.data.message
			}))
		} else {
			console.log(e)
			return m.reply(require('util').format({
				status: 500,
				msg: `ada yang error silahkan lapor ke Admin @${nomorown}`
			}), null, {
				mentions: [nomorown + `@s.whatsapp.net`]
			})
		}
	}
}

handler.help = ['Bot *teks*']
handler.tags = ['fun', 'game']
handler.customPrefix = /Bot/
handler.command = new RegExp
module.exports = handler
