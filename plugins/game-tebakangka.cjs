function generateRandomNumber(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min
}

var timeout = 60000

var handler = async (m, {
	conn,
	text
}) => {
	conn.tebakangka = conn.tebakangka ? conn.tebakangka : {}
	var id = m.sender

	var an = [{
		level: 'normal',
		min: 1,
		max: 10,
		reward: 400
	}, {
		level: 'hard',
		min: 1,
		max: 20,
		reward: 1500
	}, {
		level: 'extreme',
		min: 1,
		max: 30,
		reward: 3000
	}, {
		level: 'crazy',
		min: 1,
		max: 50,
		reward: 5000
	}]

	if (id in conn.tebakangka) {
		return conn.reply(m.chat, 'Selesaikan permainanmu dulu sebelum memulai permainan baru', conn.tebakangka[id].msg)
	}

	var pilihan = an.find(v => v.level.toLowerCase() === (text || '').toLowerCase()) || an[0]

	var json = {
		target: generateRandomNumber(pilihan.min, pilihan.max),
		attempt: 4,
		min: pilihan.min,
		max: pilihan.max,
		level: pilihan.level,
		reward: pilihan.reward
	}

	var anu = `*[ t e b a k - a n g k a ]*

🎋 Silahkan tebak angka yang sedang dipikirkan Bot.

*[ clue ]* => ${json.min} - ${json.max}
*[ timeout ]* => ${(timeout / 1000).toFixed(0)} detik
*[ level ]* => ${json.level}
*[ hadiah ]* => ${json.reward} MP
*[ kesempatan ]* => ${json.attempt} kali`

	var msg = await conn.reply(m.chat, anu, m)

	conn.tebakangka[id] = {
		msg,
		json,
		poin: json.reward,
		tot: setTimeout(() => {
			if (conn.tebakangka[id]) {
				conn.reply(m.chat, `*[ t i m e o u t ]*

🎋 *kamu kalah*

*[ angka bot ]* => ${json.target}
Ayo coba lagi 🧢`, conn.tebakangka[id].msg)
				delete conn.tebakangka[id]
			}
		}, timeout)
	}
}

handler.help = ['tebakangka']
handler.command = ['tebakangka']
handler.tags = ['game']

// ✅ Handler untuk menangkap tebakan user
handler.before = async function (m, { conn }) {
	if (!m.isGroup) return !1
	if (!conn.tebakangka) return !1
	if (!(m.sender in conn.tebakangka)) return !1

	var txt = (m.text || '').trim()
	if (!/^\d+$/.test(txt)) return !1

	var session = conn.tebakangka[m.sender]
	if (!session) return !1

	var { json, poin, msg, tot } = session
	var tebak = parseInt(txt, 10)

	// ✅ Cek di luar range
	if (tebak < json.min || tebak > json.max) {
		return conn.reply(m.chat, `Angka harus di antara *${json.min}* dan *${json.max}*!`, m)
	}

	// ✅ Tebakan benar
	if (tebak === json.target) {
		clearTimeout(tot)
		delete conn.tebakangka[m.sender]

		var user = global.db?.data?.users?.[m.sender]
		if (user) {
			if (typeof user.exp !== 'number') user.exp = 0
			user.exp += poin
		}

		await conn.reply(m.chat, `🎉 *BENAR!*

Angka yang dipikirkan bot adalah *${json.target}*.
Kamu mendapat *${poin} MP*!`, m)
		return !0
	}

	// ✅ Tebakan salah, kurangi kesempatan
	json.attempt -= 1

	if (json.attempt <= 0) {
		clearTimeout(tot)
		delete conn.tebakangka[m.sender]

		await conn.reply(m.chat, `💀 *KESEMPATAN HABIS!*

Angka yang dipikirkan bot adalah *${json.target}*.
Ayo coba lagi 🧢`, m)
		return !0
	}

	// ✅ Beri petunjuk lebih besar/kecil
	var hint = tebak < json.target ? 'lebih *BESAR*' : 'lebih *KECIL*'
	await conn.reply(m.chat, `❌ Salah! Angka yang benar ${hint} dari *${tebak}*.
Kesempatan tersisa: *${json.attempt}*`, m)

	return !0
}

module.exports = handler
