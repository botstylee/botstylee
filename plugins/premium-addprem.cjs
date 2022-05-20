const toMs = require('ms');
let handler = async (m, {
	conn,
	text,
	usedPrefix,
	command,
	args
}) => {
	let who
	if (m.isGroup) who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : args[0] ? (args[0].replace(/[@ .+-]/g, '') + '@s.whatsapp.net').trim() : ''
	else who = args[0] ? (args[0].replace(/[@ .+-]/g, '') + '@s.whatsapp.net').trim() : m.chat
	let user = global.db.data.users[who]
	if (!(who in global.db.data.users)) return m.reply(`User ${who} not in database`)
	if (!who) return m.reply(`Tag/Mention!\n\nContoh:\n${usedPrefix + command} @0 1d\n\n huruf d mewakili hari, huruf w mewakili minggu`)
	if (!('premium' in user)) {
		user.premium = false
	}
	if (user.premium) return m.reply("dia sudah jadi member premium bang\n\nmasa berakhirnya: " + new Intl.DateTimeFormat('id-ID', {
		dateStyle: 'full',
		timeStyle: 'long'
	}).format(user.expired))
	let txt = text.replace('@' + who.split`@` [0], '').trim().toLowerCase()
	if (!txt) throw `mau uprgade user brapa hari?\n\nContoh:\n${usedPrefix + command} @0 1d`
	if (!txt.match(/(d|w|m|y)/gi)) return m.reply(`hanya mendukung hari, menit, tahun, minggu\nExample: ${usedPrefix+command} 1d\n!*NOTE*\nGunakan format: d untuk hari, w untuk minggu, m untuk menit, y untuk tahun`)
	user.expired += Date.now() + toMs(txt)
	user.premium = true
	let format
	if (txt.match('d')) format = txt.replace('d', ' Hari')
	if (txt.match('w')) format = txt.replace('w', ' Minggu')
	if (txt.match('m')) format = txt.replace('m', ' Menit')
	if (txt.match('y')) format = txt.replace('y', ' Tahun')
	m.reply(`Berhasil menambahkan *${user.name}* sebagai pengguna Premium selama ${format}.\n\nExpired: ` + new Intl.DateTimeFormat('id-ID', {
		dateStyle: 'full',
		timeStyle: 'long'
	}).format(user.expired))
}
handler.help = ['addprem [@user] <angka>']
handler.tags = ['owner', 'premium']
handler.command = /^(add|tambah|\+)p(rem)?$/i
handler.owner = true
module.exports = handler