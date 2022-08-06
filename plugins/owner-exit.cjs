var handler = async (m, {
	conn
}) => {
	await m.reply(await tiny('selamat tinggal semuanya 😊'))
	db.data.chats[m.chat] = {}
	await delay(1500)
	await conn.groupLeave(m.chat)
}
handler.help = ['exit']
handler.tags = ['owner']
handler.command = /^(exit|out|leave|metu)$/i
handler.owner = true
handler.group = true
module.exports = handler