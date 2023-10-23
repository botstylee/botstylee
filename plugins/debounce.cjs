var {
	spawn
} = require('child_process');
var handler = async (m, {
	conn
}) => {
	if (global.conn.user.jid == conn.user.jid) {
		await conn.reply(m.chat, 'Mereset bot:v', m)
		process.send('reset')
		process.exit()
	} else conn.reply(m.chat, '_eeeeeiiittsssss..._', m)
}
handler.help = ['debounce']
handler.tags = ['host']
handler.command = /^(debounce|refresh|r|refreshing|reload)$/i
handler.owner = true

handler.fail = null

module.exports = handler