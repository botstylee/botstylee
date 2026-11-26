var handler = async (m, {
	conn,
	text,
	usedPrefix,
	command
}) => {
	// ✅ Ambil emoji dengan benar (bisa multi-codepoint)
	var emoji = (text || '').trim()

	// ✅ Validasi: minimal ada 1 karakter, dan itu benar-benar emoji
	if (!emoji) {
		return conn.reply(m.chat, `Masukkan emoji.\nContoh: *${usedPrefix}${command} 😀* (reply pesan)`, m)
	}

	// ✅ Cek apakah string benar-benar emoji (bukan teks biasa)
	// Regex ini menangkap emoji Unicode, termasuk surrogate pair, skin tone, ZWJ
	var emojiRegex = /^(?:\p{Emoji_Presentation}|\p{Emoji}\uFE0F)(?:\u200D(?:\p{Emoji_Presentation}|\p{Emoji}\uFE0F))*$/u
	if (!emojiRegex.test(emoji)) {
		return conn.reply(m.chat, `Itu bukan emoji.\nContoh: *${usedPrefix}${command} 😀* (reply pesan)`, m)
	}

	// ✅ Batasi panjang maksimal (untuk mencegah spam emoji panjang)
	if ([...emoji].length > 3) {
		return conn.reply(m.chat, 'Maksimal 3 emoji.', m)
	}

	// ✅ Tentukan target react
	var targetKey
	if (m.quoted) {
		targetKey = m.quoted.vM?.key || m.quoted.key
	} else {
		targetKey = m.key
	}

	if (!targetKey) {
		return conn.reply(m.chat, 'Tidak bisa menemukan pesan target untuk di-react.', m)
	}

	try {
		await conn.sendMessage(m.chat, {
			react: {
				text: emoji,
				key: targetKey
			}
		})
	} catch (e) {
		console.error('[react] Error:', e)
		await conn.reply(m.chat, 'Gagal menambahkan reaksi: ' + (e.message || e), m)
	}
}

handler.help = ['react *reply emo*']
handler.tags = ['tools']
handler.command = /^react$/i

module.exports = handler
