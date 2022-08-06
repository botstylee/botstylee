var axios = require("axios");

var handler = async (m, {
	conn,
	text,
	command,
	usedPrefix
}) => {
	if (!text) return m.reply("masukan mimpi yang ingin kamu ketahui artinya")
	try {
		var a = await axios.request("https://rest-beni.herokuapp.com/api/artimimpi?mimpi=" + text, {
			method: "GET"
		})
		if (a.data.status !== 200) throw "error"
		var data = a.data.result
		if (data.match("Tidak ditemukan")) throw "tafsiran dari mimpi yang kamu berikan tidak di temukan, coba tanya pak ustadz atau kyai"
		conn.reply(m.chat, data, m)
	} catch (e) {
		if (e.response) {
			return m.reply("Rest Api down")
		}
	}
}
handler.help = ['artimimpi [teks]']
handler.tags = ['primbon']

handler.command = /^artimimpi$/i
handler.premium = true
module.exports = handler