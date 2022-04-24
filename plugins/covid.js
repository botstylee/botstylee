let { Presence } = require('@adiwajshing/baileys')
let fetch = require('node-fetch')
const format = num => {
  const n = String(num),
        p = n.indexOf('.')
  return n.replace(
      /\d(?=(?:\d{3})+(?:\.|$))/g,
      (m, i) => p < 0 || i < p ? `${m},` : m
  )
}
let handler  = async (m, { conn, args, usedPrefix, command }) => {
	if (!args || !args[0]) return conn.reply(m.chat, `⺀ Format salah!\n\n*Contoh* : _${usedPrefix + command} tokyo_`, m)
	let text = args.join` `
	await conn.updatePresence(m.chat, Presence.composing) 
	conn.reply(m.chat, `*Mencari data . . .*`, m)
	fetch("https://services5.arcgis.com/VS6HdKS0VfIhv8Ct/arcgis/rest/services/COVID19_Indonesia_per_Provinsi/FeatureServer/0/query?where=Provinsi%20%3D%20'" + encodeURIComponent(text) + "'&outFields=*&outSR=4326&f=json")
  .then(res => res.json())
  .then(batch => {
    conn.updatePresence(m.chat, Presence.composing) 
    conn.reply(m.chat, `*DATA Covid-19 Provinsia ${batch.features[0].attributes.Provinsi}*\n\nKasus positif = ${format(batch.features[0].attributes.Kasus_Posi)}\nKasus sembuh = ${format(batch.features[0].attributes.Kasus_Semb)}\nKasus kematian = ${format(batch.features[0].attributes.Kasus_Meni)}`, m)
  }) .catch(() => { conn.reply(m.chat, `_Masukkan nama provinsi yang benar !_`, m) })
}
handler.help = ['covid'].map(v => v + ' *provinsia*')
handler.tags = ['tools']
handler.command = /^(covid)$/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = false
handler.private = false
handler.admin = false
handler.botAdmin = false
handler.fail = null
handler.limit = false
handler.exp = 500
module.exports = handler
