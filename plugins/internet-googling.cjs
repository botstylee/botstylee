var googleIt = require('google-it')
var handler = async (m, {
	conn,
	command,
	args
}) => {
	var full = /f$/i.test(command)
	var text = args.join` `
	if (!text) return conn.reply(m.chat, 'Tidak ada teks untuk di cari', m)
	var url = 'https://google.com/search?q=' + encodeURIComponent(text)
	var search = await googleIt({
		query: text
	})
	var msg = search.map(({
		title,
		link,
		snippet
	}) => {
		return `*${title}*\n_${link}_\n_${snippet}_`
	}).join`\n\n`
	var ss = (await (await fetch('https://shot.screenshotapi.net/screenshot?&url=' + encodeURIComponent(url) + '&extract_text=true&output=image&file_type=png&block_ads=true&dark_mode=true&wait_for_event=load&delay=1000&accept_languages=id-ID&full_page=false&fresh=true')).arrayBuffer()).toBuffer()
	conn.sendFile(m.chat, ss, 'screenshot.png', url + '\n\n' + msg, m)
}
handler.help = ['google', 'googlef'].map(v => v + ' <pencarian>')
handler.tags = ['internet']
handler.command = /^(google(f)?)$/i
handler.limit = true
module.exports = handler
