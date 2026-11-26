var handler = async (m, {
	conn,
	args,
	command
}) => {
	var _muptime

	// ✅ Ambil uptime dari process.send kalau ada
	if (process.send) {
		try {
			process.send('uptime')
			_muptime = await new Promise(resolve => {
				process.once('message', resolve)
				setTimeout(() => resolve(0), 1000)
			}) * 1000
		} catch (e) {
			console.error('[runtime] Gagal ambil uptime:', e)
			_muptime = 0
		}
	} else {
		// ✅ Fallback: pakai process.uptime() kalau bukan child process
		_muptime = process.uptime() * 1000
	}

	var muptime = msToDate(_muptime)

	// ✅ Ambil db dengan fallback
	var db = global.db || require('../lib/database.js').default
	if (!db?.data?.settings) {
		return conn.reply(m.chat, 'Database belum siap.', m)
	}

	// ✅ Pastikan settings bot ada
	if (!db.data.settings[conn.user.jid]) {
		db.data.settings[conn.user.jid] = {
			self: false,
			autoread: false,
			restrict: false,
			pconly: false
		}
	}
	var bot = db.data.settings[conn.user.jid]

	var status = `\t\t\t\t\t\t*S T A T U S*\n*self:* ${bot.self ? '✅' : '❎'}\n*restrict:* ${bot.restrict ? '✅' : '❎'}\n*onlypc:* ${bot.pconly ? '✅' : '❎'}`

	// ✅ Teks runtime tanpa tiny (atau pakai tiny kalau ada)
	var runtimeText = `\n*runtime*: ${muptime}\n\n${status}`
	if (typeof tiny === 'function') {
		runtimeText = await tiny(runtimeText)
	}

	// ✅ Thumbnail: pakai buffer dari global.profil kalau ada, atau skip
	var thumbnail = null
	try {
		if (global.profil) {
			thumbnail = Buffer.isBuffer(global.profil)
				? global.profil
				: require('fs').existsSync(global.profil)
					? require('fs').readFileSync(global.profil)
					: null
		}
	} catch (e) {
		console.error('[runtime] Gagal load thumbnail:', e)
	}

	await conn.reply(m.chat, runtimeText, m, {
		contextInfo: {
			externalAdReply: {
				mediaType: 1, // ✅ 1 = image
				description: 'BOTSTYLEE',
				title: global.bottime || 'Botstylee',
				mediaUrl: 'https://youtube.com/channel/UCrNO1yUYW0i3xsJp4NGBh4Q',
				body: '𓃗𓅜',
				thumbnail,
				sourceUrl: 'https://chat.whatsapp.com/KihEAYjKr04LI4uUrbiiip',
				showAdAttribution: true
			}
		}
	})
}

handler.help = ['runtime', 'status']
handler.tags = ['info', 'main']
handler.command = ['runtime', 'rt', 'stats', 'status']

module.exports = handler

function msToDate(ms) {
	if (typeof ms !== 'number' || isNaN(ms) || ms < 0) ms = 0
	var temp = ms
	var years = Math.floor(ms / (12 * 30 * 24 * 60 * 60 * 1000))
	var yearsms = ms % (12 * 30 * 24 * 60 * 60 * 1000)
	var month = Math.floor(yearsms / (30 * 24 * 60 * 60 * 1000))
	var monthms = ms % (30 * 24 * 60 * 60 * 1000)
	var days = Math.floor(monthms / (24 * 60 * 60 * 1000))
	var daysms = ms % (24 * 60 * 60 * 1000)
	var hours = Math.floor(daysms / (60 * 60 * 1000))
	var hoursms = ms % (60 * 60 * 1000)
	var minutes = Math.floor(hoursms / (60 * 1000))
	var minutesms = ms % (60 * 1000)
	var sec = Math.floor(minutesms / 1000)
	return days + " Hari " + hours + " Jam " + minutes + " Menit"
}
