var handler = async (m, {
	conn,
	usedPrefix
}) => {
	var user = db.data.users[m.sender]
	var __timers = (new Date - user.lastmining)
	var _timers = (500000 - __timers)
	var timers = clockString(_timers)
	if (user.pickaxe < 1) return m.reply('*Kamu tidak memiliki Pickaxe*\n*Silahkan membeli Pickaxe si shop dengan mengetik _${usedPrefix}buy pickaxe_ atau _${usedPrefix}craft pickaxe_ agar kamu bisa nambang*')
	if (user.pickaxedurability < 10) return m.reply('Durability pickaxe anda kurang\nSilahkan repair pickaxe agar bisa nambang dengan menggunakan command _${usedPrefix}repair pickaxe_')
	if (user.stamina < 20) return m.reply('Stamina anda tidak cukup untuk bekerja\nharap isi stamina anda dengan _#eat_')
	if (new Date - user.lastmining > 500000) {
		var randomaku1 = `${Math.floor(Math.random() * 5)}`
		var randomaku2 = `${Math.floor(Math.random() * 10)}`
		var randomaku4 = `${Math.floor(Math.random() * 7)}`
		var randomaku3 = `${Math.floor(Math.random() * 4)}`
		var randomaku5 = `${Math.floor(Math.random() * 200)}`
		var randomaku6 = `${Math.floor(Math.random() * 200)}`
		var randomaku7 = `${Math.floor(Math.random() * 20)}`
		var randomaku8 = `${Math.floor(Math.random() * 100)}`
		var randomaku9 = `${Math.floor(Math.random() * 100)}`
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

		wuis1 = `${rbrb1}`
		wuis2 = `${rbrb2}`
		wuis3 = `${rbrb3}`
		wuis4 = `${rbrb4}`
		wuis5 = `${rbrb5}`
		wuis6 = `${rbrb6}`
		wuis7 = `${rbrb7}`
		wuis8 = `${rbrb8}`
		wuis9 = `${rbrb9}`

		hsl = `
*《 Hasil Nambang Kali Ini 》*

 *💎 = [ ${wuis1} ] Diamond*
 *⛓️ = [ ${wuis2} ] Iron*
 *🪙 = [ ${wuis3} ] Gold*
 *💚 = [ ${wuis4} ] Emerald*
 *🪨 = [ ${wuis5} ] Rock*
 *🌕 = [ ${wuis6} ] Clay*
 *🕳️ = [ ${wuis7} ] Coal*
 *🌑 = [ ${wuis8} ] Sand*
 *✉️ = [ ${wuis9} ] Exp*
 
 Stamina anda berkurang -20
`
		user.diamond += rbrb1
		user.iron += rbrb2
		user.gold += rbrb3
		user.emerald += rbrb4
		user.rock += rbrb5
		user.clay += rbrb6
		user.coal += rbrb7
		user.sand += rbrb8
		user.exp += rbrb9
		user.stamina -= 20

		setTimeout(() => {
			m.reply(`${hsl}`)
		}, 20000)

		setTimeout(() => {
			m.reply(`Nah ini dia`)
		}, 18000)

		setTimeout(() => {
			m.reply('mulai menggali ore')
		}, 15000)

		setTimeout(() => {
			m.reply('Sabar')
		}, 14000)

		setTimeout(() => {
			m.reply('Masuk ke tambang dulu ngab')
		}, 0)
		user.lastmining = new Date * 1
		user.pickaxedurability -= 5
	} else conn.sendButton(m.chat, `\n*Sepertinya Anda Sudah Kecapekan*\n*Silahkan Istirahat Dulu sekitar ${timers}*\n*Untuk bisa melanjutkan Nambang*\n`, author, null, [
		['Inventory', '/inv']
	], m)
}
handler.help = ['mining', 'nambang']
handler.tags = ['rpg']
handler.command = /^(nambang|mining)$/i
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
