var handler = async (m, {
	conn,
	usedPrefix
}) => {
	var user = db.data.users[m.sender]
	var __timers = (new Date - global.db.data.users[m.sender].lastlumber)
	var _timers = (10800000 - __timers)
	var timers = clockString(_timers)
	if (user.stamina < 20) return m.reply('Stamina anda tidak cukup untuk menebang\nharap isi stamina anda dengan _${usedPrefix} eat_')
	if (user.axe < 1) return m.reply('*Kamu tidak memiliki axe*\n*Silahkan membeli axe di shop dengan mengetik atau _${usedPrefix} craft axe_ agar kamu bisa menebang*')
	if (user.axedurability < 10) return m.reply('Durability axe anda kurang\nSilahkam repair axe agar bisa menebang dengan menggunakan command _${usedPrefix} repair axe_')
	if (user.lastlumber > 500000) throw m.reply('Kamu masih kelelahan untuk Menebang\nHarap tunggu ${timers} lagi untuk menebang')
	user.axedurability -= 5
	user.stamina -= 20
	user.money += 30000
	user.kayu += 300
	user.exp += 100
	user.lastlumber = new Date * 1
	setTimeout(() => {
		m.reply(`Kamu Menjadi Penebang Pohon Dan Kamu Mendapat *20000* money , *100* exp dan 300 kayu\nStamina anda berkurang -20`)
	}, 30000)

	setTimeout(() => {
		m.reply('*Mengecek hasil*')
	}, 20000)

	setTimeout(() => {
		m.reply(`*Menaruh Ke Dalam Gudang*`)
	}, 15000)

	setTimeout(() => {
		m.reply('*Mengambil Batang Pohon*')
	}, 10000)

	setTimeout(() => {
		m.reply('*Nguenggg*')
	}, 5000)

	setTimeout(() => {
		m.reply('_*Proses Menebang...*_')
	}, 0)
}
handler.help = ['nebang']
handler.tags = ['rpg']
handler.command = /^(nebang)$/i
handler.register = true
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