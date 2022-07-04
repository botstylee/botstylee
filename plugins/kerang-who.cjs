let handler = async (m, { 
	conn, 
	command, 
	text,
	participants 
}) => {
        let member = participants.map(u => u.id)
        let siapa = member[Math.floor(Math.random() * member.length)] 
        let jawab = `
*Pertanyaan:* ${command} ${text}?
*@${siapa.replace(/@.+/, '')}*
 `.trim()
        conn.reply(m.chat, jawab, m, { mentions : [siapa]}) 
}
handler.help = ['who'].map(v => 'who' + v + ' <text>?')
handler.tags = ['kerang']
handler.customPrefix = /(\?$)/
handler.command = ['who', 'siapa']
handler.group = true
 
module.exports = handler