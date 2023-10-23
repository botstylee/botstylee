var linkRegex = /chat.whatsapp.com\/([0-9A-Za-z]{20,24})( [0-9]{1,3})?/i

var handler = async (m, {
	conn,
	text,
	isOwner,
	isPrems,
	command
}) => {
	var users
	var [_, code, expired] = text.match(linkRegex) || []
	if (!code) throw 'Link invalid'
	users = db.data.users[m.sender]
	var res
	try {
		res = await conn.groupAcceptInvite(code)
		m.reply(`Berhasil join grup ${res}`)
		var chats = db.data.chats[res]
		if (!chats) chats = db.data.chats[res] = {}
	} catch (e) {
		log(e)
		throw 'bot tidak dapat masuk menggunakan tautan dari kamu, mungkin kamu telah mengeluarkan bot sebelumnya'
	}
}
handler.help = ['join *chat.whatsapp.com*']
handler.tags = ['main']

handler.command = ['join']

export default handler

var isNumber = (x) => (x = parseInt(x), typeof x === 'number' && !isNaN(x))

function msToDate(ms) {
	var temp = ms,
	years = Math.floor(ms / (12 * 30 * 24 * 60 * 60 * 1000)),
	yearsms = ms % (12 * 30 * 24 * 60 * 60 * 1000),
	month = Math.floor((yearsms) / (30 * 24 * 60 * 60 * 1000)),
	monthms = ms % (30 * 24 * 60 * 60 * 1000),
	days = Math.floor((monthms) / (24 * 60 * 60 * 1000)),
	daysms = ms % (24 * 60 * 60 * 1000),
	hours = Math.floor((daysms) / (60 * 60 * 1000)),
	hoursms = ms % (60 * 60 * 1000),
	minutes = Math.floor((hoursms) / (60 * 1000)),
	minutesms = ms % (60 * 1000),
	sec = Math.floor((minutesms) / (1000))
	if (days <= 0) {
		return hours + " Jam " + minutes + " Menit";
	}
	if (days <= 0 && hours <= 0) {
		return minutes + " Menit";
	}
	if (days <= 0 && hours <= 0 && minutes <= 0) {
		return sec + " Detik"
	}
	if (month <= 0) {
		return days + " Hari " + hours + " Jam " + minutes + " Menit";
	}
	// +minutes+":"+sec;
}