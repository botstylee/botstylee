var handler = async (m, {
	conn,
	args,
	usedPrefix,
	command
}) => {
	var isClose = { // Switch Case Like :v
		'open': 'not_announcement',
		'close': 'announcement',
	} [(args[0] || '')]
	if (isClose === undefined)
		throw `
*Format salah! Contoh :*
  *○ ${usedPrefix + command} close*
  *○ ${usedPrefix + command} open*
`.trim()
	await conn.groupSettingUpdate(m.chat, isClose)
}
handler.help = ['group *open / close*']
handler.tags = ['group']
handler.command = /^(group)$/i
handler.group = true
handler.admin = true
handler.botAdmin = true

module.exports = handler