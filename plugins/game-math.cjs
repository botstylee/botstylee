var handler = async (m, { conn, args = [], usedPrefix, command }) => {
	conn.math = conn.math || {}
	if (args.length < 1 || !Object.hasOwn(modes, String(args[0]).toLowerCase())) throw `
┌─〔 Mode 〕
├ ${Object.keys(modes).join('\n├ ')}
└────
Contoh: ${usedPrefix}math hard`.trim()

	var mode = String(args[0]).toLowerCase()
	var id = m.chat
	if (id in conn.math) return conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.math[id][0])

	var math = genMath(mode)
	conn.math[id] = [
		await conn.reply(m.chat, `Berapa hasil dari *${math.str}*?\n\nTimeout: ${(math.time / 1000).toFixed(0)} detik\nBonus jawaban benar: ${math.bonus} XP\nKetik ${usedPrefix}nyerah untuk menyerah.`, m),
		math, 4,
		setTimeout(async () => {
			if (conn.math[id]) {
				await conn.reply(m.chat, `Waktu habis! Jawabannya adalah ${math.result}`, conn.math[id][0])
				delete conn.math[id]
			}
		}, math.time)
	]
}
handler.help = ['math *mode*']
handler.tags = ['game']
handler.command = /^(math)$/i
module.exports = handler

var modes = {
	noob: [-3, 3, -3, 3, '+-', 18000, 1000],
	easy: [-10, 10, -10, 10, '*/+-', 20000, 4000],
	medium: [-40, 40, -20, 20, '*/+-', 40000, 5000],
	hard: [-100, 100, -70, 70, '*/+-', 60000, 8000],
	extreme: [-999999, 999999, -99999, 99999, '*/', 80000, 10000],
	impossible: [-9999999, 9999999, -999999, 999999, '*/', 100000, 35000],
	impossible2: [-99999999, 99999999, -9999, 9999, '/', 120000, 50000]
}
var symbols = { '+': '+', '-': '−', '*': '×', '/': '÷' }
function genMath(mode) {
	var [a1, a2, b1, b2, allowed, time, bonus] = modes[mode]
	var op = pickRandom([...allowed])
	var a, b, result
	if (op === '/') {
		b = randomInt(Math.max(1, b1), Math.max(1, b2))
		result = randomInt(Math.min(a1, a2), Math.max(a1, a2))
		a = b * result
	} else {
		a = randomInt(a1, a2)
		b = randomInt(b1, b2)
		if (op === '+') result = a + b
		if (op === '-') result = a - b
		if (op === '*') result = a * b
	}
	return { str: `${a} ${symbols[op]} ${b}`, mode, time, bonus, result }
}
function randomInt(from, to) {
	if (from > to) [from, to] = [to, from]
	from = Math.ceil(from)
	to = Math.floor(to)
	return Math.floor(Math.random() * (to - from + 1)) + from
}
function pickRandom(list) { return list[Math.floor(Math.random() * list.length)] }
