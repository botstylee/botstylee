// plugins/premium-join.cjs
// Fitur: Join grup via link undangan (owner/premium/free dengan limit)

var linkRegex = /chat\.whatsapp\.com\/([0-9A-Za-z]{20,24})( [0-9]{1,3})?/i

var handler = async (m, {
	conn,
	text,
	isOwner
}) => {
	// Guard: harus ada link
	if (!text) throw 'Masukkan link grup!\nContoh: .join https://chat.whatsapp.com/xxxxx'

	// Parse link
	var [_, code, expired] = text.match(linkRegex) || []
	if (!code) throw 'Link invalid'

	// Guard: user harus terdaftar
	var users = db.data.users[m.sender]
	if (!users) throw 'Kamu belum terdaftar di database.'

	// Pastikan limitjoin ada
	if (typeof users.limitjoin !== 'number') users.limitjoin = 0

	// Guard: limit join (kecuali owner)
	if (!isOwner && users.limitjoin <= 0) {
		throw 'Limit join kamu sudah habis, silahkan upgrade premium untuk mendapatkan 3 tambahan limit'
	}

	// Join grup
	var res = await conn.groupAcceptInvite(code).catch(e => {
		throw 'Gagal join grup: ' + e.message
	})

	// Nama bot
	var botName = conn.user?.name || conn.user?.verifiedName || conn.getName(conn.user.jid) || 'Bot'

	// === Owner ===
	if (isOwner) {
		await m.reply(`Berhasil join grup ${res}`)
		await delay(1500)
		return conn.reply(
			res,
			`*${botName}* adalah bot whatsapp yang di bangun menggunakan Nodejs, diundang oleh owner kami *@${m.sender.split('@')[0]}*\n\nUntuk Melihat List *Menu* bot ketik *#menu*`,
			null,
			{ mentions: [m.sender] }
		)
	}

	// === Premium / Sewa ===
	if (users.premium || users.sewa) {
		users.limitjoin -= 1
		expired = 30
		var chats = db.data.chats[res]
		if (!chats) chats = db.data.chats[res] = {}
		chats.expired = +new Date() + expired * 1000 * 60 * 60 * 24
		chats.groupexpired = true

		await m.reply(
			`Berhasil join grup ${res} selama ${expired} hari.\nlimitjoin berkurang 1\n${users.limitjoin === 0 ? 'Limit join kamu sudah habis' : 'Limit join kamu tersisa ' + users.limitjoin}`
		)
		await delay(1500)
		return conn.reply(
			res,
			`*${botName}* adalah bot whatsapp yang di bangun menggunakan Nodejs, diundang oleh @${m.sender.split('@')[0]} trial selama\n*${msToDate(chats.expired - new Date() * 1)}*\n\nUntuk Melihat List *Menu* bot ketik *#menu*\n\nJika ingin di perpanjang expired group harap hubungi *owner* kami..`,
			null,
			{ mentions: [m.sender] }
		)
	}

	// === Free ===
	users.limitjoin -= 1
	expired = 1.5
	var chats2 = db.data.chats[res]
	if (!chats2) chats2 = db.data.chats[res] = {}
	chats2.expired = +new Date() + expired * 1000 * 60 * 60 * 24
	chats2.groupexpired = true

	await m.reply(
		`Berhasil join grup ${res} selama ${expired} hari.\nlimitjoin berkurang 1\n${users.limitjoin === 0 ? 'Limit join kamu sudah habis' : 'Limit join kamu tersisa ' + users.limitjoin}\n*INFO*\nbagi member free masing-masing mendapatkan 1 trial limitjoin selama 1hari 12jam\nbeli point limitjoin untuk mendapatkan trial limitjoin selama 30 hari atau upgrade ke premium`
	)
	await delay(1500)
	return conn.reply(
		res,
		`*${botName}* adalah bot whatsapp yang di bangun menggunakan Nodejs, diundang oleh @${m.sender.split('@')[0]} trial selama\n*${msToDate(chats2.expired - new Date() * 1)}*\n\nUntuk Melihat List *Menu* bot ketik *#menu*\n\nJika ingin di perpanjang expired group harap hubungi *owner* kami..`,
		null,
		{ mentions: [m.sender] }
	)
}

handler.help = ['join *chat.whatsapp.com*']
handler.tags = ['premium']
handler.command = /^join$/i

module.exports = handler

/**
 * Konversi milidetik ke format "X Hari Y Jam Z Menit"
 * @param {number} ms
 * @returns {string}
 */
function msToDate(ms) {
	var days = Math.floor(ms / (24 * 60 * 60 * 1000))
	var daysms = ms % (24 * 60 * 60 * 1000)
	var hours = Math.floor(daysms / (60 * 60 * 1000))
	var hoursms = ms % (60 * 60 * 1000)
	var minutes = Math.floor(hoursms / (60 * 1000))
	return days + " Hari " + hours + " Jam " + minutes + " Menit"
}
