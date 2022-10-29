var handler = async (m, {
	conn,
	command,
	args
}) => {
	if (args[0] === 'Nekopoi.care') {
		conn.reply(m.chat, '*Tobat woy*', m)
		reject
	}
	if (args[0] === 'Nhentai.net') {
		conn.reply(m.chat, '*Tobat woy*', m)
		reject
	}
	var full = /f$/i.test(command)
	if (!args[0]) return conn.reply(m.chat, 'Tidak ada url', m)
	var url = /https?:\/\//.test(args[0]) ? args[0] : 'https://' + args[0]
	try {
		var ss = await (await fetch('https://shot.screenshotapi.net/screenshot?fresh=true&output=image&file_type=png&dark_mode=true&wait_for_event=load&delay=2000&url=' + encodeURIComponent(url) + '&full_page=false')).buffer()
		conn.sendFile(m.chat, ss, 'screenshot.png', url, m)
	} catch (e) {
		return e
	}
}
handler.help = ['ss', 'ssf'].map(v => v + ' *url*')
handler.tags = ['internet']
handler.command = /^ss(web)?f?$/i

module.exports = handler