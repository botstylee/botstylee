/*//////////////////////////////////

Cretor : Hairul Lana
https://github.com/hairullana 

/*/ ///////////////////////////////*/

var handler = async (m, {
	conn
}) => {
	if (db.data.users[m.sender].pasangan == "") return conn.reply(m.chat, `Kamu sedang tidak menembak siapapun!`, m)
	if (db.data.users[db.data.users[m.sender].pasangan].pasangan == m.sender) return conn.reply(m.chat, `Kamu telah berpacaran dengan @${db.data.users[m.sender].pasangan.split('@')[0]}`, m, {
		mentions: [db.data.users[m.sender].pasangan]
	})
	conn.reply(m.chat, `Kamu sudah mengikhlaskan @${db.data.users[m.sender].pasangan.split('@')[0]} karena dia tidak memberikan jawaban diterima atau ditolak`, m, {
		mentions: [db.data.users[m.sender].pasangan]
	})
	db.data.users[m.sender].pasangan = ""
}
handler.help = ['ikhlasin']
handler.tags = ['jadian']
handler.command = /^(ikhlasin|ikhlas)$/i
handler.mods = false
handler.premium = false
handler.group = true
handler.fail = null
module.exports = handler