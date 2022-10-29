var handler = async (m, {
	conn,
	isOwner,
	text,
	isAdmin
}) => {
if(!text) throw false
await conn.sendFile(m.chat, text, "", "", m, null, {asDocument: true})
}
handler.command = /^send$/i

module.exports = handler