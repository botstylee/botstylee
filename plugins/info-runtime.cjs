var handler = async (m, {
	conn,
	args,
	command
}) => {
	var _muptime
	if (process.send) {
		process.send('uptime')
		_muptime = await new Promise(resolve => {
			process.once('message', resolve)
			setTimeout(resolve, 1000)
		}) * 1000
	}
	var muptime = msToDate(_muptime)
	var bot = db.data.settings[conn.user.jid]
	var status = `\t\t\t\t\t\t*S T A T U S*\n*self:* ${bot.self ? '✅' : '❎'}\n*restrict:* ${bot.restrict ? '✅' : '❎'}\n*onlypc:* ${bot.pconly ? '✅' : '❎'}`
	conn.reply(m.chat, await tiny(`\n*runtime*: ${muptime}\n\n${status}`), m, {
		contextInfo: {
			externalAdReply: {
				mediaType: 2,
				description: 'BOTSTYLEE',
				title: bottime,
				mediaUrl: 'https://youtube.com/channel/UCrNO1yUYW0i3xsJp4NGBh4Q', 
				body: '𓃗𓅜',
				thumbnail: profil,
				sourceUrl: 'https://chat.whatsapp.com/KihEAYjKr04LI4uUrbiiip',
				showAdAttribution: true, // false
				//renderLargerThumbnail: true // false
			}
		}
	})
}
handler.help = ['runtime', 'status']
handler.tags = ['info', 'main']
handler.command = ['runtime', 'rt', 'stats', 'status']
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
