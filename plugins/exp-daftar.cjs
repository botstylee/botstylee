var handler = async (m, { conn, text = '', usedPrefix, command }) => {
	var user = global.db?.data?.users?.[m.sender]
	if (!user) throw 'Data pengguna belum tersedia.'
	if (user.registered) throw `Kamu sudah terdaftar. Untuk daftar ulang: ${usedPrefix}unreg <SERIAL NUMBER>`
	var input = text.trim()
	if (!input) return conn.reply(m.chat, `Format pendaftaran: ${usedPrefix + command} nama.umur\nContoh: ${usedPrefix + command} Budi.18`, m)

	var match = input.match(/^([\p{L}\p{N}_ -]{1,30})[.]([0-9]{1,2})$/u)
	if (!match) throw `Format tidak valid. Gunakan: ${usedPrefix + command} nama.umur`
	var name = match[1].trim()
	var age = Number(match[2])
	if (!name) throw 'Nama tidak boleh kosong.'
	if (age > 30) throw 'Umur maksimal 30 tahun.'
	if (age < 5) throw 'Umur minimal 5 tahun.'

	user.name = name
	user.age = age
	user.regTime = Date.now()
	user.registered = true
	var serial = require('crypto').createHash('md5').update(m.sender).digest('hex')
	return conn.reply(m.chat, `━━━━ 「 *Pendaftaran Sukses* 」━━━━\n\nNama: ${name}\nUmur: ${age} tahun\nSN: ${serial}`, m)
}
handler.help = ['daftar', 'register'].map(value => value + ' *nama.umur*')
handler.tags = ['xp']
handler.command = /^(daftar|verify|reg(ister)?)$/i
module.exports = handler
