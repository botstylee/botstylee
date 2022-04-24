let axios = require("axios");
let handler = async(m, { conn, text }) => {

    if (!text) return conn.reply(m.chat, 'Masukan No Telpon yang akan di SpamSms!\n\nMisal : !spamsms 62895337278647', m)

	axios.get(`https://smsbomber.online/index.php?no=${text}&jum=20`).then ((res) => {
	 	let hasil = `${res.data.logs}`

    conn.reply(m.chat, hasil, m)
	})
}
handler.help = ['spamsms'].map(v => v + ' <no hp>')
handler.tags = ['spammer']
handler.command = /^(spamsms)$/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = false
handler.private = false

handler.admin = false
handler.botAdmin = false

handler.fail = null
handler.exp = 0
handler.limit = true

module.exports = handler
