var {
	randomBytes
} = require('crypto');

var handler = async (m, {
	conn,
	text
}) => {
	var chats = Object.entries(store.chats).filter(([jid, chat]) => !jid.endsWith('@g.us') && chat.isChats).map(v => v[0])
	var cc = conn.serializeM(text ? m : m.quoted ? await m.getQuotedObj() : false || m)
	var teks = text ? text : cc.text
	conn.reply(m.chat, `_Mengirim pesan broadcast ke ${chats.length} chat_`, m)
	for (var id of chats) await conn.copyNForward(id, conn.cMod(m.chat, cc, /bc|broadcast/i.test(teks) ? teks : teks + '\n' + readMore + '「 ' + author + ' All Chat Broadcast 」\n' + randomID(32)), true).catch(_ => _)
	m.reply('Selesai Broadcast All Chat :)')
}
handler.help = ['broadcastchats', 'bcchats'].map(v => v + ' <teks>')
handler.tags = ['owner']
handler.command = /^(broadcastchats?|bcc(hats?)?)$/i

handler.owner = true

module.exports = handler

var more = String.fromCharCode(8206)
var readMore = more.repeat(4001)

var randomID = length => randomBytes(Math.ceil(length * .5)).toString('hex').slice(0, length)