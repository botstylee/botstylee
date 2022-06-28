let handler = m => m
handler.all = async function(m) {
	log(m)
	let chat = db.data.chats[m.chat]
	let user = db.data.users[m.sender]
	var serror = "simi error :("
	if (chat.simi && !chat.isBanned && !user.banned && !m.isBaileys && !m.fromMe && !m.isCommand && m.text) {
		try {
			a = (await axios.get(API('ghst', 'api/simsimi', {
				pesan: m.text
			}, 'key'))).data
			log(a.count)
			var respon = a.respSentence.trim()
			m.reply(`_${respon}_`)
		} catch (e) {
			if (e.response) {
				log(e.response.statusText)
				m.reply(serror)
			} else {
				log(e)
				m.reply(serror)
			}
		}
		return !0
	}
	return true
}
module.exports = handler
