const {
	pinterest
} = require('@bochilteam/scraper');
let handler = async (m, { 
	conn, 
	text, 
	usedPrefix, 
	command 
}) => {
  if (!text) throw `Example use ${usedPrefix + command} minecraft`
  const json = await pinterest(text)
  conn.sendFile(m.chat, json.getRandom(), 'pinterest.jpg', `
*Hasil pencarian*
${text}
© BOTSTYLEE
`.trim(), m)
}
handler.help = ['pinterest <keyword>']
handler.tags = ['internet']
handler.command = /^(pinterest)$/i

module.exports = handler