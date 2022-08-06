var handler = async (m, {
	conn,
	usedPrefix
}) => {
	var banteng = db.data.users[m.sender].banteng
	var harimau = db.data.users[m.sender].harimau
	var gajah = db.data.users[m.sender].gajah
	var kambing = db.data.users[m.sender].kambing
	var panda = db.data.users[m.sender].panda
	var buaya = db.data.users[m.sender].buaya
	var kerbau = db.data.users[m.sender].kerbau
	var sapi = db.data.users[m.sender].sapi
	var monyet = db.data.users[m.sender].monyet
	var babihutan = db.data.users[m.sender].babihutan
	var babi = db.data.users[m.sender].babi
	var ayam = db.data.users[m.sender].ayam

	var ndy = `
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
 
 *${author}*
 `.trim()
	conn.reply(m.chat, ndy, m)
}
handler.help = ['kandang']
handler.customPrefix = ['kandang']
handler.command = new RegExp

module.exports = handler

var more = String.fromCharCode(8206)
var readMore = more.repeat(4001)