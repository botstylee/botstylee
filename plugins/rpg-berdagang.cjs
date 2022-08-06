var handler = async (m, {
	conn,
	text
}) => {
	var dapat = (Math.floor(Math.random() * 5000))
	var who
	if (m.isGroup) who = m.mentionedJid[0]
	else who = m.chat
	if (!who) throw 'Tag salah satu lah, yang kamu ingin berdagang bareng'
	var user = db.data.users[m.sender]
	var __timers = (new Date - user.lastdagang)
	var _timers = (28800000 - __timers)
	var timers = clockString(_timers)
	var users = db.data.users
	var username = conn.getName(who)
	if (new Date - user.lastdagang > 28800000) {
		if (4999 > users[who].money) throw 'Target tidak memiliki modal harap masukkan modal 5000'
		if (4999 > users[m.sender].money) throw 'kamu tidak memiliki modal harap masukkan modal 5000'
		users[who].money -= dapat * 1
		users[m.sender].money -= dapat * 1
		user.lastdagang = new Date * 1
		m.reply(`Mohon tunggu kak..\nKamu dan @${who.replace(/@.+/, '')} sedang berdagang.. 😅\n\nKamu dan @${who.replace(/@.+/, '')} meletakkan modal -${dapat} 😅`)
		setTimeout(() => {
			conn.reply(m.chat, `Selamat kamu dan @${who.replace(/@.+/, '')} mendapatkan money..\n\nPenghasilan dagang kamu didapatkan +5000\n${users[m.sender].money += 5000} Money kamu\n\nPenghasilan dagang @${who.replace(/@.+/, '')} didapatkan +5000\n${users[who].money += 5000} Money @${who.replace(/@.+/, '')}`, m)
		}, 3600000)
		setTimeout(() => {
			conn.reply(m.chat, `Selamat kamu dan @${who.replace(/@.+/, '')} mendapatkan money..\n\nPenghasilan dagang kamu didapatkan +5000\n${users[m.sender].money += 5000} Money kamu\n\nPenghasilan dagang @${who.replace(/@.+/, '')} didapatkan +5000\n${users[who].money += 5000} Money @${who.replace(/@.+/, '')}`, m)
		}, 7200000)
		setTimeout(() => {
			conn.reply(m.chat, `Selamat kamu dan @${who.replace(/@.+/, '')} mendapatkan money..\n\nPenghasilan dagang kamu didapatkan +5000\n${users[m.sender].money += 5000} Money kamu\n\nPenghasilan dagang @${who.replace(/@.+/, '')} didapatkan +5000\n${users[who].money += 5000} Money @${who.replace(/@.+/, '')}`, m)
		}, 10800000)
		setTimeout(() => {
			conn.reply(m.chat, `Selamat kamu dan @${who.replace(/@.+/, '')} mendapatkan money..\n\nPenghasilan dagang kamu didapatkan +5000\n${users[m.sender].money += 5000} Money kamu\n\nPenghasilan dagang @${who.replace(/@.+/, '')} didapatkan +5000\n${users[who].money += 5000} Money @${who.replace(/@.+/, '')}`, m)
		}, 14400000)
		setTimeout(() => {
			conn.reply(m.chat, `Selamat kamu dan @${who.replace(/@.+/, '')} mendapatkan money..\n\nPenghasilan dagang kamu didapatkan +5000\n${users[m.sender].money += 5000} Money kamu\n\nPenghasilan dagang @${who.replace(/@.+/, '')} didapatkan +5000\n${users[who].money += 5000} Money @${who.replace(/@.+/, '')}`, m)
		}, 18000000)
		setTimeout(() => {
			conn.reply(m.chat, `Selamat kamu dan @${who.replace(/@.+/, '')} mendapatkan money..\n\nPenghasilan dagang kamu didapatkan +5000\n${users[m.sender].money += 5000} Money kamu\n\nPenghasilan dagang @${who.replace(/@.+/, '')} didapatkan +5000\n${users[who].money += 5000} Money @${who.replace(/@.+/, '')}`, m)
		}, 21600000)
		setTimeout(() => {
			conn.reply(m.chat, `Selamat kamu dan @${who.replace(/@.+/, '')} mendapatkan money..\n\nPenghasilan dagang kamu didapatkan +5000\n${users[m.sender].money += 5000} Money kamu\n\nPenghasilan dagang @${who.replace(/@.+/, '')} didapatkan +5000\n${users[who].money += 5000} Money @${who.replace(/@.+/, '')}`, m)
		}, 25200000)
		setTimeout(() => {
			conn.reply(m.chat, `Selamat kamu dan @${who.replace(/@.+/, '')} mendapatkan money..\n\nPenghasilan dagang kamu didapatkan +10000\n${users[m.sender].money += 10000} Money kamu\n\nPenghasilan dagang @${who.replace(/@.+/, '')} didapatkan +10000\n${users[who].money += 10000} Money @${who.replace(/@.+/, '')}`, m)
		}, 28800000)
	} else conn.reply(m.chat, `Anda Sudah Berdagang , tunggu ${timers} lagi..`, m)
}
handler.help = ['berdagang *@tag*']
handler.tags = ['rpg']
handler.command = /^berdagang$/
handler.register = true

module.exports = handler

function pickRandom(list) {
	return list[Math.floor(Math.random() * list.length)]
}

function clockString(ms) {
	var h = Math.floor(ms / 3600000)
	var m = Math.floor(ms / 60000) % 60
	var s = Math.floor(ms / 1000) % 60
	console.log({
		ms,
		h,
		m,
		s
	})
	return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}