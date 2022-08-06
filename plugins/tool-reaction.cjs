var handler = async (m, {
	conn,
	text,
	usedPrefix,
	command
}) => {
	if (text.trim().length > 2 || text.trim().length < 2) {
		return m.reply("masukan emojinya & hanya support 1 emoji & gak ada text lain selain emoji")
	}
	var sendMsg = await conn.sendMessage(m.chat, {
		react: {
			text: text.trim(),
			key: m.quoted ? m.quoted.vM.key : m.key
		}
	})
}
handler.help = ['react *reply emo*']
handler.tags = ['tools']
handler.command = /^react$/i
module.exports = handler