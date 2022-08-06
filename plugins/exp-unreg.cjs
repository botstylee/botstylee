var {
	createHash
} = require('crypto');
var handler = async function(m, {
	args
}) {
	if (!args[0]) throw 'Serial Number kosong'
	var user = global.db.data.users[m.sender]
	var sn = createHash('md5').update(m.sender).digest('hex')
	if (args[0] !== sn) throw 'Serial Number salah'
	user.registered = false
	m.reply('```Succes Unreg !```')
}
handler.help = ['', 'ister'].map(v => 'unreg' + v + ' *SN|SERIAL NUMBER*')
handler.tags = ['xp']

handler.command = /^unreg(ister)?$/i
handler.register = true

module.exports = handler