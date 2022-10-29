var handler = async (m, {
	conn,
	usedPrefix,
	command,
	text
}) => {
	conn.reply(m.chat, `
────〔 *${command}* 〕────

${command.replace('cek', '').toUpperCase()} LEVEL *${Math.floor(Math.random() * 101)}*% 

Seberapapun *${command.replace('cek', '').toUpperCase()}* Mu
Tetap *SYUKURI* itu`)
}
handler.help = ['gay', 'pintar', 'cantik', 'ganteng', 'gabut', 'gila', 'lesbi', 'stress', 'bucin', 'jones', 'sadboy'].map(v => v + 'cek')
handler.tags = ['kerang']
handler.command = /^(gay|pintar|cantik|ganteng|gabut|gila|lesbi|stress?|bucin|jones|sadboy)cek/i

module.exports = handler