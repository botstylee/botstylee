let handler  = async (m, { conn, args }) => {
   m.reply(`BOTSTYLEE Ini Menggunakan Script Dari Github : https://github.com/botstylee/botstylee`)
}
 
handler.help = ['script']
handler.tags = ['about']
handler.command = /^(script)$/i

module.exports = handler
