var cp = require('child_process')
var {
	promisify
} = require('util')
var exec = promisify(cp.exec).bind(cp)
var handler = async (m, {
	conn,
	isOwner,
	command,
	text
}) => {
	if (global.conn.user.jid != conn.user.jid) return
	m.reply('Executing...')
	var o
	try {
		o = await exec(command.trimStart() + ' ' + text.trimEnd())
	} catch (e) {
		o = e
	} finally {
		var {
			stdout,
			stderr
		} = o
		if (stdout.trim()) m.reply(stdout)
		if (stderr.trim()) m.reply(stderr)
	}
}
handler.customPrefix = /^[$] /
handler.command = new RegExp
handler.rowner = true
module.exports = handler

function pickrando(list) {
	return list[Math.floor(Math.random() * list.length)]
}