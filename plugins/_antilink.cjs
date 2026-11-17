var linkRegex = /(?:https?:\/\/)?chat\.whatsapp\.com\/(?:invite\/)?([0-9A-Za-z]{20,24})/i

var handler = m => m

handler.before = async function (m, {
	isAdmin,
	isBotAdmin,
	participants
}) {
	if (m.isBaileys && m.fromMe) return true
	if (!m.isGroup || typeof m.text !== 'string') return false

	var chat = db.data?.chats?.[m.chat]
	if (!chat?.antiLink) return true

	var isGroupLink = linkRegex.exec(m.text)
	if (!isGroupLink || isAdmin) return true

	if (isBotAdmin) {
		try {
			var inviteCode = await this.groupInviteCode(m.chat)
			var linkThisGroup = `https://chat.whatsapp.com/${inviteCode}`
			if (m.text.includes(linkThisGroup)) return true
		} catch (e) {
			console.error(e)
		}
	}

	try {
		await this.sendMessage(m.chat, {
			delete: {
				remoteJid: m.chat,
				id: m.id,
				participant: m.sender
			}
		})
	} catch (e) {
		console.error(e)
	}

	return true
}

handler.group = true
module.exports = handler
