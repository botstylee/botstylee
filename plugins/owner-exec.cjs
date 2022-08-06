var syntaxerror = require('syntax-error')
var util = require('util')

var handler = async (m, _2) => {
	var {
		conn,
		usedPrefix,
		command,
		text,
		noPrefix,
		args,
		groupMetadata
	} = _2
	var _return
	var _syntax = ''
	var _text = (/^=/.test(usedPrefix) ? 'return ' : '') + noPrefix
	var old = m.exp * 1
	try {
		var i = 15
		var f = {
			exports: {}
		}
		var exec = new(async () => {}).constructor('print', 'm', 'handler', 'require', 'conn', 'Array', 'process', 'args', 'groupMetadata', 'module', 'exports', 'argument', _text)
		_return = await exec.call(conn, (...args) => {
			if (--i < 1) return
			console.log(...args)
			return conn.reply(m.chat, util.format(...args), m)
		}, m, handler, require, conn, CustomArray, process, args, groupMetadata, f, f.exports, [conn, _2])
	} catch (e) {
		var err = await syntaxerror(_text, 'Execution Function', {
			allowReturnOutsideFunction: true,
			allowAwaitOutsideFunction: true
		})
		if (err) _syntax = '```' + err + '```\n\n'
		_return = e
	} finally {
		//conn.reply(m.sender, _syntax + util.format(_return), m)
		conn.reply(m.sender, _syntax + util.format(_return), m)
		m.exp = old
	}
}
handler.help = ['> ', '=> ']
handler.tags = ['advanced']
handler.customPrefix = /^=?> /
handler.command = /(?:)/i
handler.owner = true

module.exports = handler

class CustomArray extends Array {
	constructor(...args) {
		if (typeof args[0] == 'number') return super(Math.min(args[0], 10000))
		else return super(...args)
	}
}