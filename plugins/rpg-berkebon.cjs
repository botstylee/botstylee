var timeout = 1800000
var handler = async (m, {
	conn,
	usedPrefix,
	text
}) => {
	var user = db.data.users[m.sender]
	if (new Date - user.lastberkebon < 1800000) throw `Anda sudah menanam\nMohon tunggu hasil panenmu\nTunggu selama ${msToTime(time - new Date())} lagi`
	if (user.seedwortel > 99) {
		if (user.seedkangkung > 99) {
			if (user.seedkentang > 99) {
				if (user.seedkubis > 99) {
					if (user.seedtomat > 99) {
						if (user.seedjagung > 99) {
							if (user.seedbayam > 99) {
								if (user.seedlabu > 99) {
									var kentangpoin = `${Math.floor(Math.random() * 100)}`.trim()
									var tomatpoin = `${Math.floor(Math.random() * 100)}`.trim()
									var wortelpoin = `${Math.floor(Math.random() * 100)}`.trim()
									var kubispoin = `${Math.floor(Math.random() * 100)}`.trim()
									var kangkungpoin = `${Math.floor(Math.random() * 100)}`.trim()
									var bayampoin = `${Math.floor(Math.random() * 100)}`.trim()
									var jagungpoin = `${Math.floor(Math.random() * 100)}`.trim()
									var labupoin = `${Math.floor(Math.random() * 100)}`.trim()
									var ekpi = 1500
									user.kentang += kentangpoin * 1
									user.tomat += tomatpoin * 1
									user.wortel += wortelpoin * 1
									user.kubis += kubispoin * 1
									user.kangkung += kangkungpoin * 1
									user.jagung += jagungpoin * 1
									user.bayam += bayampoin * 1
									user.labu += labupoin * 1
									user.exp += ekpi * 1
									user.seedkentang -= 100
									user.seedtomat -= 100
									user.seedwortel -= 100
									user.seedkubis -= 100
									user.seedkangkung -= 100
									user.seedjagung -= 100
									user.seedbayam -= 100
									user.seedlabu -= 100
									user.lastberkebon = new Date * 1
									m.reply(`Selamat kamu mendapatkan : \n+${kentangpoin} kentang\n+${wortelpoin} wortel\n+${tomatpoin} tomat\n+${kubispoin} kubis\n+${kangkungpoin} kangkung\n${jagungpoin}jagung\n${bayampoin}bayam\n+${ekpi} Exp`)
									var time = user.lastberkebon += 1800000
									setTimeout(() => {
										conn.reply(m.chat, `Waktunya berkebon lagi kak�`, m)
									}, timeout)
								} else m.reply(`Pastikan seed tomat kamu *100* untuk bisa berkebon`)
							} else m.reply(`Pastikan seed kubis kamu *100* untuk bisa berkebon`)
						} else m.reply(`Pastikan seed kentang kamu *100* untuk bisa berkebon`)
					} else m.reply(`Pastikan seed kangkung kamu *100* untuk bisa berkebon`)
				} else m.reply(`Pastikan seed wortel kamu *100* untuk bisa berkebon`)
			} else m.reply(`Pastikan seed jagung kamu *100* untuk bisa berkebon`)
		} else m.reply(`Pastikan seed bayam kamu *100* untuk bisa berkebon`)
	} else m.reply(`Pastikan seed labu kamu *100* untuk bisa berkebon`)
}
handler.help = ['berkebon']
handler.tags = ['rpg']
handler.command = /^(berkebon)/i
handler.register = true
module.exports = handler

function msToTime(duration) {
	var milliseconds = parseInt((duration % 1000) / 100),
		seconds = Math.floor((duration / 1000) % 60),
		minutes = Math.floor((duration / (1000 * 60)) % 60),
		hours = Math.floor((duration / (1000 * 60 * 60)) % 24)


	hours = (hours < 10) ? "0" + hours : hours
	minutes = (minutes < 10) ? "0" + minutes : minutes
	seconds = (seconds < 10) ? "0" + seconds : seconds

	return hours + " jam " + minutes + " menit " + seconds + " detik"
}