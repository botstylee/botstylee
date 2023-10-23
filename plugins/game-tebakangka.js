function generateRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
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
		conn.reply(m.chat, 'Selesaikan permainanmu dulu sebelum memulai permainan baru', conn.tebakangka[id].msg)
		throw false
	}
	var min, max, reward, lvl
	if (text && an.find(v=> v.level.toLowerCase() == text.toLowerCase())) {
		min = an.find(v=> v.level.toLowerCase() == text.toLowerCase()).min
		max = an.find(v=> v.level.toLowerCase() == text.toLowerCase()).max
		reward = an.find(v=> v.level.toLowerCase() == text.toLowerCase()).reward
		lvl = an.find(v=> v.level.toLowerCase() == text.toLowerCase()).level
	} else {
		min = an.find(v=> v.level.toLowerCase() == 'normal').min
		max = an.find(v=> v.level.toLowerCase() == 'normal').max
		reward = an.find(v=> v.level.toLowerCase() == 'normal').reward
		lvl = 'normal'
	}
	var json = {
		target: generateRandomNumber(min, max),
		attempt: 4,
		min, max, level: lvl, reward
	}
	var anu = `*[ t e b a k - a n g k a ]*

🎋Silahkan Tebak angka yang sedang di pikirkan Bot.

*[ clue ]* => ${min} - ${max}
*[ timeout ]* => ${(timeout / 1000).toFixed(2)} detik
*[ level ]* => ${lvl}
*[ hadiah ]* => ${reward} MP
`
	conn.tebakangka[id] = {
		msg: await conn.reply(m.chat, anu, m),
		json,
		poin: reward,
		tot: setTimeout(() => {
			if (conn.tebakangka[id]) conn.reply(m.chat, `*[ t i m e o u t ]*

🎋 *kamu kalah*

*[ angka bot ]* => ${json.target}
Ayo coba lagi🧢`, conn.tebakangka[id].msg)
			delete conn.tebakangka[id]
		}, timeout)
	}
}

handler.help = handler.command = ['tebakangka']
handler.tags = ['game']

export default handler