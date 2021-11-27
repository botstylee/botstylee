let axios = require("axios");
let handler = async(m, { conn, command }) => {
  
  await m.reply(global.wait)
	axios.get(`https://docs-jojo.herokuapp.com/api/news`).then ((res) => {
	  let isi = res.data.articles.map(res=>`*Judul:* ${res.title}\n*Author:* ${res.author}\n*Publish:* ${res.publishedAt}\n*Deskripsi:* ${res.description}\n*URL:* ${res.url}`).join('\n\n━ ┅ ━━━━━━━━━━━━━━━━━━━━ ┅ ━\n\n').trim()
	 	let hasil = `*「 ${command.toUpperCase()} 」*\n\n*Total Berita:* ${res.data.totalResults}\n`
    conn.reply(m.chat, hasil+isi, m)
	})
}
handler.help = ['berita','news']
handler.tags = ['internet']
handler.command = /^(berita|news)$/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = false
handler.private = false
handler.register = true

handler.admin = false
handler.botAdmin = false

handler.fail = null

module.exports = handler
