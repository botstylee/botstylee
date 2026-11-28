var pilihan = ['batu', 'gunting', 'kertas']

var Case = str => str[0].toUpperCase() + str.slice(1).toLowerCase()

var handler = async (m, {
	conn,
	text,
	usedPrefix
}) => {
	var salah = `Pilihan yang tersedia: Gunting, Kertas, Batu\n\n*Contoh* : ${usedPrefix}suit gunting`

	if (!text) return conn.reply(m.chat, salah, m)
	if (!pilihan.includes(text.toLowerCase())) return conn.reply(m.chat, salah, m)

	var suitP1 = pilihan.indexOf(text.toLowerCase())
	var suitPC = Math.floor(Math.random() * 3)
	var kamu = Case(pilihan[suitP1])
	var bot = Case(pilihan[suitPC])
	var state = `Kamu: ${kamu}\nBot: ${bot}`

	// ✅ Ambil db dengan fallback
	var db = global.db || require('../lib/database.js').default
	if (!db?.data?.users?.[m.sender]) {
		return conn.reply(m.chat, 'Data user tidak ditemukan.', m)
	}

	var user = db.data.users[m.sender]

	// ✅ Inisialisasi mp kalau belum ada
	if (typeof user.mp !== 'number') user.mp = 0

	if (user.mp < 1000) {
		return conn.reply(m.chat, 'MP kamu gak cukup untuk bermain game ini, dibutuhkan minimal 1000 MP', m)
	}

	if (suitP1 === suitPC) {
		user.mp += 1000
		await conn.reply(m.chat, `*Kita Seri*\n\n${state}\n\nPoin (±) 1000 MP`, m)
	} else if ((suitP1 + 1) % 3 === suitPC) {
		user.mp += 1500
		await conn.reply(m.chat, `*Kamu Menang*\n\n${state}\n\nPoin (+) 1500 MP`, m)
	} else if ((suitP1 - 1) % 3 === suitPC) {
		user.mp -= 900
		await conn.reply(m.chat, `*Kamu Kalah*\n\n${state}\n\nPoin (-) 900 MP`, m)
	} else {
		await conn.reply(m.chat, 'Terjadi kesalahan dalam menentukan pemenang.', m)
	}
}

handler.help = ['suit [gunting|batu|kertas]']
handler.tags = ['game']
handler.level = 15
handler.command = /^suit$/i

module.exports = handler
