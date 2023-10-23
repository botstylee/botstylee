var handler = async (m, {
	conn,
	isOwner
}) => {
	var groups = Object.values(await conn.groupFetchAllParticipating()),
		txt = `*GROUPS LIST*\n\n*Total:* ${groups.length}\n\n`
	for (var i = 0; i < groups.length; i++) {
		var {
			grouprental,
			expired
		} = db.data.chats[groups[i].id]
		txt += `*• Subject:* ${groups[i].subject}\n` +
			`*• ID:* ${groups[i].id}\n` +
			`${isOwner ? `*• Participants:* ${groups[i].participants.length}\n` : ''}` +
			`${isOwner ? `*• isBotAdmin:* ${!!groups[i].participants.find(v => v.id == conn.user.jid).admin}\n` : ''}` +
			`${grouprental ? '*• Expired:* ' + await msToDate(expired - new Date() * 1)+ '\n' : ''}\n`
	}
	m.reply(txt.trim())
}
handler.command = /^list(gc|gro?up)$/i
handler.help = ['listgroup']
handler.tags = ['info']

module.exports = handler

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