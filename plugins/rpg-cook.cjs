var recipes = {
	ayambakar: { ingredients: { ayam: 2, coal: 1 }, output: 'ayambakar' },
	ayamgoreng: { ingredients: { ayam: 2, coal: 1 }, output: 'ayamgoreng' },
	oporayam: { ingredients: { ayam: 2, coal: 1 }, output: 'oporayam' },
	gulaiayam: { ingredients: { ayam: 2, coal: 1 }, output: 'gulai' },
	steak: { ingredients: { sapi: 2, coal: 1 }, output: 'steak' },
	rendang: { ingredients: { sapi: 2, coal: 1 }, output: 'rendang' },
	babipanggang: { ingredients: { babi: 2, coal: 1 }, output: 'babipanggang' },
	gadogado: { ingredients: { bayam: 2, kubis: 2, coal: 1 }, output: 'gadogado' },
	jagungbakar: { ingredients: { jagung: 2, coal: 1 }, output: 'jagungbakar' },
	kentanggoreng: { ingredients: { kentang: 2, coal: 1 }, output: 'kentanggoreng' },
	suplabu: { ingredients: { labu: 2, coal: 1 }, output: 'suplabu' },
	tumiskangkung: { ingredients: { kangkung: 2, coal: 1 }, output: 'tumiskangkung' },
	popcorn: { ingredients: { jagung: 2, coal: 1 }, output: 'popcorn' }
}
var handler = async (m, { args = [], usedPrefix, command }) => {
	var user = global.db?.data?.users?.[m.sender]
	if (!user) throw 'Data pengguna belum tersedia.'
	var type = String(args[0] || '').toLowerCase()
	var count = Math.max(1, Math.min(5, Number.parseInt(args[1], 10) || 1))
	if (!type) return m.reply(`*Resep masakan*\n${Object.entries(recipes).map(([name, recipe]) => `• ${name}: ${Object.entries(recipe.ingredients).map(([ingredient, amount]) => `${amount} ${ingredient}`).join(' + ')}`).join('\n')}\n\nContoh: ${usedPrefix}${command} ayambakar 2`)
	var recipe = recipes[type]
	if (!recipe) return m.reply(`Masakan tidak dikenal. Ketik ${usedPrefix}${command} untuk melihat resep.`)
	for (var [ingredient, amount] of Object.entries(recipe.ingredients)) {
		if ((Number(user[ingredient]) || 0) < amount * count) return m.reply(`Bahan tidak cukup: perlu ${amount * count} ${ingredient}.`)
	}
	for (var [ingredient, amount] of Object.entries(recipe.ingredients)) user[ingredient] = (Number(user[ingredient]) || 0) - amount * count
	user[recipe.output] = (Number(user[recipe.output]) || 0) + count
	return m.reply(`Berhasil memasak ${count} ${type}.`)
}
handler.help = ['cook <masakan> [jumlah]', 'masak <masakan> [jumlah]']
handler.tags = ['rpg']
handler.register = true
handler.command = /^(masak|cook)$/i
module.exports = handler
