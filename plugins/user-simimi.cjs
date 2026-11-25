var handler = async (m, {
	conn,
	text
}) => {
	if (!text) throw 'Hai!!, saya robot. ada yang bisa saya bantu?. ketik #menu untuk melihat fitur🗿'
	try {
		// ✅ Pakai node-simipro (CommonJS)
		// node-simipro sudah ditambahkan ke package.json
		const simi = require('node-simipro')
		
		// simitalk(text, languageCode)
		// 'id' untuk Bahasa Indonesia
		const res = await simi.simitalk(text, 'id')
		
		// Response structure: { success: true, message: "...", isUnknownResponse: false }
		console.log(res)
		
		if (!res.success || res.isUnknownResponse) {
			return m.reply('SimSimi tidak tahu jawabannya :(')
		}
		
		m.reply(`*○S I M I* : ` + res.message)
	} catch (e) {
		console.error('[simisimi]', e)
		return m.reply(require('util').format({
			status: 500,
			msg: `ada yang error silahkan lapor ke Admin @${nomorown}`
		}), null, {
			mentions: [nomorown + `@s.whatsapp.net`]
		})
	}
}

handler.help = ['Bot *teks*']
handler.tags = ['fun', 'game']
handler.customPrefix = /Bot/
handler.command = new RegExp
module.exports = handler
