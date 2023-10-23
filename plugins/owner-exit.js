var handler = async (m, {
	conn
}) => {
	await m.reply('dadah 😁')
	db.data.chats[m.chat] = {}
	await delay(1500)
	await conn.groupLeave(m.chat)
}
handler.help = ['exit']
handler.tags = ['owner']
handler.command = /^(exit|out|leave|metu)$/i
handler.owner = true
handler.group = true
export default handler