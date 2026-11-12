var handler = async (m, { conn, command }) => {
	var response = await fetch(global.API('botstyle', '/api/loli', {}, 'apikey'))
	if (!response.ok) throw `Layanan gambar gagal (${response.status}).`
	var json = await response.json()
	if (!json?.result) throw 'Gambar tidak tersedia saat ini.'
	return conn.sendFile(m.chat, json.result, 'loli.jpg', 'Ini gambarnya.', m)
}
handler.help = ['loli']
handler.tags = ['anime']
handler.command = /^(loli)$/i
module.exports = handler
var fetch = require('node-fetch')
