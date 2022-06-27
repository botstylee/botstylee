let handler = async (m, {
	conn
}) => {
	let __timers = (new Date - db.data.users[m.sender].as)
	let _timers = (500000 - __timers)
	let timers = clockString(_timers)
	let user = db.data.users[m.sender]
	if (new Date - db.data.users[m.sender].as > 500000) {
		let randomaku1 = `${Math.floor(Math.random() * 10)}`
		let randomaku2 = `${Math.floor(Math.random() * 10)}`
		let randomaku4 = `${Math.floor(Math.random() * 10)}`
		let randomaku3 = `${Math.floor(Math.random() * 10)}`
		let randomaku5 = `${Math.floor(Math.random() * 10)}`
		let randomaku6 = `${Math.floor(Math.random() * 10)}`
		let randomaku7 = `${Math.floor(Math.random() * 10)}`
		let randomaku8 = `${Math.floor(Math.random() * 10)}`
		let randomaku9 = `${Math.floor(Math.random() * 10)}`
		let randomaku10 = `${Math.floor(Math.random() * 10)}`
		let randomaku11 = `${Math.floor(Math.random() * 10)}`
		let randomaku12 = `${Math.floor(Math.random() * 10)}`
			.trim()

		let rbrb1 = (randomaku1 * 1)
		let rbrb2 = (randomaku2 * 1)
		let rbrb3 = (randomaku3 * 1)
		let rbrb4 = (randomaku4 * 1)
		let rbrb5 = (randomaku5 * 1)
		let rbrb6 = (randomaku6 * 1)
		let rbrb7 = (randomaku7 * 1)
		let rbrb8 = (randomaku8 * 1)
		let rbrb9 = (randomaku9 * 1)
		let rbrb10 = (randomaku10 * 1)
		let rbrb11 = (randomaku11 * 1)
		let rbrb12 = (randomaku12 * 1)

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

 *🦀 = [ ${wuis1} ]*			*🐠 = [ ${wuis7} ]*
 *🦞 = [ ${wuis2} ]*			 *🐟 = [ ${wuis8} ]*
 *🦐 = [ ${wuis3} ]*			 *🐬 = [ ${wuis9} ]*
 *🦑 = [ ${wuis4} ]*			 *🐳 = [ ${wuis10} ]*
 *🐙 = [ ${wuis5} ]*			 *🦈 = [ ${wuis11} ]*
 *🐡 = [ ${wuis6} ]*			*🐋 = [${wuis12} ]*

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
		user.as = new Date * 1
	} else conn.sendButton(m.chat, `\n*Sepertinya Anda Sudah Kecapekan*\n*Silahkan Istirahat Dulu sekitar ${timers}*\n*Untuk bisa melanjutkan Memancing*\n`, author, null, [
		['Kolam', 'kolam']
	], m)
}
handler.help = ['mancing']
handler.tags = ['berburu']
handler.command = /^(mancing)$/i

module.exports = handler

function clockString(ms) {
	let h = Math.floor(ms / 3600000)
	let m = Math.floor(ms / 60000) % 60
	let s = Math.floor(ms / 1000) % 60
	console.log({
		ms,
		h,
		m,
		s
	})
	return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}