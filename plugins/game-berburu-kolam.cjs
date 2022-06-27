let levelling = require('../lib/levelling.cjs')
let handler = async (m, {
	conn,
	usedPrefix
}) => {
	let paus = db.data.users[m.sender].paus
	let kepiting = db.data.users[m.sender].kepiting
	let gurita = db.data.users[m.sender].gurita
	let cumi = db.data.users[m.sender].cumi
	let buntal = db.data.users[m.sender].buntal
	let dory = db.data.users[m.sender].dory
	let lumba = db.data.users[m.sender].lumba
	let lobster = db.data.users[m.sender].lobster
	let hiu = db.data.users[m.sender].hiu
	let udang = db.data.users[m.sender].udang
	let ikan = db.data.users[m.sender].ikan
	let orca = db.data.users[m.sender].orca

	let ndy = `
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

 *${author}*    
 `.trim()
	conn.reply(m.chat, ndy, m)
}
handler.help = ['kolam']
handler.customPrefix = ['kolam']
handler.command = new RegExp

module.exports = handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)