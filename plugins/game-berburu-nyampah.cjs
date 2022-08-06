var handler = async (m, {
	conn
}) => {
	var __timers = (new Date - db.data.users[m.sender].lastclaim)
	var _timers = (43200000 - __timers)
	var timers = clockString(_timers)
	var user = db.data.users[m.sender]
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