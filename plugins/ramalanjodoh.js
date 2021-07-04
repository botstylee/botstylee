let axios = require("axios");
let handler = async(m, { conn, text }) => {
	let [nama1, nama2] = text.split `|`

    if (!nama1) return conn.reply(m.chat, '_Masukkan Namamu!_', m)
    if (!nama2) return conn.reply(m.chat, '_Masukkan Nama Pasanganmu!_', m)

  await m.reply(global.wait)
	axios.get(`http://nzcha-apii.herokuapp.com/ramalan-jodoh?nama1=${nama1}&nama2=${nama2}`).then ((res) => {
	 	let hasil = `*kecocokan cinta:* ${res.data.result.hasil}`

    let hasil = `
*Nama Kamu:* ${res.data.result.namaKamu}
*Nama Pasangan:* ${res.data.result.namaPasangan}

*_Sisi Positif:_*
_${res.data.result.positif}_

*_Sisi Negatif:_*
_${res.data.result.negatif}_

*BOT_STYLE*
`.trim()

    conn.reply(m.chat, hasil, m)
	})
   } catch (e) {
  	m.reply('```Error```')
  }
}
handler.help = ['ramalanjodoh <nama1|nama2>']
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
