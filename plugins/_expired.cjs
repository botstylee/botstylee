let handler = m => m
handler.all = async function(m) {
	if (!m.isGroup)
		return
	let chats = global.db.data.chats[m.chat]
	if (!chats.expired)
		return !0
	if (+new Date() > chats.expired) {
/*		m.reply('Bye🖐 bot akan left!!')
		chats.expired = 0
		await this.groupLeave(m.chat)*/
	}
}

module.exports = handler
