// Defensive mitigation for oversized or malformed messages. This is not a guarantee
// against every WhatsApp bug or exploit; keep Baileys and Node dependencies updated.
var handler = m => m
var warned = new Map()
var MAX_TEXT_LENGTH = 8000
var WARNING_COOLDOWN = 15000
var INVISIBLE_OR_CONTROL = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F\u200B-\u200F\u202A-\u202E\u2060-\u206F\uFEFF]/g

handler.all = async function(m) {
	if (!m || typeof m !== 'object') return

	var message = m.message || {}
	var stubType = m.messageStubType ?? message.messageStubType
	var stubName = typeof stubType === 'string' ? stubType.toUpperCase() : ''
	var oversizedStub = stubType === 68 || stubName === 'OVERSIZED'
	var text = typeof m.text === 'string' ? m.text : ''
	var cleanedText = text.replace(INVISIBLE_OR_CONTROL, '')
	var tooLong = text.length > MAX_TEXT_LENGTH
	var mostlyInvisible = text.length >= 256 && cleanedText.length < text.length * 0.1
	var repeatedPayload = /(.)\1{2047,}/su.test(text)
	if (!oversizedStub && !tooLong && !mostlyInvisible && !repeatedPayload) return

	// Auto-clear from the bot's processing path: normalize the message so no plugin
	// can interpret it as a command or consume the suspicious text.
	m.antivirusBlocked = true
	m.isCommand = false
	m.text = ''
	m.message = {}
	if (m.msg && typeof m.msg === 'object') m.msg = {}

	var chat = m.chat || m.key?.remoteJid
	var key = m.key
	if (!chat || !key || key.fromMe || chat === 'status@broadcast') return

	// WhatsApp permits deleting another participant's message only in groups when
	// the bot has the required admin rights. Never clear/delete an entire chat.
	var deleted = false
	if (chat.endsWith('@g.us') && typeof this.sendMessage === 'function') {
		try {
			await this.sendMessage(chat, { delete: key })
			deleted = true
		} catch (error) {
			console.warn('[antivirus] could not delete suspicious group message:', error?.message || error)
		}
	}

	var now = Date.now()
	if (now - (warned.get(chat) || 0) < WARNING_COOLDOWN) return
	warned.set(chat, now)
	var notice = deleted
		? 'Pesan abnormal terdeteksi, dibersihkan dari pemrosesan bot, dan dihapus dari grup.'
		: chat.endsWith('@g.us')
			? 'Pesan abnormal terdeteksi dan dibersihkan dari pemrosesan bot. Bot tidak bisa menghapusnya; pastikan bot admin.'
			: 'Pesan abnormal terdeteksi dan dibersihkan dari pemrosesan bot. Penghapusan otomatis hanya dicoba di grup.'
	try {
		if (typeof this.reply === 'function') await this.reply(chat, notice, m)
		else if (typeof this.sendMessage === 'function') await this.sendMessage(chat, { text: notice })
	} catch (error) {
		console.warn('[antivirus] failed to send warning:', error?.message || error)
	}

	if (warned.size > 1000) {
		for (var [id, timestamp] of warned) {
			if (now - timestamp > WARNING_COOLDOWN * 4) warned.delete(id)
			if (warned.size <= 750) break
		}
	}
}

module.exports = handler
