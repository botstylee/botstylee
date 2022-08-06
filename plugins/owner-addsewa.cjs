var handler = async (m, {
	conn,
	text,
	usedPrefix,
	command,
	args
}) => {
	function no(number) {
		return number.replace(/\s/g, '').replace(/([@+-])/g, '')
	}
	var hl = []
	hl[0] = text.split('|')[0]
	hl[0] = no(hl[0]) + "@s.whatsapp.net"
	hl[1] = text.split('|')[1].toLowerCase()

	if (!text) return conn.reply(m.chat, `*❏ GET NUMBER*\n\n• ${usedPrefix+command} number|amount\n*Example:* ${usedPrefix+command} 62895368900456|2\n\n• ${usedPrefix+command} @tag|amount\n*Example:* ${usedPrefix+command} @62895368900456|2\n*INFO*\nfor amount max is 5`, m)
	var user = db.data.users[hl[0]]
	if (!(hl[0] in db.data.users)) return m.reply(`User ${hl[0]} not in database`)
	if (!('sewa' in user)) {
		user.sewa = false
	}
	user.limitjoin += hl[1].replace(/[^0-9]/g, '')
	user.sewa = true
	m.reply(`berhasil menambah limitjoin @${hl[0].split`@`[0]} sebanyak ${hl[1].replace(/[^0-9]/g, '')}`, null, {
		mentions: [hl[0]]
	})
	await delay(1500)
	conn.reply(hl[0], await tiny(`hai ${await conn.getName(hl[0])}\n owner kami baru saja memberimu point limitjoin sebanyak ${hl[1].replace(/[^0-9]/g, '')}.\npoint tersebut bisa kamu gunakan untuk mengundang bot ke dalam group kamu.\nketik #join *link group* untuk menggunakannya.\n*NOTE*\njika point limitjoin lebih dari 5 maka lebihnya tersebut akan dibuang\n*terima kasih* :)`), null)
}
handler.help = ['addsewa *@user|amount*']
handler.tags = ['owner', 'premium']
handler.command = /^(add|tambah|\+)(sewa|point|poin)?$/i
handler.owner = true
module.exports = handler
var isNumber = (x) => (x = parseInt(x), typeof x === 'number' && !isNaN(x))
