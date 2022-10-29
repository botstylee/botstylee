var fetch = require('node-fetch')
var handler = async (m, {
	conn,
	text
}) => {
	if (!text) throw `Masukkan query!`
	var res = await fetch(global.API('https://api.jikan.moe', '/v3/search/anime', {
		q: text
	}))
	if (!res.ok) throw await res.text()
	var json = await res.json()
	var {
		title,
		members,
		synopsis,
		episodes,
		url,
		rated,
		score,
		image_url,
		type,
		start_date,
		end_date
	} = json.results[0]
	var animeingfo = `✨️ *Title:* ${title}
🎆️ *Episodes:* ${episodes}
➡️ *Start date:* ${start_date}
🔚 *End date:* ${end_date}
💬 *Show Type:* ${type}
💌️ *Rating:* ${rated}
❤️ *Score:* ${score}
👥 *Members:* ${members}
💚️ *Synopsis:* ${synopsis}
🌐️ *URL*: ${url}`
	conn.sendFile(m.chat, image_url, '', animeingfo, m)
}
handler.help = ['anime <judul>']
handler.tags = ['anime']
handler.command = /^(anime|animeinfo)$/i
handler.limit = 3
module.exports = handler