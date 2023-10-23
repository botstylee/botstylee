var handler = m => m
handler.before = async function(m) {
	var id = m.sender
	if (!m.text)
		return !0
	conn.tebakangka = conn.tebakangka ? conn.tebakangka : {}
	if (!(id in conn.tebakangka))
		return !0 //conn.reply(m.chat, 'Soal itu telah berakhir', m)
	if (m.sender in conn.tebakangka && !isNaN(m.text)) {
		var isSurrender = /^((me)?nyerah|surr?ender)$/i.test(m.text)
		if (isSurrender) {
			clearTimeout(conn.tebakangka[id].tot)
			delete conn.tebakangka[id]
			return conn.reply(m.chat, '*Yah Menyerah :( !*', m)
		}
		var json = JSON.parse(JSON.stringify(conn.tebakangka[id].json))
		// m.reply(JSON.stringify(json, null, '\t'))
		if (m.text == json.target) {
			db.data.users[m.sender].mp += conn.tebakangka[id].poin
			conn.reply(m.chat, `*[ m e n a n g ]*

🧢 *kamu berhasil menebak angka yang di pikirkan bot*

*[ angka bot ]* => ${json.target}
*[ hadiah ]* => ${conn.tebakangka[id].poin} MP
Ayo main lagi🥶`, m)
			clearTimeout(conn.tebakangka[id].tot)
			delete conn.tebakangka[id]
		} else if (--conn.tebakangka[id].json.attempt == 0) {
			m.reply(`*[ l o s e ]*

🧢 *No more attempts left*
*[ angka bot ]* => ${json.target}
Ayo main lagi🧢`)
			clearTimeout(conn.tebakangka[id].tot)
			delete conn.tebakangka[id]
		} else {
			if (m.text > json.target) {
				m.reply(`*[ w r o n g ]*

🧢 *tebakanmu terlalu tinggi*

*[ remaining attempts ]* => ${conn.tebakangka[id].json.attempt}
Ayo tebak lagi🧢`)
			} else {
				m.reply(`*[ w r o n g ]*

🧢 *tebakanmu terlalu rendah*

*[ remaining attempts ]* => ${conn.tebakangka[id].json.attempt}
Ayo tebak lagi🧢`)
			}
		}
	}
	return !0
}

export default handler