const handler = m => m

const escapeRegex = value => value.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')

const matchesCommand = (m, plugin) => {
	if (!plugin || plugin.disabled || typeof plugin !== 'function' || !plugin.command) return false
	const messageText = typeof m.text === 'string' ? m.text : ''
	if (!messageText) return false

	const prefix = plugin.customPrefix ?? this.prefix ?? global.prefix
	let matchedPrefix = false
	if (prefix instanceof RegExp) {
		prefix.lastIndex = 0
		matchedPrefix = prefix.test(messageText)
	} else if (Array.isArray(prefix)) {
		matchedPrefix = prefix.some(item => {
			if (item instanceof RegExp) {
				item.lastIndex = 0
				return item.test(messageText)
			}
			return typeof item === 'string' && new RegExp(escapeRegex(item)).test(messageText)
		})
	} else if (typeof prefix === 'string' && prefix) {
		matchedPrefix = new RegExp(escapeRegex(prefix)).test(messageText)
	}
	if (!matchedPrefix) return false

	const noPrefix = messageText.replace(typeof prefix === 'string' ? escapeRegex(prefix) : /^/, '')
	const command = (noPrefix.trim().split(/\s+/)[0] || '').toLowerCase()
	if (!command) return false

	const matches = candidate => {
		if (candidate instanceof RegExp) {
			candidate.lastIndex = 0
			return candidate.test(command)
		}
		return candidate === command
	}
	return plugin.command instanceof RegExp
		? matches(plugin.command)
		: Array.isArray(plugin.command)
			? plugin.command.some(matches)
			: typeof plugin.command === 'string' && matches(plugin.command)
}

handler.all = async function (m) {
	if (m?.isBaileys || !m?.message || typeof m.text !== 'string') return

	let isCommand = false
	for (const plugin of Object.values(global.plugins || {})) {
		if (matchesCommand.call(this, m, plugin)) {
			isCommand = true
			break
		}
	}
	if (isCommand || !m.text.trim()) return

	const chat = db.data?.chats?.[m.chat]
	const user = db.data?.users?.[m.sender]
	if (!chat?.simi || chat.isBanned || user?.banned || m.fromMe) return

	try {
		const response = await axios.get(API('ghst', 'api/simsimi', { pesan: m.text }, 'key'))
		const reply = response?.data?.respSentence
		if (typeof reply === 'string' && reply.trim()) await m.reply(reply.trim())
		else await m.reply('Simi tidak menemukan jawaban saat ini.')
	} catch (error) {
		this.logger?.warn?.({ err: error, chat: m.chat }, 'SimiSimi API gagal')
		await m.reply('Simi sedang mengalami gangguan. Coba lagi nanti.')
	}
}

module.exports = handler
