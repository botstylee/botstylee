async function handler(m) {
	if (!m.quoted) throw 'reply pesan!'
	try {
		var q = this.serializeM(await (this.serializeM(await m.getQuotedObj())).getQuotedObj())
		if (!q) throw 'pesan yang anda reply tidak mengandung reply!'
		await q.copyNForward(m.chat, true)
	} catch (e) {
		throw 'pesan yang anda reply tidak mengandung reply!'
	}
}
handler.command = /^q$/i
module.exports = handler