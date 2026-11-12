var handler = async (m, { conn, command, usedPrefix, participants = [] }) => {
	var members = participants.map(user => user.id).filter(Boolean)
	if (!members.length) return m.reply('Tidak ada anggota grup yang dapat dipilih.')
	var person = /ku/i.test(command) ? m.sender : pick(members)
	var partner = pick(members)
	var answer = `@${person.split('@')[0]} ❤️ @${partner.split('@')[0]}`
	return conn.reply(m.chat, answer, m, { mentions: [person, partner] })
}
handler.help = ['jodohin', 'jodohku']
handler.tags = ['fun']
handler.command = /^(jodoh(in|ku)|jadian)$/i
handler.group = true
module.exports = handler
function pick(items) { return items[Math.floor(Math.random() * items.length)] }
