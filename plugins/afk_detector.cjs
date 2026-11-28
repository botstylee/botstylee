var before = async (m, { conn }) => {
	try {
		var db = global.db || require('../lib/database.js').default
		if (!db?.data?.users) return true

		var afk = [...new Set([
			...(m.mentionedJid || []),
			...(m.quoted ? [m.quoted.sender] : [])
		])]

		for (var jid of afk) {
			var is_user = db.data.users[jid]
			if (!is_user) continue

			var afkTime = is_user.afk
			if (!afkTime || afkTime < 0) continue

			var reason = is_user.afkReason || ''
			var duration = (Date.now() - afkTime).toTimeString()

			if (!m.fromMe) {
				await conn.reply(m.chat, `*Away From Keyboard* : @${jid.split('@')[0]}\n• *Reason* : ${reason || '-'}\n• *During* : [ ${duration} ]`, m, {
					mentions: [jid]
				})

				try {
					var groupName = m.isGroup
						? (await conn.groupMetadata(m.chat)).subject
						: 'Private Chat'

					await conn.reply(jid, `Someone from *${groupName}* tagged or mentioned you.\n\n• *Sender* : @${m.sender.split('@')[0]}`, m, {
						mentions: [m.sender]
					})

					await conn.copyNForward(jid, m, true)
				} catch (e) {
					console.error('[afk] Gagal kirim notifikasi ke', jid, ':', e.message)
				}
			}
		}
	} catch (e) {
		console.error('[afk] Error:', e)
		try {
			var owner = global.nomorown || (global.owner?.[0]?.[0])
			if (owner) {
				await conn.reply(owner + '@s.whatsapp.net', 'AFK handler error: ' + e.message, m)
			}
		} catch {}
	}
	return true
}

module.exports = { before }
