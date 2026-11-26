// plugins/rpg-judi.cjs
// Fitur: Judi tebak angka (bot vs user)

var confirm = {}

async function handler(m, {
	conn,
	args
}) {
	// Guard: user harus terdaftar
	var user = db.data.users[m.sender]
	if (!user) return m.reply('Kamu belum terdaftar di database.')

	// Pastikan money ada
	if (typeof user.money !== 'number') user.money = 0

	// Guard: masih ada judi berjalan
	if (m.sender in confirm) throw 'Kamu masih melakukan judi, tunggu sampai selesai!!'

	// Guard: harus ada argumen
	if (!args[0]) return m.reply('Brani taruhan berapa?')

	// Parse jumlah taruhan
	var count
	if (/all/i.test(args[0])) {
		count = Math.floor(user.money)
	} else {
		count = parseInt(args[0])
		if (isNaN(count) || count < 1) return m.reply('Jumlah taruhan tidak valid.')
	}

	// Guard: minimal & maksimal
	if (count < 1000) return m.reply('Minimal 1000 buat taruhan.')
	if (count > 100000) return m.reply('Maksimal 100000 buat taruhan.')

	// Guard: uang cukup
	if (user.money < count) return m.reply('💵 Uang kamu tidak cukup!!')

	// Simpan konfirmasi
	confirm[m.sender] = {
		sender: m.sender,
		count,
		timeout: setTimeout(() => {
			if (m.sender in confirm) {
				m.reply('Timed out')
				delete confirm[m.sender]
			}
		}, 60000)
	}

	var txt = '⚠️ Warning ⚠️\n*Jangan judi karena tidak akan menang, BENERAN!!*\n\nApakah anda yakin (pikirkan baik-baik) mau melakukan judi?\nKetik *y* untuk ya, *n* untuk tidak.\n(60s Timeout)'

	return conn.sendMessage(m.chat, { text: txt }, { quoted: m })
}

// before di module.exports, bukan handler.before
handler.before = async function (m) {
	if (!(m.sender in confirm)) return
	if (m.isBaileys) return

	var { timeout, count } = confirm[m.sender]
	var user = db.data.users[m.sender]
	if (!user) {
		clearTimeout(timeout)
		delete confirm[m.sender]
		return
	}
	if (typeof user.money !== 'number') user.money = 0

	var moneyDulu = user.money
	var txt = (m.msg && m.msg.selectedDisplayText ? m.msg.selectedDisplayText : m.text ? m.text : '').toLowerCase()

	try {
		if (/^y(es|a)?$/i.test(txt)) {
			// Roll
			var Bot = Math.floor(Math.random() * 80)
			var Kamu = Math.floor(Math.random() * 71)
			var status = 'Kalah'
			var reward = 0

			if (Bot < Kamu) {
				// Menang
				reward = count * 2
				user.money += reward
				status = 'Menang'
			} else if (Bot > Kamu) {
				// Kalah
				reward = -count
				user.money -= count
				status = 'Kalah'
			} else {
				// Seri
				reward = Math.floor(count / 1.5)
				user.money += reward
				status = 'Seri'
			}

			var txtHasil = `Bot roll: *${Bot}*\nKamu roll: *${Kamu}*\n\nKamu *${status}*, kamu ${reward >= 0 ? `Mendapatkan *+${reward}*` : `Kehilangan *${reward}*`} 💵Money`

			clearTimeout(timeout)
			delete confirm[m.sender]

			m.reply(txtHasil)
			return true
		} else if (/^no?$/i.test(txt)) {
			clearTimeout(timeout)
			delete confirm[m.sender]
			m.reply('Rejected')
			return true
		}
	} catch (e) {
		clearTimeout(timeout)
		delete confirm[m.sender]
		if (moneyDulu > user.money) user.money = moneyDulu
		m.reply('Error saat melakukan judi (Rejected)')
		return true
	}

	// Kalau teks bukan y/n, jangan hapus confirm (biar user bisa coba lagi)
}

handler.help = ['judi *jumlah*']
handler.tags = ['rpg']
handler.command = /^(judi|bet)$/i

module.exports = handler
