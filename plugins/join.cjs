let linkRegex = /chat.whatsapp.com\/([0-9A-Za-z]{20,24})( [0-9]{1,3})?/i

let handler = async (m, {
	conn,
	text,
	isOwner,
	isPrems
}) => {
	let [_, code, expired] = text.match(linkRegex) || []
	if (!code) throw 'Link invalid'
	let users = db.data.users[m.sender]
	if (!isOwner && users.limitjoin == 0) throw 'limit join kamu sudah habis, silahkan upgrade premium untuk mendapatkan 3 tambahan limit'
	let res = await conn.groupAcceptInvite(code)
	if (isPrems || users.sewa) {
		users.limitjoin -= 1
		expired = 30
		let chats = db.data.chats[res]
		if (!chats) chats = db.data.chats[res] = {}
		if (expired) chats.expired = +new Date() + expired * 1000 * 60 * 60 * 24
		chats.groupexpired = true
		m.reply(`Berhasil join grup ${res}${expired ? ` selama ${expired} hari` : ''}`)
		await delay(1500)
		conn.reply(res, `*${conn.user.name}* adalah bot whatsapp yang di bangun menggunakan Nodejs, diundang oleh @${m.sender.split`@`[0]} trial selama\n*${msToDate(db.data.chats[res].expired - new Date() * 1)}*\n\nUntuk Melihat List *Menu* bot ketik *#menu*\n\nJika ingin di perpanjang expired group harap hubungi *owner* kami..`.trim(), null, {
			mentions: [m.sender]
		})
	} else if (isOwner) {
		m.reply(`Berhasil join grup ${res}`)
		await delay(1500)
		conn.reply(res, `*${conn.user.name}* adalah bot whatsapp yang di bangun menggunakan Nodejs, diundang oleh owner kami *@${m.sender.split`@`[0]}* \n\nUntuk Melihat List *Menu* bot ketik *#menu*\n`.trim(), null, {
			mentions: [m.sender]
		})
	} else {
		users.limitjoin -= 1
		expired = 1.5
		let chats = db.data.chats[res]
		if (!chats) chats = db.data.chats[res] = {}
		if (expired) chats.expired = +new Date() + expired * 1000 * 60 * 60 * 24
		chats.groupexpired = true
		m.reply(`Berhasil join grup ${res}${expired ? ` selama ${expired} hari` : ''}`)
		await delay(1500)
		conn.reply(res, `*${conn.user.name}* adalah bot whatsapp yang di bangun menggunakan Nodejs, diundang oleh @${m.sender.split`@`[0]} trial selama\n*${msToDate(db.data.chats[res].expired - new Date() * 1)}*\n\nUntuk Melihat List *Menu* bot ketik *#menu*\n\nJika ingin di perpanjang expired group harap hubungi *owner* kami..`.trim(), null, {
			mentions: [m.sender]
		})
	}
}
handler.help = ['join *chat.whatsapp.com*']
handler.tags = ['premium']

handler.command = /^join$/i

module.exports = handler

const isNumber = (x) => (x = parseInt(x), typeof x === 'number' && !isNaN(x))