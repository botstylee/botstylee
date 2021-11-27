const { wattpad, random_detail } = require("../lib/wattpad.js")
let handler = async (m, { text,usedPrefix,command }) => {
  if (!text) return m.reply('Cari apa?\nmisal\n'+usedPrefix+command+' tokyo ghoul')
var a = await random_detail(text)
var b = `*📜 Judul:* ${a.judul}\n*📄 Desc:* ${a.desc}\n*📖 Total read:* ${a.reads}\n*📈 Total Vote:* ${a.votes}\n*📕 Total chapter:* ${a.chapters}\n*🕕 Duration:* ${a.duration}\n*🌐 Link:* ${a.link}\n*👤 Author:* ${a.author}\n*👀 See profil author*: ${a.link_author}\n\n\n*📚 READ ALL CHAPTERS*\n\n ${a.read_chapters.map((a,b)=>`*_DATA KE ${b + 1}_*\n\n*📓 Title Chapter:* ${a.title_part}\n*🌐 Link Chapter:* ${a.link_part}`).join('\n\n\n')}`
  m.reply(b)
}
handler.help = ['wattpad_detail [text]']
handler.tags = ['tools']
handler.command = /^wattpad_detail$/i

module.exports = handler
