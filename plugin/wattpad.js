const { wattpad, random_detail } = require("../lib/wattpad.js")
let handler = async (m, { text,usedPrefix,command }) => {
  if (!text) return m.reply('Cari apa?\nmisal\n'+usedPrefix+command+' tokyo ghoul')
var a = await wattpad(text)
var b = a.map((v, i) => `_*DATA KE ${i + 1}*_\n\n*📜 Title:* ${v.judul}\n*📄 Description:* ${v.desc}\n*📖 Total Read:* ${v.reads}\n*📈 Total Vote:* ${v.votes}\n*📕 Total Chapters:* ${v.chapters}\n*🕕 Duration:* ${v.durations}\n*🌐 Link:* ${v.link}`).join('\n\n\n*_$_-_-_-_-_-_-_-_-_-_$_*\n\n\n')
  m.reply(b)
}
handler.help = ['wattpad [text]']
handler.tags = ['tools']
handler.command = /^wattpad$/i

module.exports = handler
