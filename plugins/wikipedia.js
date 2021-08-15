/*let fetch = require('node-fetch')
let handler = async (m, { args }) => {
  if (!args) return m.reply('Mau cari apa?')
  let res = await fetch(`https://zahirr-web.herokuapp.com/api/wikipedia?search=${args[0]}&apikey=zahirgans`)
  let json = await res.json()
  if (json.result.status_code) m.reply(json.result.message + '!!')
  else m.reply('Menurut wikipedia *' + json.result.result + '*')
}
handler.help = ['wikipedia']
handler.tags = ['internet']
handler.command = /^(wiki(pedia)?)$/i

module.exports = handler*/

let axios = require("axios")
let fetch = require("node-fetch")
let cheerio = require("cheerio")
async function wikipedia(querry) {
	try {
	const link =  await axios.get(`https://id.wikipedia.org/wiki/${querry}`)
	const $ = cheerio.load(link.data)
	let judul = $('#firstHeading').text().trim()
	let thumb = $('#mw-content-text').find('div.mw-parser-output > div:nth-child(1) > table > tbody > tr:nth-child(2) > td > a > img').attr('src') || `//i.ibb.co/nzqPBpC/http-error-404-not-found.png`
	let isi = []
	$('#mw-content-text > div.mw-parser-output').each(function (rayy, Ra) {
		let penjelasan = $(Ra).find('p').text().trim()
		isi.push(penjelasan)
	})
	for(let i of isi) {
	const data = {
		author: 'Ra bot',
		status: link.status,
		result: {
			judul: judul,
			thumb: 'https:'+thumb,
			isi: i
		}
	}
	return data
}
	} catch (err) {
		var notFond = {
			author: 'Ra bot',
			status: link.status,
			Pesan: 'ERROR HUBUNGI OWNER 082149344210'
		}
		return notFond
	}
}
let handler = async (m, { args, text }) => {
  if (!text) return m.reply('Mau cari informasi apa?')
let a = conn.getName(m.sender)
wikipedia(`${text}`).then(res=>{console.log(res)
m.reply("*_menurut wikipedia_*\n"+ res.result.isi)}).catch(() => { conn.reply(m.chat, `maaf kak ${a} data dari ${text} tidak dapat saya temukan`, m) })
}
handler.help = ['wikipedia']
handler.tags = ['internet']
handler.command = /^(wiki(pedia)?)$/i

module.exports = handler


