var {
	wallpaper,
	wallpaperv2
} = require('@bochilteam/scraper');
var handler = async (m, {
	conn,
	text,
	usedPrefix,
	command
}) => {
	if (!text) throw `Use example ${usedPrefix}${command} Minecraft`
	var res = await (/2/.test(command) ? wallpaperv2 : wallpaper)(text)
	var img = res[Math.floor(Math.random() * res.length)]
	conn.sendFile(m.chat, img, 'wallpaper.jpg', `Result from *${text}*\n\n© BOTSTYLEE`, m)
}
handler.help = ['', '2'].map(v => 'wallpaper' + v + ' <query>')
handler.tags = ['downloader']

handler.command = /^(wallpaper2?)$/i

module.exports = handler