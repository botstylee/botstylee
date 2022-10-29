var {
	wikipedia
} = require('@bochilteam/scraper');
var handler = async (m, {
	conn,
	text,
	usedPrefix,
	command
}) => {
	if (!text) throw `Contoh penggunaan ${usedPrefix}${command} Minecraft`
	var json = await wikipedia(text)
	m.reply(`
*${json.title}*
${json.img}

${json.articles}
`.trim())
}
handler.help = ['wikipedia'].map(v => v + ' <apa>')
handler.tags = ['internet']
handler.command = /^(wiki|wikipedia)$/i

module.exports = handler