const MAX_TEXT_LENGTH = 5000
const OVERSIZED_MESSAGE_STUB = 68

const handler = message => message

handler.all = async function (m) {
	if (!m || !m.key || !m.chat || m.key.fromMe) return

	const text = typeof m.text === 'string' ? m.text : ''
	const isOversized = text.length >= MAX_TEXT_LENGTH || m.messageStubType === OVERSIZED_MESSAGE_STUB
	if (!isOversized || !m.isGroup) return

	try {
		const metadata = await this.groupMetadata(m.chat)
		const botJid = this.decodeJid(this.user?.jid || this.user?.id || '')
		const botParticipant = metadata?.participants?.find(participant =>
			this.decodeJid(participant.id) === botJid
		)

		// Removing another participant's message requires the bot to be a group admin.
		if (botParticipant?.admin !== 'admin' && botParticipant?.admin !== 'superadmin') return

		await this.sendMessage(m.chat, { delete: m.key })
		this.logger?.info?.({ chat: m.chat, sender: m.sender, messageId: m.key.id }, 'Removed oversized message')
	} catch (error) {
		this.logger?.warn?.({ err: error, chat: m.chat, messageId: m.key.id }, 'Could not remove oversized message')
	}
}

module.exports = handler
