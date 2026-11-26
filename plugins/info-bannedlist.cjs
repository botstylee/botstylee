var handler = async (m, {
	conn,
	usedPrefix
}) => {
	// ✅ Pastikan database siap
	if (!db.data?.chats || !db.data?.users) {
		return conn.reply(m.chat, 'Database belum siap, coba lagi sebentar.', m)
	}

	var chats = Object.entries(db.data.chats).filter(([, chat]) => chat?.isBanned)
	var users = Object.entries(db.data.users).filter(([, user]) => user?.banned)

	// ✅ Helper untuk ambil nama dengan aman (getName bisa Promise)
	var getName = async (jid) => {
		try {
			var name = await conn.getName(jid)
			return name || 'Unknown'
		} catch {
			return 'Unknown'
		}
	}

	// ✅ Bangun daftar chat
	var chatList = ''
	if (chats.length) {
		var lines = []
		for (var i = 0; i < chats.length; i++) {
			var [jid] = chats[i]
			var name = await getName(jid)
			lines.push(`│ ${i + 1}. ${name}\n│ ${jid}`)
		}
		chatList = '\n' + lines.join('\n')
	}

	// ✅ Bangun daftar user
	var userList = ''
	if (users.length) {
		var lines2 = []
		for (var j = 0; j < users.length; j++) {
			var [jid2] = users[j]
			var name2 = await getName(jid2)
			lines2.push(`│ ${j + 1}. ${name2}\n│ ${jid2}`)
		}
		userList = '\n' + lines2.join('\n')
	}

	var teks = `
┌ *Daftar Chat Terbanned*
│ Total : ${chats.length} Chat${chatList}
└────

┌ *Daftar User Terbanned*
│ Total : ${users.length} User${userList}
└────
`.trim()

	await conn.reply(m.chat, teks, m)
}

handler.help = ['bannedlist']
handler.tags = ['info']
handler.command = /^(listban(ned)?|ban(ned)?list|daftarban(ned)?)$/i

module.exports = handler
