let limit = 10
let handler = async (m, { conn, text }) => {
if (!text) throw '_Textnya mana tod_'
let [kiri, kanan] = text.split('|')
await conn.sendFile(m.chat, global.API('https://api.zeks.xyz', '/api/phlogo', {
 text1: kiri,
 text2: kanan,
 theme: 'phlogo',
 apikey: 'apivinz'
}), 'Error', '_ini hasil dari phlogo nya sayang love you😘_', m)
}
handler.help = ['phlogo <text>']
handler.tags = ['creator']
handler.command = /^phlogo$/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = false
handler.private = false
handler.register = true
handler.admin = false
handler.botAdmin = false

handler.fail = null
handler.limit = true

module.exports = handler
