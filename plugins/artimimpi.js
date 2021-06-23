let axios = require("axios");
let handler = async(m, { conn, text }) => {

    if (!text) return conn.reply(m.chat, 'Silahkan masukan mimpimu', m)

  await m.reply('Searching...')
	axios.get('https://bsbt-api-rest.herokuapp.com/api/artimimpi/?mimpi=${text}&apikey=benniismael').then ((res) => {
	 	let hasil = `Arti Mimpimu\n\n${res.data.arti.string}`

    conn.reply(m.chat, hasil, m)
	})
}
handler.help = ['artimimpi'].map(v => v + ' <nama>')
handler.tags = ['primbon']
handler.command = /^(artimimpi)$/i
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
