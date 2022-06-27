const linkRegex = /chat.whatsapp.com\/(?:invite\/)?([0-9A-Za-z]{20,24})/i
let handler = m => m
handler.before = async function(m, {
	isAdmin,
	isBotAdmin,
	participants
}) {
	if (m.isBaileys && m.fromMe)
		return !0
	if (!m.isGroup) return !1
	let chat = db.data.chats[m.chat]
	let bot = db.data.settings[this.user.jid] || {}
	const isGroupLink = linkRegex.exec(m.text)
	const groupAdmins = participants.filter(p => p.admin)
	const listAdmin = groupAdmins.map((v, i) => `${i + 1}. @${v.id.split('@')[0]}`).join('\n')
	if (chat.antiLink && isGroupLink && !isAdmin) {
		if (isBotAdmin) {
			const linkThisGroup = `https://chat.whatsapp.com/${await this.groupInviteCode(m.chat)}`
			if (m.text.includes(linkThisGroup)) throw !0
		}
		conn.reply(m.chat, 'bang ada yang kirim link grup tuh\n'+listAdmin, m, false, {mentions: [...groupAdmins.map(v => v.id)]})
	}
	return !0
}
handler.group = true
module.exports = handler