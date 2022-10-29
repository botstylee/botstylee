var handler = m => m
handler.all = async function(m) {
	if (!m.isGroup)
		return
	var chats = global.db.data.chats[m.chat]
	if (!chats.expired)
		return !0
	if (+new Date() > chats.expired) {
		await m.reply('Bye🖐 bot akan left!!')
		await this.groupLeave(m.chat)
	}
}

module.exports = handler