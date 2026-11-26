// plugins/rpg-eat.cjs
// Fitur: Makan/minum item untuk menambah stamina/health

var handler = async (m, {
	conn,
	command,
	usedPrefix,
	args
}) => {
	// Guard: user harus terdaftar
	var user = db.data.users[m.sender]
	if (!user) return m.reply('Kamu belum terdaftar di database.')

	// Daftar item: [nama, field, efek, tipe, pesan]
	var items = {
		ayamgoreng: { field: 'ayamgoreng', efek: 20, tipe: 'stamina', pesan: 'Nyam nyam' },
		ayambakar: { field: 'ayambakar', efek: 20, tipe: 'stamina', pesan: 'Nyam nyam' },
		oporayam: { field: 'oporayam', efek: 20, tipe: 'stamina', pesan: 'Nyam nyam' },
		rendang: { field: 'rendang', efek: 20, tipe: 'stamina', pesan: 'Nyam nyam' },
		steak: { field: 'steak', efek: 20, tipe: 'stamina', pesan: 'Nyam nyam' },
		gulaiayam: { field: 'gulaiayam', efek: 20, tipe: 'stamina', pesan: 'Nyam nyam' },
		babipanggang: { field: 'babipanggang', efek: 20, tipe: 'stamina', pesan: 'Nyam nyam' },
		soda: { field: 'soda', efek: 20, tipe: 'stamina', pesan: 'Glek glek glek' },
		vodka: { field: 'vodka', efek: 25, tipe: 'stamina', pesan: 'Glek Glek Glek' },
		ganja: { field: 'ganja', efek: 90, tipe: 'health', pesan: 'ngefly' },
		bandage: { field: 'bandage', efek: 25, tipe: 'health', pesan: 'Sretset' },
		sushi: { field: 'sushi', efek: 20, tipe: 'stamina', pesan: 'Nyam nyam' },
		roti: { field: 'roti', efek: 20, tipe: 'stamina', pesan: 'Nyam nyam' },
		gadogado: { field: 'gadogado', efek: 50, tipe: 'stamina', pesan: 'Nyam nyam' },
		jagungbakar: { field: 'jagungbakar', efek: 20, tipe: 'stamina', pesan: 'Nyam nyam' },
		kentanggoreng: { field: 'kentanggoreng', efek: 20, tipe: 'stamina', pesan: 'Nyam nyam' },
		suplabu: { field: 'suplabu', efek: 20, tipe: 'stamina', pesan: 'Nyam nyam' },
		tumiskangkung: { field: 'tumiskangkung', efek: 20, tipe: 'stamina', pesan: 'Nyam nyam' },
		popcorn: { field: 'popcorn', efek: 20, tipe: 'stamina', pesan: 'Nyam nyam' }
	}

	// Inisialisasi field
	if (typeof user.stamina !== 'number') user.stamina = 100
	if (typeof user.health !== 'number') user.health = 100
	for (var key of Object.keys(items)) {
		if (typeof user[key] !== 'number') user[key] = 0
	}

	var type = (args[0] || '').toLowerCase()
	var count = 1
	if (args[1] && args[1].length > 0) {
		var parsed = parseInt(args[1])
		if (!isNaN(parsed)) count = Math.min(99999999, Math.max(parsed, 1))
	}

	// Teks daftar (untuk default)
	var list = `
▧ 🍖 *Ayambakar*
▧ 🍗 *Ayamgoreng*
▧ 🥘 *Rendang*
▧ 🥩 *Steak*
▧ 🥠 *Babipanggang*
▧ 🍲 *Gulaiayam*
▧ 🍜 *Oporayam*
▧ 🍷 *Vodka*
▧ 🍣 *Sushi*
▧ 💉 *Bandage*
▧ ☘️ *Ganja*
▧ 🍺 *Soda*
▧ 🍞 *Roti*
▧ 🥗 *Gado Gado*
▧ 🌽 *Jagung Bakar*
▧ 🍟 *Kentang Goreng*
▧ 🥣 *Sup Labu*
▧ 🥗 *Tumis Kangkung*
▧ 🍿 *Pop Corn*

*Cara pakai:* ${usedPrefix}eat <item> <jumlah>
Contoh: ${usedPrefix}eat ayamgoreng 2
`.trim()

	// Cek item valid
	if (!items[type]) {
		return conn.sendMessage(m.chat, { text: list }, { quoted: m })
	}

	var item = items[type]
	var tipe = item.tipe // 'stamina' atau 'health'
	var current = user[tipe]
	var max = 100

	// Guard: sudah penuh
	if (current >= max) {
		return m.reply(`${tipe === 'stamina' ? 'Stamina' : 'Health'} kamu sudah penuh`)
	}

	// Guard: item cukup
	if (user[item.field] < count) {
		return m.reply(`${type} kamu kurang`)
	}

	// Proses makan
	user[item.field] -= count
	user[tipe] = Math.min(max, current + item.efek * count)

	return m.reply(item.pesan)
}

handler.help = ['eat', 'makan']
handler.tags = ['rpg']
handler.register = true
handler.command = /^(eat|makan)$/i

module.exports = handler
