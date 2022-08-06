var handler = m => m
handler.all = async function(m) {
	if (m.isBaileys)
		return
	if (!m.message)
		return
	var isIdMessage = false,
		usedPrefix
	for (var name in global.plugins) {
		var plugin = global.plugins[name]
		if (!plugin)
			continue
		if (plugin.disabled)
			continue
		if (typeof plugin !== 'function')
			continue
		if (!plugin.command)
			continue
		var str2Regex = str => str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
		var _prefix = plugin.customPrefix ? plugin.customPrefix : this.prefix ? this.prefix : global.prefix
		var match = (_prefix instanceof RegExp ? // RegExp Mode?
			[
				[_prefix.exec(m.text), _prefix]
			] :
			Array.isArray(_prefix) ? // Array?
			_prefix.map(p => {
				var re = p instanceof RegExp ? // RegExp in Array?
					p :
					new RegExp(str2Regex(p))
				return [re.exec(m.text), re]
			}) :
			typeof _prefix === 'string' ? // String?
			[
				[new RegExp(str2Regex(_prefix)).exec(m.text), new RegExp(str2Regex(_prefix))]
			] : [
				[
					[], new RegExp
				]
			]
		).find(p => p[1])
		if ((usedPrefix = (match[0] || '')[0])) {
			var noPrefix = m.text.replace(usedPrefix, '')
			var [command] = noPrefix.trim().split` `.filter(v => v)
			command = (command || '').toLowerCase()
			var isId = plugin.command instanceof RegExp ? // RegExp Mode?
				plugin.command.test(command) :
				Array.isArray(plugin.command) ? // Array?
				plugin.command.some(cmd => cmd instanceof RegExp ? // RegExp in Array?
					cmd.test(command) :
					cmd === command
				) :
				typeof plugin.command === 'string' ? // String?
				plugin.command === command :
				false
			if (!isId)
				continue
			isIdMessage = true
		}
	}

	var chat = db.data.chats[m.chat]
	var user = db.data.users[m.sender]
	var serror = "simi error :("
	if (chat.simi && !chat.isBanned && !user.banned && !m.fromMe && !isIdMessage && m.text) {
		try {
			a = (await axios.get(API('ghst', 'api/simsimi', {
				pesan: m.text
			}, 'key'))).data
			log(a.count)
			var respon = a.respSentence.trim()
			m.reply(`${respon}`)
		} catch (e) {
			if (e.response) {
				log(e.response.data)
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