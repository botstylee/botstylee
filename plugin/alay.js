let axios = require("axios");
let handler = async(m, { conn, text }) => {

    if (!text) return conn.reply(m.chat, 'Masukan Teksnya', m)
    
    await m.reply(global.wait)
	axios.get(`https://api.terhambar.com/bpk?kata=${text}`).then ((res) => {
	 	let hasil = `${res.data.text}`

    conn.reply(m.chat, hasil, m)
	})
}
handler.help = ['alay'].map(v => v + ' <teks>')
handler.tags = ['tools']
handler.command = /^(alay)$/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = false
handler.private = false
handler.register = true

handler.admin = false
handler.botAdmin = false

handler.fail = null
handler.exp = 0
handler.limit = true

module.exports = handler
