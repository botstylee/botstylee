var handler = async (m, {
	conn,
	text
}) => {
	conn.reply(m.chat, `Kayaknya ${Math.floor(Math.random() * 100)} ${pickRandom(['detik', 'menit', 'jam', 'hari', 'minggu', 'bulan', 'tahun', 'abad'])} lagi ...
`.trim(), m, m.mentionedJid ? {
		mentions: m.mentionedJid
	} : {})
}
handler.help = ['', 'kah'].map(v => 'kapan' + v + ' <text>?')
handler.tags = ['kerang']
handler.customPrefix = /(\?$)/
handler.command = /^kapan(kah)?$/i

module.exports = handler

function pickRandom(list) {
	return list[Math.floor(Math.random() * list.length)]
}