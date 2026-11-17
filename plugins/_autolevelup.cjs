const level = require('../lib/levelling.cjs')
const handler = m => m

handler.before = async function (m) {
	if (!m?.sender || typeof m.text !== 'string' || !m.text.trim()) return

	const user = db.data?.users?.[m.sender]
	if (!user || user.autolevelup === false) return
	if (!global.rpg || typeof global.rpg.role !== 'function' || typeof level.canLevelUp !== 'function') return

	const currentLevel = Number(user.level)
	const currentExp = Number(user.exp)
	if (!Number.isFinite(currentLevel) || !Number.isFinite(currentExp)) return

	const before = currentLevel
	while (level.canLevelUp(user.level, user.exp, global.multiplier)) user.level++
	if (before === user.level) return

	try {
		user.role = global.rpg.role(user.level)?.name || user.role || 'Beginner'
		const name = await this.getName(m.sender)
		await m.reply(`Selamat, ${name} telah naik level!\n• Level sebelumnya: ${before}\n• Level baru: ${user.level}\n• Role: ${user.role}\nGunakan *.inventory* untuk mengecek.`)
	} catch (error) {
		this.logger?.error?.({ err: error, sender: m.sender }, 'Gagal mengirim notifikasi level-up')
	}
}

handler.disabled = false
module.exports = handler
