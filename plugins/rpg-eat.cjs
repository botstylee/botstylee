var foods = {
	ayamgoreng: { stamina: 20 }, ayambakar: { stamina: 20 }, oporayam: { stamina: 20 }, rendang: { stamina: 20 },
	steak: { stamina: 20 }, gulaiayam: { stamina: 20, item: 'gulai' }, babipanggang: { stamina: 20 }, soda: { stamina: 20 },
	vodka: { stamina: 25 }, sushi: { stamina: 20 }, roti: { stamina: 20 }, gadogado: { stamina: 50 }, jagungbakar: { stamina: 20 },
	kentanggoreng: { stamina: 20 }, suplabu: { stamina: 20 }, tumiskangkung: { stamina: 20 }, popcorn: { stamina: 20 },
	bandage: { health: 25 }, ganja: { health: 90 }
}
var labels = {
	ayamgoreng: 'Ayam goreng', ayambakar: 'Ayam bakar', oporayam: 'Opor ayam', rendang: 'Rendang', steak: 'Steak',
	gulaiayam: 'Gulai ayam', babipanggang: 'Babi panggang', soda: 'Soda', vodka: 'Vodka', sushi: 'Sushi', roti: 'Roti',
	gadogado: 'Gado-gado', jagungbakar: 'Jagung bakar', kentanggoreng: 'Kentang goreng', suplabu: 'Sup labu',
	tumiskangkung: 'Tumis kangkung', popcorn: 'Popcorn', bandage: 'Bandage', ganja: 'Ganja'
}
var handler = async (m, { args = [], usedPrefix, command }) => {
	var user = global.db?.data?.users?.[m.sender]
	if (!user) throw 'Data pengguna belum tersedia.'
	var item = String(args[0] || '').toLowerCase()
	var count = Math.max(1, Math.min(9999, Number.parseInt(args[1], 10) || 1))
	if (!item) return m.reply(`*Makanan/barang konsumsi*\n${Object.keys(foods).map(key => `• ${key}${foods[key].stamina ? ` (+${foods[key].stamina} stamina)` : ` (+${foods[key].health} health)`}`).join('\n')}\n\nContoh: ${usedPrefix}${command} roti 2`)
	var food = foods[item]
	if (!food) return m.reply(`Item tidak dikenal. Ketik ${usedPrefix}${command} untuk melihat daftar.`)
	var inventoryKey = food.item || item
	if ((Number(user[inventoryKey]) || 0) < count) return m.reply(`Persediaan ${labels[item]} tidak cukup.`)
	var attribute = food.stamina ? 'stamina' : 'health'
	var current = Number(user[attribute]) || 0
	var max = attribute === 'health' ? 100 : 100
	if (current >= max) return m.reply(`${attribute === 'health' ? 'Health' : 'Stamina'} kamu sudah penuh.`)
	user[inventoryKey] = (Number(user[inventoryKey]) || 0) - count
	user[attribute] = Math.min(max, current + food[attribute] * count)
	return m.reply(`Menggunakan ${count} ${labels[item]}. ${attribute === 'health' ? 'Health' : 'Stamina'}: ${current} → ${user[attribute]}.`)
}
handler.help = ['eat [makanan] [jumlah]', 'makan [makanan] [jumlah]']
handler.tags = ['rpg']
handler.register = true
handler.command = /^(eat|makan)$/i
module.exports = handler
