var handler = async (m, {
	conn,
	args,
	usedPrefix,
	command
}) => {
	conn.math = conn.math ? conn.math : {}

	var modeList = Object.keys(modes).join('\n├ ')
	var usage = `┌─〔 Mode 〕
├ ${modeList}
└────
contoh:
${usedPrefix}${command} hard`.trim()

	if (args.length < 1) return conn.reply(m.chat, usage, m)

	var mode = args[0].toLowerCase()
	if (!(mode in modes)) return conn.reply(m.chat, usage, m)

	var id = m.chat
	if (id in conn.math) return conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.math[id][0])

	var math = genMath(mode)
	var msg = await conn.reply(m.chat, `Berapa hasil dari *${math.str}*?\n\nTimeout: ${(math.time / 1000).toFixed(0)} detik\nBonus Jawaban Benar: ${math.bonus} MP`, m)

	conn.math[id] = [
		msg,
		math,
		4, // percobaan (tidak dipakai, opsional)
		setTimeout(async () => {
			if (conn.math[id]) {
				await conn.reply(m.chat, `⏰ *Waktu habis!*\nJawabannya adalah *${math.result}*`, conn.math[id][0])
				delete conn.math[id]
			}
		}, math.time)
	]
}

handler.help = ['math *mode*']
handler.tags = ['game']
handler.command = /^math$/i

// ✅ Handler untuk menangkap jawaban user
handler.before = async function (m, { conn }) {
	if (!conn.math) return !1

	var id = m.chat
	if (!(id in conn.math)) return !1

	var txt = (m.text || '').trim()
	if (!/^-?\d+(\.\d+)?$/.test(txt)) return !1

	var session = conn.math[id]
	if (!session) return !1

	var [msg, math, attempt, tot] = session
	var jawab = parseFloat(txt)

	if (Math.abs(jawab - math.result) < 0.0001) {
		clearTimeout(tot)
		delete conn.math[id]

		var user = global.db?.data?.users?.[m.sender]
		if (user) {
			if (typeof user.exp !== 'number') user.exp = 0
			user.exp += math.bonus
		}

		await conn.reply(m.chat, `✅ *BENAR!*

${math.str} = *${math.result}*
Kamu mendapat *${math.bonus} MP*!`, m)
		return !0
	}

	// Salah → kurangi percobaan
	attempt -= 1

	if (attempt <= 0) {
		clearTimeout(tot)
		delete conn.math[id]
		await conn.reply(m.chat, `💀 *KESEMPATAN HABIS!*\nJawaban yang benar: *${math.result}*`, m)
		return !0
	}

	session[2] = attempt
	await conn.reply(m.chat, `❌ Salah! Kesempatan tersisa: *${attempt}*`, m)
	return !0
}

module.exports = handler

var modes = {
	noob: [-3, 3, -3, 3, '+-', 18000, 1000],
	easy: [-10, 10, -10, 10, '*/+-', 20000, 2000],
	medium: [-40, 40, -20, 20, '*/+-', 40000, 2500],
	hard: [-100, 100, -70, 70, '*/+-', 60000, 4000],
	extreme: [-9999, 9999, -9999, 9999, '*/', 80000, 7000],
	impossible: [-999999, 999999, -999999, 999999, '*/', 100000, 12000],
	impossible2: [-9999999, 9999999, -9999, 9999, '/', 120000, 15000]
}

var operators = {
	'+': '+',
	'-': '-',
	'*': '×',
	'/': '÷'
}

function genMath(mode) {
	var [a1, a2, b1, b2, ops, time, bonus] = modes[mode]
	var a = randomInt(a1, a2)
	var b = randomInt(b1, b2)
	var op = pickRandom([...ops])

	// ✅ Hitung manual, tanpa new Function
	var result
	if (op === '+') result = a + b
	else if (op === '-') result = a - b
	else if (op === '*') result = a * b
	else if (op === '/') {
		// ✅ Pastikan pembagian bulat: cari b yang habis membagi a
		var divisors = []
		for (var i = 1; i <= Math.abs(a); i++) {
			if (a % i === 0) divisors.push(i, -i)
		}
		if (divisors.length) {
			b = pickRandom(divisors)
			if (b === 0) b = 1
		} else {
			b = 1
		}
		result = a / b
	}

	return {
		str: `${a} ${operators[op]} ${b}`,
		mode,
		time,
		bonus,
		result
	}
}

function randomInt(from, to) {
	if (from > to) [from, to] = [to, from]
	from = Math.floor(from)
	to = Math.floor(to)
	// ✅ +1 agar inklusif
	return Math.floor(Math.random() * (to - from + 1)) + from
}

function pickRandom(list) {
	return list[Math.floor(Math.random() * list.length)]
}
