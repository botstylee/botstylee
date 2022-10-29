var {
	kbbi
} = require('@bochilteam/scraper');
var handler = async (m, {
			conn,
			text,
			usedPrefix,
			command
		}) => {
			if (!text) throw `Example use ${usedPrefix}${command} halo`
			var res = await kbbi(text)
			m.reply(`
${res.map(v => `
${v.title}*

${v.means.map(v => '- ' + v).join('\n`')}
`).join('\n').trim()}

Note:
p = Partikel: kelas kata yang meliputi kata depan, kata sambung, kata seru, kata sandang, ucapan salam
n = Nomina: kata benda

© BOTSTYLEE
`.trim())
}
handler.help = ['kbbi <teks>']
handler.tags = ['internet']
handler.command = /^kbbi$/i

module.exports = handler