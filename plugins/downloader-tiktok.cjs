var handler = async (m, {
	conn,
	args,
	usedPrefix,
	command
}) => {
	if (!args[0]) throw `uhm.. url nya mana?\n\ncontoh:\n${usedPrefix + command} https://vt.tiktok.com/yqyjPX/`
	if (!args[0].match(/tiktok/gi)) throw `url salah`
	try {
		var a = await axios.get('https://rest-beni.herokuapp.com/api/tiktok?url=' + args[0])
		if (!a.data.result.video_original) {
			conn.sendFile(m.chat, a.data.result.video, '', '\n\nBOTSTYLEE', m)
		} else {
			conn.sendFile(m.chat, a.data.result.video_original, "", "\n\nBOTSTYLEE", m)
		}
	} catch (e) {
log(e)
		conn.reply(m.chat, "error", m)
	}
}
handler.help = ['tiktok <url>']
handler.tags = ['downloader']
handler.command = /^(tiktok)$/i
handler.limit = true
module.exports = handler
