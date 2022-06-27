let handler = async (m, {
	conn,
	usedPrefix
}) => {
	let banteng = db.data.users[m.sender].banteng
	let harimau = db.data.users[m.sender].harimau
	let gajah = db.data.users[m.sender].gajah
	let kambing = db.data.users[m.sender].kambing
	let panda = db.data.users[m.sender].panda
	let buaya = db.data.users[m.sender].buaya
	let kerbau = db.data.users[m.sender].kerbau
	let sapi = db.data.users[m.sender].sapi
	let monyet = db.data.users[m.sender].monyet
	let babihutan = db.data.users[m.sender].babihutan
	let babi = db.data.users[m.sender].babi
	let ayam = db.data.users[m.sender].ayam

	let ndy = `
*《 KANDANG MU 》*
    
 *➡️   ️ 🐂 = [ ${banteng} ] Ekor Banteng*
 *➡️   ️ 🐅 = [ ${harimau} ] Ekor Harimau*
 *➡️   ️ 🐘 = [ ${gajah} ] Ekor Gajah*
 *➡️   ️ 🐐 = [ ${kambing} ] Ekor Kambing*
 *➡️   ️ 🐼 = [ ${panda} ] Ekor Panda*
 *➡️   ️ 🐊 = [ ${buaya} ] Ekor Buaya*
 *➡️   ️ 🐃 = [ ${kerbau} ] Ekor Kerbau*
 *➡️   ️ 🐮 = [ ${sapi} ] Ekor Sapi*
 *➡️   ️ 🐒 = [ ${monyet} ] Ekor Monyet*
 *➡️   ️ 🐗 = [ ${babihutan} ] Ekor Babi Hutan*
 *➡️   ️ 🐖 = [ ${babi} ] Ekor Babi*
 *➡️   ️ 🐓 = [ ${ayam} ] Ekor Ayam*
 
 *${author}*    
 `.trim()
	conn.reply(m.chat, ndy, m)
}
handler.help = ['kandang']
handler.customPrefix = ['kandang']
handler.command = new RegExp

module.exports = handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)