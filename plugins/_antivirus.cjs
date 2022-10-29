var handler = m => m

handler.all = async function (m) {
	// auto clear ketika terdapat pesan yang tidak dapat dilihat di wa desktop
	if (m.text.length >= 5000 || m.messageStubType === 68) {
		var log = {
			key: m.key,
			content: m.msg,
			sender: m.sender
		}
		await conn.chatModify({
			clear: {
				messages: [{
					id: m.key,
					fromMe: true
				}]
			}
		}, m.chat).catch(console.log)
	}
}

module.exports = handler
