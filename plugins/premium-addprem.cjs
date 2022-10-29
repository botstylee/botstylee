var toMs = require('ms');
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

	if (!text) return conn.reply(m.chat, `*❏ GET NUMBER*\n\n• ${usedPrefix+command} number|expired\n*Example:* ${usedPrefix+command} 62895368900456|9m\n\n• ${usedPrefix+command} @tag|expired\n*Example:* ${usedPrefix+command} @62895368900456|9m\n*INFO expired*\n1m for 1minutes\n1d for 1days\n1w for 1week\n1y for 1years`, m)
	var user = db.data.users[hl[0]]
	if (!(hl[0] in db.data.users)) return m.reply(`User ${hl[0]} not in database`)
	if (!('premium' in user)) {
		user.premium = false
	}
	if (user.premium) return m.reply("dia sudah jadi member premium bang\n\nmasa berakhirnya: " + new Intl.DateTimeFormat('id-ID', {
		dateStyle: 'full',
		timeStyle: 'long'
	}).format(user.expired))
	if (!hl[1]) throw `mau uprgade user brapa hari?\n\nContoh:\n${usedPrefix + command} @0 1d`
	hl[2] = hl[1].replace(/[0-9]/g, '').charAt(0)
	if (!hl[2].match(/(d|w|m|y)/gi)) return m.reply(`hanya mendukung hari, menit, tahun, minggu\nExample: ${usedPrefix+command} @0 1d\n*!NOTE*\nGunakan format: d untuk hari, w untuk minggu, m untuk menit, y untuk tahun`)
	var expired = Date.now() + toMs(hl[1].replace(/[^0-9]/g, '') + hl[2])
	user.expired += expired
	user.premium = true
	var format
	if (hl[2].match('d')) format = hl[2].replace('d', hl[1].replace(/[^0-9]/g, '') + ' Hari')
	if (hl[2].match('w')) format = hl[2].replace('w', hl[1].replace(/[^0-9]/g, '') + ' Minggu')
	if (hl[2].match('m')) format = hl[2].replace('m', hl[1].replace(/[^0-9]/g, '') + ' Menit')
	if (hl[2].match('y')) format = hl[2].replace('y', hl[1].replace(/[^0-9]/g, '') + ' Tahun')
	m.reply(`Berhasil menambahkan *${user.name}* sebagai pengguna Premium selama ${format}.\n\nExpired: ` + new Intl.DateTimeFormat('id-ID', {
		dateStyle: 'full',
		timeStyle: 'long'
	}).format(user.expired))
	await delay(2000)
	if (expired > Date.now() + 604800000 && expired < Date.now() + 1209600000) {
		user.limitjoinprem += 1
		conn.reply(hl[0], `*hai ${await conn.getName(hl[0])}*\nowner @${m.sender.split`@`[0]} baru saja menambah kamu menjadi user premium\n\n╭⚅\t\t\t\t\t\t\t*PREMIUM*\t\t\t\t\t\t\t⚅\n ⎸\n ⎸Tokenprem: ${user.limitjoinprem}\n ⎸expired: ${msToDate(user.expired - new Date() * 1)}\n ⎸\n╰⚅`, null, {
			mentions: [hl[0], m.sender]
		})
	} else if (expired < Date.now() + 604800000) {
		user.limitjoinfree += 2
		conn.reply(hl[0], `*hai ${await conn.getName(hl[0])}*\nowner @${m.sender.split`@`[0]} baru saja menambah kamu menjadi user premium\n\n╭⚅\t\t\t\t\t\t\t*PREMIUM*\t\t\t\t\t\t\t⚅\n ⎸\n ⎸Tokenfree: ${user.limitjoinfree}\n ⎸expired: ${msToDate(user.expired - new Date() * 1)}\n ⎸\n╰⚅`, null, {
			mentions: [hl[0], m.sender]
		})
	} else {
		user.limitjoinprem += 2
		conn.reply(hl[0], `*hai ${await conn.getName(hl[0])}*\nowner @${m.sender.split`@`[0]} baru saja menambah kamu menjadi user premium\n\n╭⚅\t\t\t\t\t\t\t*PREMIUM*\t\t\t\t\t\t\t⚅\n ⎸\n ⎸Tokenprem: ${user.limitjoinprem}\n ⎸expired: ${msToDate(user.expired - new Date() * 1)}\n ⎸\n╰⚅`, null, {
			mentions: [hl[0], m.sender]
		})
	}
}
handler.help = ['addprem *@user|expired*']
handler.tags = ['owner', 'premium']
handler.command = /^(add|tambah|\+)p(rem)?$/i
handler.owner = true
module.exports = handler

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
