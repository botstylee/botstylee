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

	// ✅ Ambil daftar chat yang valid
	var chats = Object.entries(global.store.chats)
		.filter(([_, chat]) => chat?.isChats)
		.map(v => v[0])

	if (!chats.length) {
		return conn.reply(m.chat, 'Tidak ada chat untuk di-broadcast.', m)
	}

	// ✅ Tentukan sumber pesan
	var cc = conn.serializeM(text ? m : m.quoted ? await m.getQuotedObj() : false || m)
	var teks = text ? text : cc.text

	if (!teks) {
		return conn.reply(m.chat, `Masukkan teks atau reply pesan.\nContoh: *${usedPrefix}${command} halo semua*`, m)
	}

	await conn.reply(m.chat, `_Mengirim pesan broadcast ke ${chats.length} chat..._`, m)

	// ✅ Siapkan pesan yang akan di-broadcast
	var broadcastText = /bc|broadcast/i.test(teks) ? teks : teks + '\n' + readMore + '「 ' + (global.author || 'Bot') + ' All Chat Broadcast 」'

	// ✅ Modifikasi pesan dengan teks broadcast
	var cMod = conn.cMod(m.chat, cc, broadcastText)

	// ✅ Kirim ke semua chat dengan error handling per chat
	var success = 0
	var failed = 0
	for (var id of chats) {
		try {
			await conn.copyNForward(id, cMod, true)
			success++
		} catch (e) {
			console.error('[broadcast] Gagal kirim ke', id, ':', e.message)
			failed++
		}
	}

	await conn.reply(m.chat, `✅ *Broadcast selesai.*\n\n• Berhasil: ${success}\n• Gagal: ${failed}`, m)
}

handler.help = ['broadcast', 'bc'].map(v => v + ' <teks>')
handler.tags = ['owner']
handler.command = /^(broadcast|bc)$/i
handler.owner = true

module.exports = handler

var more = String.fromCharCode(8206)
var readMore = more.repeat(4001)

var randomID = length => randomBytes(Math.ceil(length * .5)).toString('hex').slice(0, length)
