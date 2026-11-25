var handler = async (m, {
	conn,
	args,
	usedPrefix,
	command
}) => {
	var isClose = {
		'open': 'not_announcement',
		'close': 'announcement',
	} [(args[0] || '').toLowerCase()]

	if (isClose === undefined) {
		throw `
╭───「 *GROUP SETTINGS* 」───
│
│  *Format salah!* Contoh penggunaan:
│
│  ○ ${usedPrefix + command} close
│     → Hanya admin yang bisa kirim pesan
│
│  ○ ${usedPrefix + command} open
│     → Semua member bisa kirim pesan
│
╰────────────────────────
`.trim()
	}

	await conn.groupSettingUpdate(m.chat, isClose)

	var mode = isClose === 'announcement' ? 'close' : 'open'
	var deskripsi = isClose === 'announcement'
		? 'Grup telah *ditutup* 🔒\nHanya admin yang dapat mengirim pesan.'
		: 'Grup telah *dibuka* 🔓\nSemua member dapat mengirim pesan.'

	m.reply(`
╭───「 *GROUP SETTINGS* 」───
│
│  ✅ *Berhasil!*
│
│  ${deskripsi.replace(/\n/g, '\n│  ')}
│
╰────────────────────────
`.trim())
}
handler.help = ['group *open / close*']
handler.tags = ['group']
handler.command = /^(group)$/i
handler.group = true
handler.admin = true
handler.botAdmin = true

module.exports = handler
