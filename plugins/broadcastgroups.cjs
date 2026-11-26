var { randomBytes } = require('crypto')

var handler = async (m, {
	conn,
	text,
	usedPrefix,
	command
}) => {
	try {
		// ✅ Ambil semua grup yang bot ikuti
		var allGroups = Object.values(await conn.groupFetchAllParticipating())

		// ✅ Filter: bot ada di grup dan grup tidak di-announce
		var groups = allGroups.filter(v =>
			v?.participants?.find(p => p.id === conn.user?.jid) && v.announce === false
		)

		if (!groups.length) {
			return conn.reply(m.chat, 'Tidak ada grup yang memenuhi syarat untuk broadcast.', m)
		}

		// ✅ Tentukan sumber pesan
		var cc = text ? m : m.quoted ? await m.getQuotedObj() : m
		var teks = text ? text : cc.text

		if (!teks) {
			return conn.reply(m.chat, `Masukkan teks atau reply pesan.\nContoh: *${usedPrefix}${command} halo semua*`, m)
		}

		await conn.reply(m.chat, `_Mengirim pesan broadcast ke ${groups.length} grup..._`, m)

		// ✅ Siapkan teks broadcast
		var broadcastText = /bc|broadcast/i.test(teks)
			? teks
			: teks + '\n' + readMore + '「 ' + (global.author || 'Bot') + ' Broadcast 」'

		// ✅ Modifikasi pesan sekali saja
		var cMod = conn.cMod(m.chat, cc, broadcastText)

		// ✅ Kirim dengan delay & hitungan
		var success = 0
		var failed = 0
		for (var group of groups) {
			try {
				await new Promise(r => setTimeout(r, 3000)) // ✅ delay 3 detik
				await conn.copyNForward(group.id, cMod, true)
				success++
			} catch (e) {
				console.error('[bcgc] Gagal kirim ke', group.id, ':', e.message)
				failed++
			}
		}

		await conn.reply(m.chat, `✅ *Broadcast selesai.*\n\n• Berhasil: ${success}\n• Gagal: ${failed}`, m)

	} catch (e) {
		console.error('[bcgc] Error:', e)
		await conn.reply(m.chat, 'Terjadi kesalahan: ' + (e.message || e), m)
	}
}

handler.help = ['broadcastgroup', 'bcgc'].map(v => v + ' <teks>')
handler.tags = ['owner']
handler.command = /^(broadcast|bc)(group|grup|gc)$/i
handler.owner = true

module.exports = handler

var more = String.fromCharCode(8206)
var readMore = more.repeat(4001)
