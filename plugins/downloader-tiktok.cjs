var handler = async (m, {
	conn,
	args,
	usedPrefix,
	command
}) => {

	if (!args[0]) throw `uhm.. url nya mana?\n\ncontoh:\n${usedPrefix + command} https://vt.tiktok.com/yqyjPX/`
	if (!args[0].match(/tiktok/gi)) throw `url salah`

	var res = await fetch("https://rest-beni.herokuapp.com/api/tiktok?url=" + args[0])
	if (!res.status) throw eror
	var json = await res.json()
	// if (!json.status) throw json
	await m.reply('Tunggu Sebentar...')
	await conn.sendFile(m.chat, json.result.nowm, '', `\n\nBOTSTYLE`, m)

}
handler.help = ['tiktok <url>']
handler.tags = ['downloader']
handler.command = ['tiktok']

handler.limit = true

module.exports = handler