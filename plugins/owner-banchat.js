var handler = async (m, {
	conn,
	isOwner,
	text,
	isAdmin
}) => {
	var who, nano
	if (m.isGroup) {
		if (!(isAdmin || isOwner)) return dfail('admin', m, conn)
		if (isOwner) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text ? text.replace(/[^0-9]/g, '') : m.chat
		else who = m.chat
	} else {
		if (!isOwner) return dfail('owner', m, conn)
		who = text ? text.replace(/[^0-9]/g, '') : m.chat
	}

	try {
		if (!who) who = m.chat
		if (who.endsWith('g.us')) db.data.chats[who].isBanned = true
		else db.data.users[who].banned = true
		nano = await conn.getName(who)
		m.reply(`*${conn.user.name} sekarang tidak aktif dichat ${nano == undefined ? 'ini' : nano}.*`)
	} catch (e) {
		log(e)
		throw `jid tidak ada didatabase!`
	}
}
handler.help = ['ban']
handler.tags = ['owner', 'group']
handler.command = /^ban(chat)?$/i

export default handler