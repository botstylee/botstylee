var linkRegex = /chat.whatsapp.com\/([0-9A-Za-z]{20,24})( [0-9]{1,3})?/i

var handler = async (m, {
	conn,
	text,
	isOwner,
	isPrems
}) => {
	var [_, code, expired] = text.match(linkRegex) || []
	if (!code) throw 'Link invalid'
	var users = db.data.users[m.sender]
	if (!isOwner && users.limitjoin == 0) throw 'limit join kamu sudah habis, silahkan upgrade premium untuk mendapatkan 3 tambahan limit'
	var res = await conn.groupAcceptInvite(code)
	if (isOwner) {
		m.reply(`Berhasil join grup ${res}`)
		await delay(1500)
		conn.reply(res, `*${conn.users.name}* adalah bot whatsapp yang di bangun menggunakan Nodejs, diundang oleh owner kami *@${m.sender.split`@`[0]}* \n\nUntuk Melihat List *Menu* bot ketik *#menu*\n`.trim(), null, {
			mentions: [m.sender]
		})
	} else if (users.premium || users.sewa) {
		users.limitjoin -= 1
		expired = 30
		var chats = db.data.chats[res]
		if (!chats) chats = db.data.chats[res] = {}
		if (expired) chats.expired = +new Date() + expired * 1000 * 60 * 60 * 24
		chats.groupexpired = true
		m.reply(`Berhasil join grup ${res}${expired ? ` selama ${expired} hari` : ''}.\nlimitjoin berkurang 1\n${users.limitjoin == 0 ? 'Limit join kamu sudah habis' : 'Limit join kamu tersisa ' + users.limitjoin}`)
		await delay(1500)
		conn.reply(res, `*${conn.users.name}* adalah bot whatsapp yang di bangun menggunakan Nodejs, diundang oleh @${m.sender.split`@`[0]} trial selama\n*${msToDate(db.data.chats[res].expired - new Date() * 1)}*\n\nUntuk Melihat List *Menu* bot ketik *#menu*\n\nJika ingin di perpanjang expired group harap hubungi *owner* kami..`.trim(), null, {
			mentions: [m.sender]
		})
	} else {
		users.limitjoin -= 1
		expired = 1.5
		var chats = db.data.chats[res]
		if (!chats) chats = db.data.chats[res] = {}
		if (expired) chats.expired = +new Date() + expired * 1000 * 60 * 60 * 24
		chats.groupexpired = true
		m.reply(`Berhasil join grup ${res}${expired ? ` selama ${expired} hari` : ''}.\nlimitjoin berkurang 1\n${users.limitjoin == 0 ? 'Limit join kamu sudah habis' : 'Limit join kamu tersisa ' + users.limitjoin}\n*INFO*\nbagi member free masing-masing mendapatkan 1 trial limitjoin selama 1hari 12jam\nbeli point limitjoin untuk mendapatkan trial limitjoin selama 30 hari atau upgrade ke premium`)
		await delay(1500)
		conn.reply(res, `*${conn.users.name}* adalah bot whatsapp yang di bangun menggunakan Nodejs, diundang oleh @${m.sender.split`@`[0]} trial selama\n*${msToDate(db.data.chats[res].expired - new Date() * 1)}*\n\nUntuk Melihat List *Menu* bot ketik *#menu*\n\nJika ingin di perpanjang expired group harap hubungi *owner* kami..`.trim(), null, {
			mentions: [m.sender]
		})
	}
}
handler.help = ['join *chat.whatsapp.com*']
handler.tags = ['premium']

handler.command = /^join$/i

module.exports = handler

var isNumber = (x) => (x = parseInt(x), typeof x === 'number' && !isNaN(x))

function msToDate(ms) {
	temp = ms
	years = Math.floor(ms / (12 * 30 * 24 * 60 * 60 * 1000));
	yearsms = ms % (12 * 30 * 24 * 60 * 60 * 1000);
	month = Math.floor((yearsms) / (30 * 24 * 60 * 60 * 1000));
	monthms = ms % (30 * 24 * 60 * 60 * 1000);
	days = Math.floor((monthms) / (24 * 60 * 60 * 1000));
	daysms = ms % (24 * 60 * 60 * 1000);
	hours = Math.floor((daysms) / (60 * 60 * 1000));
	hoursms = ms % (60 * 60 * 1000);
	minutes = Math.floor((hoursms) / (60 * 1000));
	minutesms = ms % (60 * 1000);
	sec = Math.floor((minutesms) / (1000));
	return days + " Hari " + hours + " Jam " + minutes + " Menit";
	// +minutes+":"+sec;
}
