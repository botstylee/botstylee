module.exports.xpRange = async function(level, multiplier = global.multiplier || 1) {
	if (level < 0)
		throw new TypeError('level cannot be negative value')
	level = Math.floor(level)
	let min = level === 0 ? 0 : Math.round(Math.pow(level, Math.pow(Math.PI / Math.E, 1.618) * Math.E * .75) * multiplier) + 1
	let max = Math.round(Math.pow(++level, Math.pow(Math.PI / Math.E, 1.618) * Math.E * .75) * multiplier)
	return {
		min,
		max,
		xp: max - min
	}
}
module.exports.findLevel = async function(xp, multiplier = global.multiplier || 1) {
	if (xp === Infinity)
		return Infinity
	if (isNaN(xp))
		return NaN
	if (xp <= 0)
		return -1
	let level = 0
	do
		level++
	while (xpRange(level, multiplier).min <= xp)
	return --level
}
module.exports.canLevelUp = async function(level, xp, multiplier = global.multiplier || 1) {
	if (level < 0)
		return false
	if (xp === Infinity)
		return true
	if (isNaN(xp))
		return false
	if (xp <= 0)
		return false
	return level < findLevel(xp, multiplier)
}