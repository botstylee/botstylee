var recipes = {
	pickaxe: { ingredients: { stick: 10, iron: 15 }, output: 'pickaxe', durability: 'pickaxedurability', amount: 20 },
	axe: { ingredients: { stick: 10, iron: 15 }, output: 'axe', durability: 'axedurability', amount: 20 },
	sword: { ingredients: { stick: 5, iron: 10 }, output: 'sword', durability: 'sworddurability', amount: 20 },
	fishingrod: { ingredients: { stick: 10, string: 20 }, output: 'fishingrod', durability: 'fishingroddurability', amount: 20 },
	stick: { ingredients: { wood: 1 }, output: 'stick', amount: 2 },
	glass: { ingredients: { sand: 6, coal: 1 }, output: 'glass', amount: 3 },
	brick: { ingredients: { clay: 6, coal: 1 }, output: 'brick', amount: 3 }
}

var handler = async (m, { args = [], usedPrefix, command }) => {
	var user = global.db?.data?.users?.[m.sender]
	if (!user) throw 'Data pengguna belum tersedia.'
	var type = String(args[0] || '').toLowerCase()
	var count = Math.max(1, Math.min(9999, Number.parseInt(args[1], 10) || 1))
	var isBurn = /^(burn|bakar)$/i.test(command)
	if (!type) {
		var available = Object.entries(recipes).filter(([name]) => isBurn ? ['glass', 'brick'].includes(name) : !['glass', 'brick'].includes(name))
		return m.reply(`*${isBurn ? 'Burning' : 'Crafting'} recipes*\n${available.map(([name, recipe]) => `• ${name}: ${Object.entries(recipe.ingredients).map(([item, amount]) => `${amount} ${item}`).join(' + ')} → ${recipe.amount} ${recipe.output}`).join('\n')}\n\nContoh: ${usedPrefix}${command} ${isBurn ? 'glass' : 'pickaxe'} 2`)
	}
	var recipe = recipes[type]
	if (!recipe || (isBurn !== ['glass', 'brick'].includes(type))) return m.reply(`Item tidak dikenal. Ketik ${usedPrefix}${command} untuk melihat resep.`)
	for (var [item, amount] of Object.entries(recipe.ingredients)) {
		if ((Number(user[item]) || 0) < amount * count) return m.reply(`Bahan tidak cukup: perlu ${amount * count} ${item}.`)
	}
	for (var [item, amount] of Object.entries(recipe.ingredients)) user[item] = (Number(user[item]) || 0) - amount * count
	user[recipe.output] = (Number(user[recipe.output]) || 0) + recipe.amount * count
	if (recipe.durability) user[recipe.durability] = (Number(user[recipe.durability]) || 0) + recipe.amount * count
	return m.reply(`Berhasil ${isBurn ? 'membakar' : 'membuat'} ${recipe.amount * count} ${recipe.output}.`)
}
handler.help = ['craft [item] [jumlah]', 'burn [glass|brick] [jumlah]']
handler.tags = ['rpg']
handler.command = /^(craft|crafting|burn|bakar)$/i
module.exports = handler
