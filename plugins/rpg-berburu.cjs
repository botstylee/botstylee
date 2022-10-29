var handler = async (m, {
	conn,
	usedPrefix
}) => {
	var user = global.db.data.users[m.sender]
	var __timers = (new Date - user.lasthunt)
	var _timers = (500000 - __timers)
	var timers = clockString(_timers)

	if (user.stamina < 20) return m.reply('Stamina anda tidak cukup untuk berburu\nharap isi stamina anda dengan _${usedPrefix}eat_')
	if (user.sword < 1) return m.reply('*Kamu tidak memiliki sword*\n*Silahkan membeli sword si shop dengan mengetik _${usedPrefix}craft sword_ agar kamu bisa berburu*')
	if (user.sworddurability < 10) return m.reply('Durability sword anda kurang\nSilahkam repair sword agar bisa berburu dengan menggunakan command _${usedPrefix}repair sword_')
	if (user.lasthunt > 500000) throw m.reply('Kamu masih kelelahan untuk berburu\nHarap tunggu ${timers} lagi untuk berburu')

	var randomaku1 = `${Math.floor(Math.random() * 10)}`
	var randomaku2 = `${Math.floor(Math.random() * 10)}`
	var randomaku4 = `${Math.floor(Math.random() * 10)}`
	var randomaku3 = `${Math.floor(Math.random() * 10)}`
	var randomaku5 = `${Math.floor(Math.random() * 10)}`
	var randomaku6 = `${Math.floor(Math.random() * 10)}`
	var randomaku7 = `${Math.floor(Math.random() * 10)}`
	var randomaku8 = `${Math.floor(Math.random() * 10)}`
	var randomaku9 = `${Math.floor(Math.random() * 10)}`
	var randomaku10 = `${Math.floor(Math.random() * 10)}`
	var randomaku11 = `${Math.floor(Math.random() * 10)}`
	var randomaku12 = `${Math.floor(Math.random() * 10)}`
		.trim()

	var rbrb1 = (randomaku1 * 1)
	var rbrb2 = (randomaku2 * 1)
	var rbrb3 = (randomaku3 * 1)
	var rbrb4 = (randomaku4 * 1)
	var rbrb5 = (randomaku5 * 1)
	var rbrb6 = (randomaku6 * 1)
	var rbrb7 = (randomaku7 * 1)
	var rbrb8 = (randomaku8 * 1)
	var rbrb9 = (randomaku9 * 1)
	var rbrb10 = (randomaku10 * 1)
	var rbrb11 = (randomaku11 * 1)
	var rbrb12 = (randomaku12 * 1)

	baba1 = `${rbrb1}`
	baba2 = `${rbrb2}`
	baba3 = `${rbrb3}`
	baba4 = `${rbrb4}`
	baba5 = `${rbrb5}`
	baba6 = `${rbrb6}`
	baba7 = `${rbrb7}`
	baba8 = `${rbrb8}`
	baba9 = `${rbrb9}`
	baba10 = `${rbrb10}`
	baba11 = `${rbrb11}`
	baba12 = `${rbrb12}`

	hsl = `
* Hasil Berburu Kali Ini *

 *🐂 = [ ${baba1} ]*		 	*🐃 = [ ${baba7} ]*
 *🐅 = [ ${baba2} ]*			 *🐮 = [ ${baba8} ]*
 *🐘 = [ ${baba3} ]*			 *🐒 = [ ${baba9} ]*
 *🐐 = [ ${baba4} ]*			 *🐗 = [ ${baba10} ]*
 *🐼 = [ ${baba5} ]*			 *🐖 = [ ${baba11} ]*
 *🐊 = [ ${baba6} ]*	     	*🐓 = [ ${baba12} ]*
 
 Stamina anda berkurang -20
`
	user.banteng += rbrb1
	user.harimau += rbrb2
	user.gajah += rbrb3
	user.kambing += rbrb4
	user.panda += rbrb5
	user.buaya += rbrb6
	user.kerbau += rbrb7
	user.sapi += rbrb8
	user.monyet += rbrb9
	user.babihutan += rbrb10
	user.babi += rbrb11
	user.ayam += rbrb12
	user.stamina -= 20

	setTimeout(() => {
		m.reply(`${hsl}`)
	}, 40000)

	setTimeout(() => {
		m.reply(`*DUAR*`)
	}, 30000)

	setTimeout(() => {
		m.reply('NGIOONG')
	}, 25000)

	setTimeout(() => {
		m.reply('PIW PIW PIW')
	}, 20000)

	setTimeout(() => {
		m.reply('*menemukan target*')
	}, 15000)

	setTimeout(() => {
		m.reply('_Sedang Berburu..._')
	}, 0)
	user.lasthunt = new Date * 1
	user.sworddurability -= 10

}
handler.help = ['berburu']
handler.tags = ['berburu']
handler.command = /^(berburu)$/i
handler.register = true
module.exports = handler

function clockString(ms) {
	var h = Math.floor(ms / 3600000)
	var m = Math.floor(ms / 60000) % 60
	var s = Math.floor(ms / 1000) % 60
	console.log({
		ms,
		h,
		m,
		s
	})
	return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}