const isGroupStatus = (message, depth = 0, seen = new Set()) => {
	if (!message || typeof message !== 'object' || depth > 8 || seen.has(message)) return false
	seen.add(message)

	for (const [key, value] of Object.entries(message)) {
		if (/^groupStatusMessage(?:V2)?$/i.test(key) && value && typeof value === 'object') return true
		if (isGroupStatus(value, depth + 1, seen)) return true
	}
	return false
}

const handler = m => m

handler.before = async function (m, { isBotAdmin }) {
	if (!m?.isGroup || !m.message || m.fromMe || !isGroupStatus(m.message)) return false

	const chat = global.db?.data?.chats?.[m.chat]
	if (!chat?.antiSWGroup) return false

	if (!isBotAdmin) {
		this.logger?.warn?.({ chat: m.chat }, 'Anti-SW grup aktif tetapi bot bukan admin; Group Status tidak dapat dihapus')
		return false
	}

	const originalKey = m.key || {}
	const statusAuthor = originalKey.participant || m.participant || m.sender
	const statusId = originalKey.id || m.id
	if (!statusId || !statusAuthor) {
		this.logger?.warn?.({ chat: m.chat }, 'Anti-SW grup: data kunci Group Status tidak lengkap, batal menghapus')
		return false
	}

	try {
		const { proto, generateWAMessageFromContent } = await import('@whiskeysockets/baileys')
		const userJid = this.user?.jid || this.user?.id
		if (!userJid || !proto?.Message?.ProtocolMessage?.Type?.REVOKE) {
			throw new Error('API Baileys untuk revoke Group Status tidak tersedia')
		}

		const revoke = {
			protocolMessage: {
				key: {
					remoteJid: m.chat,
					id: statusId,
					fromMe: false,
					participant: statusAuthor,
					...(originalKey.participantAlt ? { participantAlt: originalKey.participantAlt } : {})
				},
				type: proto.Message.ProtocolMessage.Type.REVOKE
			}
		}
		const generated = generateWAMessageFromContent(m.chat, revoke, { userJid })
		await this.relayMessage(m.chat, generated.message, {
			messageId: generated.key.id,
			additionalAttributes: { edit: '8' },
			additionalNodes: [{
				tag: 'meta',
					attrs: { is_group_status: 'true', origin: 'group_status' }
				}]
		})
		this.logger?.info?.({ chat: m.chat, statusId, author: statusAuthor }, 'Group Status dihapus oleh Anti-SW grup')
	} catch (error) {
		this.logger?.error?.({ err: error, chat: m.chat, statusId }, 'Anti-SW grup gagal menghapus Group Status')
	}

	return true
}

module.exports = handler
