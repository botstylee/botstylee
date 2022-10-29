var fetch = require('node-fetch')
var handler = async (m, {
	conn
}) => {
	var res = await fetch('https://api.waifu.pics/sfw/waifu')
	if (!res.ok) throw 'Error Website sedang down'
	var json = await res.json()
	if (!json.url) throw 'Error!'
	conn.sendFile(m.chat, json.url, '', 'istri gweh', m)
}
handler.help = ['waifu']
handler.tags = ['anime']
handler.command = /^(waifu)$/i

handler.limit = true

module.exports = handler