var linkRegex = /chat.whatsapp.com\/(?:invite\/)?([0-9A-Za-z]{20,24})/i
var handler = m => m
handler.before = async function(m, {
	isAdmin,
	isBotAdmin,
	participants
}) {
	if (m.isBaileys && m.fromMe)
		return !0
	if (!m.isGroup) return !1
	var chat = db.data.chats[m.chat]
	var bot = db.data.settings[this.user.jid] || {}
	var isGroupLink = linkRegex.exec(m.text)
	var groupAdmins = participants.filter(p => p.admin)
	var listAdmin = groupAdmins.map((v, i) => `${i + 1}. @${v.id.split('@')[0]}`).join('\n')
	if (chat.antiLink && isGroupLink && !isAdmin) {
		if (isBotAdmin) {
			var linkThisGroup = `https://chat.whatsapp.com/${await this.groupInviteCode(m.chat)}`
			if (m.text.includes(linkThisGroup)) throw !0
		}
		/*conn.reply(m.chat, 'bang ada yang kirim link grup tuh\n' + listAdmin, m, {
			mentions: [...groupAdmins.map(v => v.id)]
		})*/
		if (isBotAdmin && bot.restrict) {
			await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
		} else if (!bot.restrict) return m.reply('Owner disable auto kick!')
	}
	return !0
}
handler.group = true
module.exports = handler
