import toMs from 'ms'
var handler = async (m, {
	conn,
	text,
	usedPrefix,
	command,
	args
}) => {
	function no(number) {
		return number.replace(/[^0-9]/g, '');
	}
	if (!text) return conn.reply(m.chat, `*❏ GET NUMBER*\n\n• ${usedPrefix+command} number expired\n*Example:* ${usedPrefix+command} 62823310391919 9\n\n• ${usedPrefix+command} @tag expired\n*Example:* ${usedPrefix+command} @6282331033919 9\n`, m)
	var hl = text.split(' ');
	if (!no(hl.slice(0, -1).join(''))) return conn.reply(m.chat, `*❏ GET NUMBER*\n\n• ${usedPrefix+command} number expired\n*Example:* ${usedPrefix+command} 62823310391919 9\n\n• ${usedPrefix+command} @tag expired\n*Example:* ${usedPrefix+command} @6282331033919 9\n`, m)
	var number = no(hl.slice(0, -1).join('')) + "@s.whatsapp.net";
	var [cek] = await conn.onWhatsApp(number)
	if (!cek.exists) throw 'user not found'
	if (isNaN(hl[hl.length - 1].replace(/[^0-9]/g, ''))) throw 'only number for expired'
	var expired = Date.now() + toMs(hl[hl.length - 1].replace(/[^0-9]|(\.(?=.*\.))/g, '') + 'd');
	var user = db.data.users[number]
	if (!user) db.data.users[number] = {
		role: 'user',
		limit: 50,
		exp: 0,
		premium: false,
		expired: 0,
		level: 0,
		coin: 0,
		ruby: 0,
		mp: 0,
		banned: false,
		banexpired: 0,
		tokenpremium: 0,
		tokenfree: 1,
		tokenupgrade: 0,
		hit: 0,
		lastseen: 0,
		usebot: 0,
		afk: -1,
		afkReason: '',
		afkObj: {},
		pet: [{
			petname: 'ayam',
			level: 0,
			production: 0,
			hasproduction: 0,
			active: false
		}, {
			petname: 'kucing',
			level: 0,
			production: 0,
			hasproduction: 0,
			active: false
		}, {
			petname: 'kambing',
			level: 0,
			production: 0,
			hasproduction: 0,
			active: false
		}, {
			petname: 'sapi',
			level: 0,
			production: 0,
			hasproduction: 0,
			active: false
		}, {
			petname: 'kuda',
			level: 0,
			production: 0,
			hasproduction: 0,
			active: false
		}]
	}
	if (user.premium) return m.reply("dia sudah premium\n\nexpired: " + new Intl.DateTimeFormat('id-ID', {
		dateStyle: 'full',
		timeStyle: 'long'
	}).format(user.expired))
	user.expired += expired
	user.premium = true
	m.reply(`Berhasil menambahkan *${await conn.getName(number)}* sebagai pengguna Premium selama ${hl[hl.length - 1].replace(/[^0-9]/g, '')} hari\n\nExpired: ` + new Intl.DateTimeFormat('id-ID', {
		dateStyle: 'full',
		timeStyle: 'long'
	}).format(user.expired))
	await delay(2000)
	if (expired > Date.now() + 604800000 && expired < Date.now() + 1209600000) {
		user.tokenpremium += 1
		conn.reply(number, `*hai ${await conn.getName(number)}*\nowner @${m.sender.split`@`[0]} baru saja menambah kamu menjadi user premium\n\n╭⚅\t\t\t\t\t\t\t*PREMIUM*\t\t\t\t\t\t\t⚅\n ⎸\n ⎸Tokenprem: ${user.tokenpremium}\n ⎸expired: ${msToDate(user.expired - new Date() * 1)}\n ⎸\n╰⚅`, null, {
			mentions: [number, m.sender]
		})
	} else if (expired < Date.now() + 604800000) {
		user.tokenfree += 2
		conn.reply(number, `*hai ${await conn.getName(number)}*\nowner @${m.sender.split`@`[0]} baru saja menambah kamu menjadi user premium\n\n╭⚅\t\t\t\t\t\t\t*PREMIUM*\t\t\t\t\t\t\t⚅\n ⎸\n ⎸Tokenfree: ${user.tokenfree}\n ⎸expired: ${msToDate(user.expired - new Date() * 1)}\n ⎸\n╰⚅`, null, {
			mentions: [number, m.sender]
		})
	} else {
		user.tokenpremium += 2
		conn.reply(number, `*hai ${await conn.getName(number)}*\nowner @${m.sender.split`@`[0]} baru saja menambah kamu menjadi user premium\n\n╭⚅\t\t\t\t\t\t\t*PREMIUM*\t\t\t\t\t\t\t⚅\n ⎸\n ⎸Tokenprem: ${user.tokenpremium}\n ⎸expired: ${msToDate(user.expired - new Date() * 1)}\n ⎸\n╰⚅`, null, {
			mentions: [number, m.sender]
		})
	}
}
handler.help = ['addprem *@user expired*']
handler.tags = ['owner', 'premium']
handler.command = /^(add|tambah|\+)p(rem)?$/i
handler.owner = true
export default handler

function msToDate(ms) {
	var temp = ms,
		days = Math.floor((ms) / (24 * 60 * 60 * 1000)),
		daysms = ms % (24 * 60 * 60 * 1000),
		hours = Math.floor((daysms) / (60 * 60 * 1000)),
		hoursms = ms % (60 * 60 * 1000),
		minutes = Math.floor((hoursms) / (60 * 1000)),
		minutesms = ms % (60 * 1000),
		sec = Math.floor((minutesms) / (1000))
	return days + " Hari " + hours + " Jam " + minutes + " Menit";
	// +minutes+":"+sec;
}