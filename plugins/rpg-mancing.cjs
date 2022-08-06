var handler = async (m, {
	conn,
	usedPrefix
}) => {
	var __timers = (new Date - db.data.users[m.sender].lastfishing)
	var _timers = (500000 - __timers)
	var timers = clockString(_timers)
	var user = db.data.users[m.sender]
	if (user.fishingrod < 1) return m.reply('*Kamu tidak memiliki fishingrod*\n*Silahkan membeli fishingrod si shop dengan mengetik atau _${usedPrefix}craft fishingrod_ agar kamu bisa mancing*')
	if (user.fishingroddurability < 5) return m.reply('Durability fishingrod anda kurang\nSilahkan repair fishingrod agar bisa mancing dengan menggunakan command _${usedPrefix}repair fishingrod_')
	if (user.stamina < 10) return m.reply('Sepertinya stamina anda kurang untuk memancing\nSilahkan isi stamina dengan cara ${usedPrefix}eat')
	if (new Date - db.data.users[m.sender].lastfishing > 500000) {
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

		wuis1 = `${rbrb1}`
		wuis2 = `${rbrb2}`
		wuis3 = `${rbrb3}`
		wuis4 = `${rbrb4}`
		wuis5 = `${rbrb5}`
		wuis6 = `${rbrb6}`
		wuis7 = `${rbrb7}`
		wuis8 = `${rbrb8}`
		wuis9 = `${rbrb9}`
		wuis10 = `${rbrb10}`
		wuis11 = `${rbrb11}`
		wuis12 = `${rbrb12}`

		hsl = `
*《 Hasil Memancing Kali Ini 》*

 *🦀 = [ ${wuis1} ]*		 	*🐠 = [ ${wuis7} ]*
 *🦞 = [ ${wuis2} ]*			 *🐟 = [ ${wuis8} ]*
 *🦐 = [ ${wuis3} ]*			 *🐬 = [ ${wuis9} ]*
 *🦑 = [ ${wuis4} ]*			 *🐳 = [ ${wuis10} ]*
 *🐙 = [ ${wuis5} ]*			 *🦈 = [ ${wuis11} ]*
 *🐡 = [ ${wuis6} ]*		 	*🐋 = [${wuis12} ]*

Stamina anda berkurang -20
`
		db.data.users[m.sender].paus += rbrb1
		db.data.users[m.sender].kepiting += rbrb2
		db.data.users[m.sender].gurita += rbrb3
		db.data.users[m.sender].cumi += rbrb4
		db.data.users[m.sender].buntal += rbrb5
		db.data.users[m.sender].dory += rbrb6
		db.data.users[m.sender].lumba += rbrb7
		db.data.users[m.sender].lobster += rbrb8
		db.data.users[m.sender].hiu += rbrb9
		db.data.users[m.sender].udang += rbrb10
		db.data.users[m.sender].ikan += rbrb11
		db.data.users[m.sender].orca += rbrb12
		db.data.users[m.sender].stamina -= 20

		setTimeout(() => {
			m.reply(`${hsl}`)
		}, 20000)

		setTimeout(() => {
			m.reply(`Nah ini dia`)
		}, 18000)

		setTimeout(() => {
			m.reply('Strike')
		}, 15000)

		setTimeout(() => {
			m.reply('Sabar')
		}, 14000)

		setTimeout(() => {
			m.reply('OTW tengah laut')
		}, 0)
		user.lastfishing = new Date * 1
		user.fishingroddurability -= 5
		user.stamina -= 10
	} else conn.sendButton(m.chat, `\n*Sepertinya Anda Sudah Kecapekan*\n*Silahkan Istirahat Dulu sekitar ${timers}*\n*Untuk bisa melanjutkan Memancing*\n`, author, null, [
		['Kolam', 'kolam']
	], m)
}
handler.help = ['mancing']
handler.tags = ['berburu']
handler.command = /^(mancing)$/i
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