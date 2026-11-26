// plugins/kerang-cek.cjs
// Fitur: Cek level random (fun)

var handler = async (m, {
	conn,
	command
}) => {
	// Ambil nama tanpa "cek", case-insensitive
	var nama = command.replace(/cek$/i, '').toUpperCase()
	var level = Math.floor(Math.random() * 101)

	var jawab = `
────〔 *${command}* 〕────

${nama} LEVEL *${level}*% 

Seberapapun *${nama}* Mu
Tetap *SYUKURI* itu`.trim()

	await conn.reply(m.chat, jawab, m)
}

handler.help = ['gay', 'pintar', 'cantik', 'ganteng', 'gabut', 'gila', 'lesbi', 'stress', 'bucin', 'jones', 'sadboy'].map(v => v + 'cek')
handler.tags = ['kerang']
handler.command = /^(gay|pintar|cantik|ganteng|gabut|gila|lesbi|stress?|bucin|jones|sadboy)cek$/i

module.exports = handler
