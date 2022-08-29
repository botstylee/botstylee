var handler = async (m, {
	conn
}) => {
	var blocked = (await conn.fetchBlocklist()).map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').filter(v => v != conn.user.jid)
	conn.reply(m.chat, `┌〔 Daftar Terblokir 〕\n` + blocked.map((v, i) => `├ ${i + 1}. @${v.split`@`[0]}`).join`\n` + `\n└────`, m, {
		mentions: blocked
	})
}
handler.help = ['blocklist']
handler.tags = ['info']
handler.command = /^listbloc?k|bloc?klist|daftarbloc?k$/i

module.exports = handler