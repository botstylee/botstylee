var levelling = require('../lib/levelling.cjs')
var handler = async (m, {
	conn,
	usedPrefix
}) => {
	var paus = db.data.users[m.sender].paus
	var kepiting = db.data.users[m.sender].kepiting
	var gurita = db.data.users[m.sender].gurita
	var cumi = db.data.users[m.sender].cumi
	var buntal = db.data.users[m.sender].buntal
	var dory = db.data.users[m.sender].dory
	var lumba = db.data.users[m.sender].lumba
	var lobster = db.data.users[m.sender].lobster
	var hiu = db.data.users[m.sender].hiu
	var udang = db.data.users[m.sender].udang
	var ikan = db.data.users[m.sender].ikan
	var orca = db.data.users[m.sender].orca

	var ndy = `
*《 KOLAM MU 》*

*➡️   ️ 🦀 = [ ${kepiting} ] Ekor Kepiting*
*➡️   ️ 🦞 = [ ${lobster} ] Ekor Lobster*
*➡️   ️ 🦐 = [ ${udang} ] Ekor Udang*
*➡️   ️ 🦑 = [ ${cumi} ] Ekor Cumi*
*➡️   ️ 🐙 = [ ${gurita} ] Ekor Gurita*
*➡️   ️ 🐡 = [ ${buntal} ] Ekor Buntal*
*➡️   ️ 🐠 = [ ${dory} ] Ekor Dory*
*➡️   ️ 🐟 = [ ${orca} ] Ekor Orca*
*➡️   ️ 🐬 = [ ${lumba} ] Ekor Lumba* 
*➡️   ️ 🐳 = [ ${paus} ] Ekor Paus*
*➡️   ️ 🦈 = [ ${hiu} ] Ekor Hiu*

 *${author}*
 `.trim()
	conn.reply(m.chat, ndy, m)
}
handler.help = ['kolam']
handler.customPrefix = ['kolam']
handler.command = new RegExp

module.exports = handler

var more = String.fromCharCode(8206)
var readMore = more.repeat(4001)