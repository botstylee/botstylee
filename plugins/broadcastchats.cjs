var { randomBytes } = require('crypto')

var handler = async (m, {
	conn,
	text,
	usedPrefix,
	command
}) => {
	// ✅ Pastikan store tersedia
	if (!global.store || !global.store.chats) {
		return conn.reply(m.chat, 'Store belum siap, coba lagi nanti.', m)
	}

	// ✅ Ambil chat pribadi (bukan grup)
	var chats = Object.entries(global.store.chats)
		.filter(([jid, chat]) => !jid.endsWith('@g.us') && chat?.isChats)
		.map(v => v[0])

	if (!chats.length) {
		return conn.reply(m.chat, 'Tidak ada chat pribadi untuk di-broadcast.', m)
	}

	// ✅ Tentukan sumber pesan
	var cc = conn.serializeM(text ? m : m.quoted ? await m.getQuotedObj() : false || m)
	var teks = text ? text : cc.text

	if (!teks) {
		return conn.reply(m.chat, `Masukkan teks atau reply pesan.\nContoh: *${usedPrefix}${command} halo*`, m)
	}

	await conn.reply(m.chat, `_Mengirim pesan broadcast ke ${chats.length} chat pribadi..._`, m)

	// ✅ Siapkan teks broadcast
	var broadcastText = /bc|broadcast/i.test(teks)
		? teks
		: teks + '\n' + readMore + '「 ' + (global.author || 'Bot') + ' All Chat Broadcast 」'

	// ✅ Modifikasi pesan sekali saja
	var cMod = conn.cMod(m.chat, cc, broadcastText)

	// ✅ Kirim dengan hitungan berhasil/gagal
	var success = 0
	var failed = 0
	for (var id of chats) {
		try {
			await conn.copyNForward(id, cMod, true)
			success++
		} catch (e) {
			console.error('[bcchats] Gagal kirim ke', id, ':', e.message)
			failed++
		}
	}

	await conn.reply(m.chat, `✅ *Broadcast selesai.*\n\n• Berhasil: ${success}\n• Gagal: ${failed}`, m)
}

handler.help = ['broadcastchats', 'bcchats'].map(v => v + ' <teks>')
handler.tags = ['owner']
handler.command = /^(broadcastchats?|bcc(hats?)?)$/i
handler.owner = true

module.exports = handler

var more = String.fromCharCode(8206)
var readMore = more.repeat(4001)
