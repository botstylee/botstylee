let axios = require("axios");
let handler = async(m, { conn, text }) => {
	let [nama1, nama2] = text.split `-`

    if (!nama1) return conn.reply(m.chat, 'Masukan nama lu', m)
    if (!nama2) return conn.reply(m.chat, 'Masukan nama doi', m)

  await m.reply(global.wait)
	axios.get(`http://nzcha-apii.herokuapp.com/ramalan-jodoh?nama1=${nama1}&nama2=${nama2}`).then ((res) => {
	 	let hasil = `*kecocokan cinta:* ${res.data.result.hasil}`

    conn.reply(m.chat, hasil, m)
	})
}
handler.help = ['ramalanjodoh <nama1-nama2>']
handler.tags = ['primbon']
handler.command = /^(ramalanjodoh)$/i
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
