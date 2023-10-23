var pilihan = ['batu', 'gunting', 'kertas']
var Case = str => str[0].toUpperCase() + str.slice(1).toLowerCase()
var handler = async (m, {
	text,
	usedPrefix
}) => {
	var salah = `Pilihan yang tersedia Gunting, Kertas, Batu\n\n*Contoh* : ${usedPrefix}suit gunting\n`
	if (!text) throw salah
	if (!pilihan.includes(text.toLowerCase())) throw salah
	var suitP1 = pilihan.indexOf(text.toLowerCase())
	var suitPC = Math.floor(Math.random() * 3)
	var kamu = Case(pilihan[suitP1])
	var bot = Case(pilihan[suitPC])
	var state = `Kamu: ${kamu}\nBot: ${bot}`
	var user = db.data.users[m.sender]
	if (user.mp < 1000) throw 'MP kamu gak cukup untuk bermain game ini, di butuhkan minimal 1000 MP'
	if (suitP1 === suitPC) {
		user.mp += 1000
		m.reply(`*Kita Seri*\n\n${state}\n\nPoin (±) 1000 MP`)
	} else if ((suitP1 + 1) % 3 === suitPC) {
		user.mp += 1500
		m.reply(`*Kamu Menang*\n\n${state}\n\nPoin (+)1500 MP`)
	} else if ((suitP1 - 1) % 3 === suitPC) {
		user.mp -= 900
		m.reply(`*Kamu Kalah*\n\n${state}\n\nPoin (-)900 MP`)
	} else throw 'Terjadi kesalahan'
}
handler.help = ['suit [gunting|batu|kertas]']
handler.tags = ['game']
handler.level = 15
handler.command = /^suit$/i

export default handler