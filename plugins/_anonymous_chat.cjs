var handler = m => m

handler.before = async function (m, { conn }) {
	// ✅ Hanya untuk chat pribadi
	if (!m.chat.endsWith('@s.whatsapp.net')) return true

	this.anonymous = this.anonymous ? this.anonymous : {}

	// ✅ Cari room anonymous yang aktif
	var room = Object.values(this.anonymous).find(room =>
		room &&
		[room.a, room.b].includes(m.sender) &&
		room.state === 'CHATTING'
	)

	if (!room) return true

	// ✅ Ambil teks dengan aman
	var text = (m.text || '').toLowerCase().trim()

	// ✅ Cek command anonymous chat (harus di awal pesan, dengan prefix)
	// Ganti '.' dengan global.prefix kalau prefix bot kamu berbeda
	var prefix = global.prefix || '.'
	var cmdRegex = new RegExp(`^${prefix}(next|leave|start|skip)$`, 'i')
	if (cmdRegex.test(text)) return true

	// ✅ Cari lawan chat
	var other = [room.a, room.b].find(user => user !== m.sender)
	if (!other) return true

	try {
		// ✅ Forward pesan ke lawan chat
		// copyNForward signature: (jid, message, forwardingScore, options)
		var options = {}
		if (m.quoted && m.quoted.fromMe) {
			options = {
				contextInfo: {
					...(m.msg?.contextInfo || {}),
					forwardingScore: 1,
					isForwarded: true,
					participant: other
				}
			}
		}

		await this.copyNForward(other, m, true, options)
	} catch (e) {
		console.error('[anonymous-chat] Error forward:', e)
	}

	return true
}

module.exports = handler
