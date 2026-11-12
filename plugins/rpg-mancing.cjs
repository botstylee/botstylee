var handler = async (m, { conn, usedPrefix }) => {
	var user = global.db?.data?.users?.[m.sender]
	if (!user) throw 'Data pengguna belum tersedia.'
	var now = Date.now()
	var cooldown = 500000
	var elapsed = now - (Number(user.lastfishing) || 0)
	var remaining = cooldown - elapsed
	if (remaining > 0) return m.reply(`Kamu masih kelelahan. Coba memancing lagi dalam ${clockString(remaining)}.`)
	if ((Number(user.fishingrod) || 0) < 1) return m.reply(`Kamu belum memiliki fishing rod. Buat dengan ${usedPrefix}craft fishingrod.`)
	if ((Number(user.fishingroddurability) || 0) < 5) return m.reply(`Durability fishing rod kurang. Perbaiki dengan ${usedPrefix}repair fishingrod.`)
	if ((Number(user.stamina) || 0) < 20) return m.reply(`Stamina tidak cukup. Pulihkan dengan ${usedPrefix}eat.`)

	var catches = [
		['paus', '🐳'], ['kepiting', '🦀'], ['gurita', '🐙'], ['cumi', '🦑'],
		['buntal', '🐡'], ['dory', '🐠'], ['lumba', '🐬'], ['lobster', '🦞'],
		['hiu', '🦈'], ['udang', '🦐'], ['ikan', '🐟'], ['orca', '🐋']
	]
	var results = catches.map(([item, emoji]) => {
		var amount = Math.floor(Math.random() * 10)
		user[item] = (Number(user[item]) || 0) + amount
		return `${emoji} ${item}: ${amount}`
	})

	user.lastfishing = now
	user.fishingroddurability = Math.max(0, (Number(user.fishingroddurability) || 0) - 5)
	user.stamina = Math.max(0, (Number(user.stamina) || 0) - 20)
	await m.reply('Sedang memancing... tunggu sebentar.')
	setTimeout(() => {
		m.reply(`*Hasil memancing*\n\n${results.join('\n')}\n\nStamina berkurang 20.`).catch(error => console.error('Fishing result reply failed:', error))
	}, 3000)
}
handler.help = ['mancing']
handler.tags = ['berburu']
handler.command = /^(mancing)$/i
handler.register = true
module.exports = handler

function clockString(ms) {
	var seconds = Math.ceil(Math.max(0, ms) / 1000)
	return [Math.floor(seconds / 3600), Math.floor(seconds / 60) % 60, seconds % 60].map(value => String(value).padStart(2, '0')).join(':')
}
