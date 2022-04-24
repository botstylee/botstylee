let axios = require("axios");
let handler = async(m, { conn, text }) => {

    if (!text) return conn.reply(m.chat, 'Silahkan masukan nama yang akan diartikan', m)

  await m.reply('Searching...')
	axios.get(`https://bsbt-api-rest.herokuapp.com/api/artinama/?nama=${text}&apikey=benniismael`).then ((res) => {
	 	let hasil = `Arti Namamu Adalah\n\n${res.data.arti}`

    conn.reply(m.chat, hasil, m)
	})
}
handler.help = ['artinama'].map(v => v + ' <nama>')
handler.tags = ['primbon']
handler.command = /^(artinama)$/i
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
