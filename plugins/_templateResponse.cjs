var {
	proto,
	generateWAMessage,
	areJidsSameUser
} = require('@adiwajshing/baileys')
//var plugins = import('../lib/plugins.js').then(async({plugins}) { return new Promise(async(resolve,reject)=>{resolve(plugins)})})
var handler = m => m
handler.all = async function(m, chatUpdate) {
//console.log(plugins)
	if (m.isBaileys)
		return
	if (!m.message)
		return
	if (!(m.message.buttonsResponseMessage || m.message.templateButtonReplyMessage || m.message.listResponseMessage))
		return
	var id = m.message.buttonsResponseMessage?.selectedButtonId || m.message.templateButtonReplyMessage?.selectedId || m.message.listResponseMessage?.singleSelectReply?.selectedRowId
	var text = m.message.buttonsResponseMessage?.selectedDisplayText || m.message.templateButtonReplyMessage?.selectedDisplayText || m.message.listResponseMessage?.title
	var isIdMessage = false,
		usedPrefix
	for (var name in global.plugins) {
		var plugin = global.plugins[name]
		if (!plugin)
			continue
		if (plugin.disabled)
			continue
		if (!opts['restrict'])
			if (plugin.tags && plugin.tags.includes('admin'))
				continue
		if (typeof plugin !== 'function')
			continue
		if (!plugin.command)
			continue
		var str2Regex = str => str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
		var _prefix = plugin.customPrefix ? plugin.customPrefix : this.prefix ? this.prefix : global.prefix
		var match = (_prefix instanceof RegExp ? // RegExp Mode?
			[
				[_prefix.exec(id), _prefix]
			] :
			Array.isArray(_prefix) ? // Array?
			_prefix.map(p => {
				var re = p instanceof RegExp ? // RegExp in Array?
					p :
					new RegExp(str2Regex(p))
				return [re.exec(id), re]
			}) :
			typeof _prefix === 'string' ? // String?
			[
				[new RegExp(str2Regex(_prefix)).exec(id), new RegExp(str2Regex(_prefix))]
			] : [
				[
					[], new RegExp
				]
			]
		).find(p => p[1])
		if ((usedPrefix = (match[0] || '')[0])) {
			var noPrefix = id.replace(usedPrefix, '')
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
	if (isIdMessage == true) {
	var messages = await generateWAMessage(m.chat, {
		text: id,
		mentions: m.mentionedJid
	}, {
		userJid: this.user.id,
		quoted: null
	})
	messages.key.fromMe = areJidsSameUser(m.sender, this.user.id)
	messages.key.id = m.key.id
	messages.pushName = m.name
	if (m.isGroup)
		messages.key.participant = messages.participant = m.sender
	var msg = {
		...chatUpdate,
		messages: [proto.WebMessageInfo.fromObject(messages)].map(v => (v.conn = this, v)),
		type: 'append'
	}
	this.ev.emit('messages.upsert', msg)
	}
}

module.exports = handler
