const handler = m => m
const WINDOW_MS = 10_000
const MAX_MESSAGES_PER_WINDOW = 10
const MAX_TRACKED_SENDERS = 2_000

const toTimestampMs = value => {
	if (typeof value === 'number' && Number.isFinite(value)) {
		// Baileys message timestamps are seconds; wall-clock values are milliseconds.
		return value < 1e12 ? value * 1000 : value
	}
	if (value && typeof value.toNumber === 'function') {
		const number = value.toNumber()
		return Number.isFinite(number) ? number * 1000 : Date.now()
	}
	return Date.now()
}

handler.all = async function (m) {
	if (!m?.message || !m.sender) return
	this.spam = this.spam && typeof this.spam === 'object' ? this.spam : Object.create(null)

	const now = toTimestampMs(m.messageTimestamp)
	let state = this.spam[m.sender]
	if (!state || now - state.windowStart >= WINDOW_MS || now < state.windowStart) {
		state = this.spam[m.sender] = { jid: m.sender, count: 0, windowStart: now }
	}

	state.count += 1
	state.lastMessageAt = now
	state.isSpamming = state.count > MAX_MESSAGES_PER_WINDOW

	// Bound the in-memory map so a long-running bot does not retain every sender forever.
	const senders = Object.keys(this.spam)
	if (senders.length > MAX_TRACKED_SENDERS) {
		for (const sender of senders) {
			if (now - (this.spam[sender]?.lastMessageAt || 0) > WINDOW_MS * 6) delete this.spam[sender]
		}
	}
}

module.exports = handler
