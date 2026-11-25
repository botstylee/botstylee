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
		} = db.data.chats[groups[i].id] || {}
		
		// ✅ Guard: bot mungkin tidak ada di participants (misalnya sudah di-kick)
		var botParticipant = groups[i].participants.find(v => v.id == conn.user.jid)
		var isBotAdmin = botParticipant ? !!botParticipant.admin : false
		
		// ✅ msToDate tidak async → hapus await
		// ✅ Guard expired agar tidak NaN
		var expiredText = grouprental && expired ? '*• Expired:* ' + msToDate(expired - new Date() * 1) + '\n' : ''
		
		txt += `*• Subject:* ${groups[i].subject}\n` +
			`*• ID:* ${groups[i].id}\n` +
			`${isOwner ? `*• Participants:* ${groups[i].participants.length}\n` : ''}` +
			`${isOwner ? `*• isBotAdmin:* ${isBotAdmin}\n` : ''}` +
			`${expiredText}\n`
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
}
