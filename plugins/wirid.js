let fetch = require('node-fetch')
let handler = async (m, { conn }) => {
  await m.reply(global.wait)
  let res = await fetch(global.API('xteam','/religi/wirid', {}, 'APIKEY'))
  let json = await res.json()
  if (res.status != 200) throw json
  if (json.result.error) throw json.result.message
  let {
    times,
    id,
    arabic,
    tnc
  } = json.result
  let caption = `
*「 Wirid 」*
No. ${id}
${arabic} ${times}x
${tnc}
`.trim()
  await m.reply(caption)
}
handler.help = ['wirid']
handler.tags = ['islam']
handler.command = /^(wirid)$/i


module.exports = handler
