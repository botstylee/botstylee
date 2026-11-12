var handler = async (m, { usedPrefix }) => {
	var user = global.db?.data?.users?.[m.sender]
	if (!user) throw 'Data pengguna belum tersedia. Coba lagi sebentar.'

	var cooldown = 500000
	var elapsed = Date.now() - (Number(user.lasthunt) || 0)
	var remaining = cooldown - elapsed
	if (remaining > 0) return m.reply(`Kamu masih kelelahan. Coba lagi dalam ${clockString(remaining)}.`)
	if ((Number(user.stamina) || 0) < 20) return m.reply(`Stamina tidak cukup untuk berburu. Isi stamina dengan ${usedPrefix}eat.`)
	if ((Number(user.sword) || 0) < 1) return m.reply(`Kamu belum memiliki sword. Beli di shop dengan ${usedPrefix}craft sword.`)
	if ((Number(user.sworddurability) || 0) < 10) return m.reply(`Durability sword kurang. Perbaiki dengan ${usedPrefix}repair sword.`)

	var animals = [
		['banteng', '🐂'], ['harimau', '🐅'], ['gajah', '🐘'], ['kambing', '🐐'],
		['panda', '🐼'], ['buaya', '🐊'], ['kerbau', '🐃'], ['sapi', '🐮'],
		['monyet', '🐒'], ['babihutan', '🐗'], ['babi', '🐖'], ['ayam', '🐓']
	]
	var found = animals.map(([animal, emoji]) => {
		var amount = Math.floor(Math.random() * 10)
		user[animal] = (Number(user[animal]) || 0) + amount
		return `${emoji} ${animal}: ${amount}`
	})

	user.stamina = (Number(user.stamina) || 0) - 20
	user.sworddurability = (Number(user.sworddurability) || 0) - 10
	user.lasthunt = Date.now()

	return m.reply(`*Hasil berburu*\n\n${found.join('\n')}\n\nStamina berkurang 20.`)
}
handler.help = ['berburu']
handler.tags = ['berburu']
handler.command = /^(berburu)$/i
handler.register = true
module.exports = handler

function clockString(ms) {
	var totalSeconds = Math.ceil(Math.max(0, ms) / 1000)
	var hours = Math.floor(totalSeconds / 3600)
	var minutes = Math.floor((totalSeconds % 3600) / 60)
	var seconds = totalSeconds % 60
	return [hours, minutes, seconds].map(value => String(value).padStart(2, '0')).join(':')
}
