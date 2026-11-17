var handler = m => m
handler.all = async function(m) {
	if (!m.isGroup) return
	const chat = db.data?.chats?.[m.chat]
	if (!chat || !chat.expired) return true
	if (Date.now() > chat.expired) {
		try {
			await m.reply('Bye🖐 bot akan left!!')
			await this.groupLeave(m.chat)
		} catch (error) {
			console.error('Failed to leave expired group:', error)
		}
	}
	return true
}

module.exports = handler
