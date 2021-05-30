let { performance } = require('perf_hooks')
let fs = require ('fs')
let path = require('path')
let handler  = async (m, { conn, usedPrefix }) => { 
  let package = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json')))
  let _uptime = process.uptime() * 1000
  let uptime = clockString(_uptime) 
  let totalreg = Object.keys(global.DATABASE._data.users).length
  let old = Math.round(performance.now())
  await m.reply('wait Kakak!!')
  let neww = Math.round(performance.now())
  conn.reply(m.chat, `
╠═〘 ${package.name} 〙 ═
╠➥ *Versi:* ${package.version}
╠➥ *Issue:* ${package.bugs.url}
╠➥ *Prefix:* ' ${usedPrefix} '
╠➥ *Menu:* ${usedPrefix}menu
╠➥ *Ping:* ${neww - old} *ms*
╠➥ *Total user:* ${totalreg} *user*
╠➥ *Uptime:* ${uptime}
║
╠═〘 DONASI 〙 ═
╠➥ Indosat [082114499086]
╠➥ Gopay [082114499086]
╠➥ Saweria [https://saweria.co/botstyle]
║
╠═ Request? ${package.bugs.url}
╠═ officiall Group *${conn.getName(conn.user.jid)}* :
${(global.linkGC).map((v, i) => '║ *Group ' + (i + 1) + '*\n║' + v).join`\n║\n`}
║
║${readMore}
╠═〘 PIRACY BOT_STYLE 〙 ═
╠➥ *KAMI TIDAK BERTANGGUNG*
║   *JAWAB ATAS PENYALAH*
║   *GUNAAN BOT*
╠➥ *KAMI TIDAK BERTANGGUNG*
║   *JAWAB ATAS KEBOCORAN DATA*
║   *PRIBADI ANDA*
╠➥ *KAMI AKAN MENYIMPAN DATA*
║   *SEPERTI NOMER TELEPON*
║   *ANDA DI DATABASE KAMI*
║ 
║ 
╠═ ©2021 ${package.name}
╠═ Scrip original by Norutomo
╠═ Creator : Benniismael
╠═ Api xsteam :St4r
╠═ Api Bsbt : Benniismael
╠═ Resta
╠═ Ariq
╠═〘 BOT_STYLE 〙 ═
`.trim(), m)
}
handler.help = ['info']
handler.tags = ['about']
handler.command = /^(info(bot)?)$/i

handler.fail = null

module.exports = handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)

function clockString(ms) {
  let h = Math.floor(ms / 3600000)
  let m = Math.floor(ms / 60000) % 60
  let s = Math.floor(ms / 1000) % 60
  console.log({ms,h,m,s})
  return [h, m, s].map(v => v.toString().padStart(2, 0) ).join(':')
}
