const textpro = require("../lib/textpro.js");
const axios = require ("axios")
const { MessageType } = require('@adiwajshing/baileys')
let handler = async (m, { conn, args, text }) => {
    let [u,s] = text.split(/[&|.]/i)
    	  if (!u) return conn.reply(m.chat, 'harap masukan teksnya!!!\ncontoh\n#grafity3 pee|opo', m)
    	  if (!s) return conn.reply(m.chat, 'teks keduanya mana?\ncomtoh\n#grafity3 pee|opo',m)
    textpro("https://textpro.me/create-cool-wall-graffiti-text-effect-online-1009.html", [`${u}`,`${s}`])
.then(async (data) => {
let au = `${data}`
console.log(data)
let buf = await getBuffer(data);
conn.reply(m.chat, '_tunggu sebentar. . ._',m)
conn.sendMessage(m.chat, buf, MessageType.image, { quoted: m, caption: 'nihhhh!!!!'} )
})
.catch(error => console.log(error));
}
handler.help = ['grafity3 <text>']
handler.tags = ['textpro']
handler.command = /^grafity3$/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = false
handler.private = false
handler.admin = false
handler.botAdmin = false
handler.fail = null
module.exports = handler

const getBuffer = async (url, options) => {
	try {
		options ? options : {}
		const res = await axios({
			method: "get",
			url,
			headers: {
				'DNT': 1,
                    'User-Agent': 'GoogleBot',
				'Upgrade-Insecure-Request': 1
			},
			...options,
			responseType: 'arraybuffer'
		})
		return res.data
	} catch (e) {
		console.log(`Error : ${e}`)
	}
}
