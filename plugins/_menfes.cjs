var handler = m => m

handler.before = async function(m, {
	match
}) {
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
	// if (match) return !1
	if (!m.chat.endsWith('@s.whatsapp.net'))
		return !0
	var room = Object.values(db.data.menfes).find(id => [id.to, id.id].includes(m.sender))
	if (room && !isIdMessage && room.chatting == true && m.text) {
		var other = [room.to, room.id].find(user => user !== m.sender)
		/*if (m.quoted) {
			var q = await m.getQuotedObj()
			if (!q) return
			await m.copyNForward(other, true)
		} else {*/
		m.copyNForward(other, true)
		//}
	}
	return !0
}

module.exports = handler
