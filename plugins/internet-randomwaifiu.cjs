var handler = async (m, { conn, command }) => {
	var axios = global.axios
	if (!axios) throw 'HTTP client belum tersedia.'
	var tag = command.toLowerCase() === 'waifu' ? null : randomTags[Math.floor(Math.random() * randomTags.length)]
	var endpoint = tag ? `https://api.waifu.im/random/?selected_tags=${encodeURIComponent(tag)}&is_nsfw=false` : 'https://api.waifu.im/random/?is_nsfw=false'
	var response = await axios.get(endpoint, { timeout: 15000 })
	var image = response.data?.images?.[0]?.url
	if (!image) throw 'Gambar tidak ditemukan. Coba lagi nanti.'
	return conn.sendFile(m.chat, image, 'waifu.jpg', '🧐\nUntuk gambar lain, ketik perintah waifu atau rwaifu lagi.', m)
}
var randomTags = ['uniform', 'waifu', 'marin-kitagawa', 'mori-calliope', 'raiden-shogun', 'selfies']
handler.help = ['waifu', 'rwaifu']
handler.tags = ['internet']
handler.command = /^(waifu|rwaifu)$/i
module.exports = handler
