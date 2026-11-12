var handler = async (m, { conn, args = [], usedPrefix, command }) => {
	var user = global.db?.data?.users?.[m.sender]
	if (!user) throw 'Data pengguna belum tersedia.'
	var amountText = String(args[0] || '').toLowerCase()
	if (!amountText) return m.reply(`Masukkan taruhan. Contoh: ${usedPrefix}${command} 1000 (maksimal 100000), atau ${usedPrefix}${command} all`)
	var count = amountText === 'all' ? Math.floor(Number(user.money) || 0) : Number(amountText)
	if (!Number.isSafeInteger(count) || count < 1000 || count > 100000) return m.reply('Taruhan minimal 1000 dan maksimal 100000.')
	if ((Number(user.money) || 0) < count) return m.reply('💵 Uang kamu tidak cukup.')
	if (pending[m.sender]) return m.reply('Kamu masih punya taruhan yang menunggu konfirmasi.')
	pending[m.sender] = { count, chat: m.chat, timeout: setTimeout(async () => {
		delete pending[m.sender]
		await conn.reply(m.chat, 'Konfirmasi taruhan kedaluwarsa.', m)
	}, 60000) }
	return conn.reply(m.chat, `⚠️ Taruhan ${count} money. Ketik *y* untuk lanjut atau *n* untuk batal (60 detik).`, m)
}
handler.before = async function(m) {
	var bet = pending[m.sender]
	if (!bet || !m.text || m.isBaileys) return
	var answer = m.text.trim().toLowerCase()
	if (!/^(y|yes|ya|n|no|tidak)$/.test(answer)) return
	clearTimeout(bet.timeout)
	delete pending[m.sender]
	if (/^(n|no|tidak)$/.test(answer)) {
		await m.reply('Taruhan dibatalkan.')
		return !0
	}
	var user = global.db?.data?.users?.[m.sender]
	if (!user || (Number(user.money) || 0) < bet.count) {
		await m.reply('Data uang berubah atau tidak cukup. Taruhan dibatalkan.')
		return !0
	}
	var botRoll = Math.floor(Math.random() * 80)
	var playerRoll = Math.floor(Math.random() * 71)
	var result
	var delta
	if (playerRoll > botRoll) { result = 'Menang'; delta = bet.count }
	else if (playerRoll < botRoll) { result = 'Kalah'; delta = -bet.count }
	else { result = 'Seri'; delta = 0 }
	user.money = (Number(user.money) || 0) + delta
	await m.reply(`Bot roll: *${botRoll}*\nKamu roll: *${playerRoll}*\n\nHasil: *${result}*\nPerubahan uang: *${delta >= 0 ? '+' : ''}${delta}* 💵`)
	return !0
}
handler.help = ['judi *jumlah|all*']
handler.tags = ['rpg']
handler.command = /^(judi|bet)$/i
module.exports = handler
var pending = Object.create(null)
