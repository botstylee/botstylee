var handler = async (m, {
	conn,
	args,
	usedPrefix
}) => {
	var user = Object.entries(db.data.users).filter(user => user[1].premium).map(([key, value]) => {
		return {
			...value,
			jid: key
		}
	})
	var premTime = db.data.users[m.sender].expired
	var prem = db.data.users[m.sender].premium
	var sortedP = user.map(toNumber('expired')).sort(sort('expired'))
	var len = args[0] && args[0].length > 0 ? Math.min(100, Math.max(parseInt(args[0]), 10)) : Math.min(10, sortedP.length)
	await conn.reply(m.chat, `\t\t\t\t\t\t° *PREMIUM* °
${prem ? `\t\t\t\t\t\t*My Premium Time*\n*Name:* ${conn.getName(m.sender)}\n*Expired:* ${msToDate(premTime - new Date() * 1)}` : ''}

${sortedP.slice(0, len).map(({ jid, name, expired }, i) => `\n*${conn.getName(jid)}*\n⚄ wa.me/${jid.split`@`[0]}\n⚄ ${msToDate(expired - new Date() * 1)}\n`).join`\n`}
`.trim(), m)
}
handler.help = ['premlist *angka*']
handler.tags = ['premium']
handler.command = /^(listprem|premlist|listpremium)$/i

export default handler

function sort(property, ascending = true) {
	if (property) return (...args) => args[ascending & 1][property] - args[!ascending & 1][property]
	else return (...args) => args[ascending & 1] - args[!ascending & 1]
}

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
function toNumber(property, _default = 0) {
	if (property) return (a, i, b) => {
		return {
			...b[i],
			[property]: a[property] === undefined ? _default : a[property]
		}
	}
	else return a => a === undefined ? _default : a
}