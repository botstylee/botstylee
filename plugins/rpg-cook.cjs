// plugins/rpg-masak.cjs
// Fitur: Masak makanan dari bahan mentah

var handler = async (m, {
	command,
	usedPrefix,
	args
}) => {
	// Guard: user harus terdaftar
	var user = db.data.users[m.sender]
	if (!user) return m.reply('Kamu belum terdaftar di database.')

	// Daftar resep: [nama, bahan1, jumlah1, bahan2, jumlah2, hasil]
	var resep = {
		ayambakar:     { bahan: { ayam: 2, coal: 1 },     hasil: 'ayambakar',     label: 'Ayam Bakar 🍖' },
		ayamgoreng:    { bahan: { ayam: 2, coal: 1 },     hasil: 'ayamgoreng',    label: 'Ayam Goreng 🍗' },
		oporayam:      { bahan: { ayam: 2, coal: 1 },     hasil: 'oporayam',      label: 'Opor Ayam 🍜' },
		steak:         { bahan: { sapi: 2, coal: 1 },     hasil: 'steak',         label: 'Steak 🥩' },
		rendang:       { bahan: { sapi: 2, coal: 1 },     hasil: 'rendang',       label: 'Rendang 🥘' },
		gulaiayam:     { bahan: { ayam: 2, coal: 1 },     hasil: 'gulaiayam',     label: 'Gulai Ayam 🍲' },
		babipanggang:  { bahan: { babi: 2, coal: 1 },     hasil: 'babipanggang',  label: 'Babi Panggang 🥠' },
		gadogado:      { bahan: { bayam: 2, kubis: 2, coal: 1 }, hasil: 'gadogado', label: 'Gado Gado 🥗' },
		jagungbakar:   { bahan: { jagung: 2, coal: 1 },   hasil: 'jagungbakar',   label: 'Jagung Bakar 🌽' },
		kentanggoreng: { bahan: { kentang: 2, coal: 1 },  hasil: 'kentanggoreng', label: 'Kentang Goreng 🍟' },
		suplabu:       { bahan: { labu: 2, coal: 1 },     hasil: 'suplabu',       label: 'Sup Labu 🥣' },
		tumiskangkung: { bahan: { kangkung: 2, coal: 1 }, hasil: 'tumiskangkung', label: 'Tumis Kangkung 🥗' },
		popcorn:       { bahan: { jagung: 2, coal: 1 },   hasil: 'popcorn',       label: 'Pop Corn 🍿' }
	}

	var type = (args[0] || '').toLowerCase()

	// Kalau tidak ada argumen atau type tidak valid → tampilkan daftar resep
	if (!type || !resep[type]) {
		var daftar = Object.entries(resep).map(([key, r]) => {
			var bahan = Object.entries(r.bahan).map(([b, j]) => `${j} ${b}`).join(' & ')
			return `▧ ${r.label}\n  〉 Butuh ${bahan}`
		}).join('\n')

		return conn.sendMessage(m.chat, {
			text: `*「 C O O K I N G 」*\n\n${daftar}\n\nContoh: ${usedPrefix}${command} ayambakar 1`
		}, { quoted: m })
	}

	// Parse jumlah (default 1, max 5)
	var count = args[1] ? Math.min(5, Math.max(parseInt(args[1]) || 1, 1)) : 1

	var r = resep[type]

	// Cek bahan
	for (var [bahan, jumlah] of Object.entries(r.bahan)) {
		var dimiliki = user[bahan] || 0
		if (dimiliki < jumlah * count) {
			return m.reply(
				`Anda tidak memiliki bahan untuk memasak ${r.label}\n` +
				`Butuh ${jumlah * count} ${bahan} (kamu punya ${dimiliki})`
			)
		}
	}

	// Kurangi bahan
	for (var [bahan, jumlah] of Object.entries(r.bahan)) {
		user[bahan] -= jumlah * count
	}

	// Tambah hasil
	user[r.hasil] = (user[r.hasil] || 0) + count

	await m.reply(`✅ Sukses memasak ${count} ${r.label}`)
}

handler.help = ['masak <masakan> <jumlah>', 'cook <masakan> <jumlah>']
handler.tags = ['rpg']
handler.register = true
handler.command = /^(masak|cook)$/i

module.exports = handler
