/*//////////////////////////////////

Cretor : Hairul Lana
https://github.com/hairullana 

/*/ ///////////////////////////////*/

var handler = async (m, {
	conn
}) => {
	ayg = db.data.users[m.sender]

	if (ayg.pasangan == "") {
		return conn.reply(m.chat, `Anda tidak memiliki pasangan.`, m)
	}

	beb = db.data.users[db.data.users[m.sender].pasangan]

	if (typeof beb == "undefined") {
		conn.reply(m.chat, `Berhasil putus hubungan dengan @${db.data.users[m.sender].pasangan.split('@')[0]}`, m, {
			mentions: [db.data.users[m.sender].pasangan]
		})
		ayg.pasangan = ""
	}

	if (m.sender == beb.pasangan) {
		conn.reply(m.chat, `Berhasil putus hubungan dengan @${db.data.users[m.sender].pasangan.split('@')[0]}`, m, {
			mentions: [db.data.users[m.sender].pasangan]
		})
		ayg.pasangan = ""
		beb.pasangan = ""
	} else {
		conn.reply(m.chat, `Anda tidak memiliki pasangan.\nKasian😂👆`, m)
	}
}
handler.help = ['putus']
handler.tags = ['jadian']
handler.command = /^(putus)$/i
handler.group = true
handler.fail = null
module.exports = handler