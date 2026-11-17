const clampFinite = (value, min, max) => {
	const number = typeof value === 'number' ? value : Number(value)
	if (!Number.isFinite(number)) return value
	return Math.min(max, Math.max(min, number))
}

const handler = m => m

handler.all = async function (m) {
	const user = db.data?.users?.[m?.sender]
	if (!user || typeof user !== 'object') return

	user.money = clampFinite(user.money, 0, 99999999)
	user.exp = clampFinite(user.exp, 0, 99999999)
	user.health = clampFinite(user.health, 0, 100)
	user.limitjoin = clampFinite(user.limitjoin, 0, 5)
}

module.exports = handler
