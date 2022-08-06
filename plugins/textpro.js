var fetch = require('node-fetch')
var split = '|'
var handler = async (m, { conn, args: [effect], text: txt }) => {
  var { effects } = await (await (fetch(global.API('xteam', '/textpro')))).json()
  if (!effect) throw '*List Effect*\n\n' + effects.sort((a, b) => a - b).join('\n')
  effect = effect.toLowerCase()
  if (!effect in effects) throw `Efek *${effect}* tidak ditemukan`
  var [text, ...text2] = txt.replace(effect, '').trimStart().split(split)
  text2 = text2.join(split)
  var url = global.API('xteam', '/textpro/' + effect, { text, text2 }, 'APIKEY')
  await conn.sendFile(m.chat, url, 'textpro.jpg', `*TEXTPRO*\n*Effect:* ${effect}`, m)
}
handler.help = ['textpro'].map(v => v + ' <effect> <text>|[text2]')
handler.tags = ['tools']
handler.command = /^(textpro)$/i

module.exports = handler

