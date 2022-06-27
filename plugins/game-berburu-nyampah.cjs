let handler = async (m, {
	conn
}) => {
	let __timers = (new Date - db.data.users[m.sender].lastclaim)
	let _timers = (43200000 - __timers)
	let timers = clockString(_timers)
	let user = db.data.users[m.sender]
	if (new Date - db.data.users[m.sender].lastclaim > 43200000) {
		conn.reply(m.chat, `Kamu Menjadi Tukang Sampah Dan Kamu Mendapat *20000* MONEY`, m)
		user.money += 20000
		user.lastclaim = new Date * 0
	} else conn.reply(m.chat, `Silahkan Menunggu *${timers}* Lagi Untuk Bisa Bekerja Lagi`, m)
}
handler.help = ['nyampah']
handler.tags = ['berburu']
handler.command = /^(nyampah)$/i

handler.fail = null

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