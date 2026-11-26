// plugins/rpg-berkebon.cjs
// Fitur: Berkebon untuk dapat hasil panen (butuh 100 seed tiap jenis)

var timeout = 1800000

var handler = async (m, {
	conn,
	usedPrefix,
	text
}) => {
	// Guard: user harus terdaftar
	var user = db.data.users[m.sender]
	if (!user) return m.reply('Kamu belum terdaftar di database.')

	// Pastikan field penting ada
	if (typeof user.lastberkebon !== 'number') user.lastberkebon = 0

	// Hitung cooldown
	var __timers = new Date() - user.lastberkebon
	var _timers = timeout - __timers

	// Guard: cooldown
	if (__timers < timeout) {
		throw `Anda sudah menanam\nMohon tunggu hasil panenmu\nTunggu selama ${msToTime(_timers)} lagi`
	}

	// Daftar seed yang dibutuhkan (100 tiap jenis)
	var seeds = [
		['seedwortel', 'wortel', 'wortel'],
		['seedkangkung', 'kangkung', 'kangkung'],
		['seedkentang', 'kentang', 'kentang'],
		['seedkubis', 'kubis', 'kubis'],
		['seedtomat', 'tomat', 'tomat'],
		['seedjagung', 'jagung', 'jagung'],
		['seedbayam', 'bayam', 'bayam'],
		['seedlabu', 'labu', 'labu']
	]

	// Cek semua seed harus ≥ 100
	for (var [seedKey, , label] of seeds) {
		var jumlah = user[seedKey] || 0
		if (jumlah < 100) {
			throw `Pastikan seed ${label} kamu *100* untuk bisa berkebon (kamu punya ${jumlah})`
		}
	}

	// Proses panen
	var hasil = []
	var totalExp = 1500

	for (var [seedKey, hasilKey] of seeds) {
		var poin = Math.floor(Math.random() * 100)
		user[hasilKey] = (user[hasilKey] || 0) + poin
		user[seedKey] -= 100
		hasil.push(`+${poin} ${hasilKey}`)
	}

	// Tambah exp
	user.exp = (user.exp || 0) + totalExp
	hasil.push(`+${totalExp} exp`)

	// Update cooldown
	user.lastberkebon = new Date() * 1

	// Kirim hasil
	var txt = `*🌾 PANEN BERHASIL 🌾*\n\nSelamat kamu mendapatkan:\n${hasil.map(v => '• ' + v).join('\n')}\n\n_Cooldown: 30 menit_`
	await m.reply(txt)
}

handler.help = ['berkebon']
handler.tags = ['rpg']
handler.command = /^(berkebon)$/i
handler.register = true

module.exports = handler

/**
 * Konversi ms ke format "X jam Y menit Z detik"
 * @param {number} duration
 * @returns {string}
 */
function msToTime(duration) {
	var seconds = Math.floor((duration / 1000) % 60)
	var minutes = Math.floor((duration / (1000 * 60)) % 60)
	var hours = Math.floor((duration / (1000 * 60 * 60)) % 24)

	hours = hours < 10 ? '0' + hours : hours
	minutes = minutes < 10 ? '0' + minutes : minutes
	seconds = seconds < 10 ? '0' + seconds : seconds

	return hours + ' jam ' + minutes + ' menit ' + seconds + ' detik'
}
