var handler = async (m) => {
	try {
		var who = m.chat
		if (who.endsWith('g.us')) db.data.chats[who].isBanned = false
		else db.data.users[who].banned = false
		var nano = await conn.getName(who)
		m.reply(`*${conn.user.name} sekarang aktif dichat ${nano == undefined ? 'ini' : nano}.*`)
	} catch (e) {
		throw `jid tidak ada didatabase!`
	}
}
handler.help = ['unbanchat']
handler.tags = ['owner']
handler.command = /^unbanchat$/i
handler.owner = true

export default handler