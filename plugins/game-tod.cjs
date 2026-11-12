var handler = async (m, { conn, command, usedPrefix }) => {
	if (/^tod$/i.test(command)) return conn.reply(m.chat, `Pilih salah satu dengan mengetik perintah:\n${usedPrefix}truth\n${usedPrefix}dare`, m)
	var type = /^truth$/i.test(command) ? 'truth' : 'dare'
	var response = await fetch(global.API('botstyle', `/api/${type}`, {}, 'apikey'))
	if (!response.ok) throw `Gagal mengambil ${type}. Coba lagi nanti.`
	var json = await response.json()
	if (!json?.result) throw `Hasil ${type} tidak tersedia saat ini.`
	return conn.reply(m.chat, `${type === 'truth' ? 'Truth' : 'Dare'}:\n${json.result}\n\nKetik ${usedPrefix}truth atau ${usedPrefix}dare untuk lanjut.`, m)
}
handler.help = ['tod', 'truth', 'dare']
handler.tags = ['game']
handler.command = /^(tod|truth|dare)$/i
module.exports = handler
var fetch = require('node-fetch')
