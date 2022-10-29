var {
	createHash
} = require('crypto');

var Reg = /\|?(.*)([.|] *?)([0-9]*)$/i
var handler = async function(m, {
	conn,
	text,
	usedPrefix
}) {
	var sn = createHash('md5').update(m.sender).digest('hex')

	m.reply(`*📮 SN:* ${sn}`)
}

handler.help = ['ceksn']
handler.tags = ['xp']
handler.command = /^(ceksn)$/i
handler.register = true
module.exports = handler