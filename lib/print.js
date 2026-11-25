import {
	WAMessageStubType
} from '@whiskeysockets/baileys'   // ← ganti dari @adiwajshing/baileys
import PhoneNumber from 'awesome-phonenumber'
import chalk from 'chalk'
import {
	watchFile
} from 'fs'
import db from './database.js'
import moment from 'moment-timezone'   // ← tambahan: moment belum di-import
import gradient from 'gradient-string'

// `opts` biasanya global dari helper, tapi aman kalau dideklarasikan fallback
const opts = global.opts || {}

var terminalImage = opts['img'] ? (await import('terminal-image')).default : ''
var urlRegex = (await import('url-regex-safe')).default({
	strict: false
})
moment.tz('Asia/Jakarta').locale('id');

/**
 * Get text with color
 * @param  {String} text
 * @param  {String} color
 * @return  {String} Return text with color
 */
var color = (text, color) => {
	return !color ? chalk.green(text) : color.startsWith('#') ? chalk.hex(color)(text) : chalk.keyword(color)(text);
};

/**
 * coloring background
 * @param {string} text
 * @param {string} color
 * @returns
 */
function bgColor(text, color) {
	return !color ?
		chalk.bgGreen(text) :
		color.startsWith('#') ?
		chalk.bgHex(color)(text) :
		chalk.bgKeyword(color)(text);
}

global.color = color
global.bgColor = bgColor

export default async function(m, conn = {
	user: {}
}) {
	var _name = await conn.getName(m.sender).catch(() => m.pushName || '')
	var sender = PhoneNumber('+' + m.sender.replace('@s.whatsapp.net', '')).getNumber('international') + (_name ? ' ~' + _name : '')
	var chat = await conn.getName(m.chat).catch(() => m.chat)
	var img
	try {
		if (opts['img'])
			img = /sticker|image/gi.test(m.mtype) ? await terminalImage.buffer(await m.download()) : false
	} catch (e) {
		console.error(e)
	}
	var filesize = (m.msg ?
		m.msg.vcard ?
		m.msg.vcard.length :
		m.msg.fileLength ?
		(m.msg.fileLength.low || m.msg.fileLength) :
		m.msg.axolotlSenderKeyDistributionMessage ?
		m.msg.axolotlSenderKeyDistributionMessage.length :
		m.text ?
		m.text.length :
		0 :
		m.text ? m.text.length : 0) || 0
	var user = db.data.users[m.sender]
	var me = PhoneNumber('+' + ((conn.user?.jid || conn.user?.id)?.replace('@s.whatsapp.net', '') || '')).getNumber('international')

	var stp = m.messageStubType ? WAMessageStubType[m.messageStubType] : ''
	var tipe = m.mtype ? m.mtype.replace(/message$/i, '').replace('audio', (m.msg?.ptt ? 'PTT' : 'audio')).replace(/^./, v => v.toUpperCase()) : ''
	var frm = filesize === 0 ? 0 : (filesize / 1009 ** Math.floor(Math.log(filesize) / Math.log(1000))).toFixed(1)
	var fr = ['', ...'KMGTP'][Math.floor(Math.log(filesize) / Math.log(1000))] || ''
	var t = m.messageTimestamp

	if (!m.isCommand && !m.isGroup) {
		console.log(
			bgColor(color(`[MSG]`, 'black'), '#E8FF03'),
			gradient.morning(moment(t * 1000).format('DD/MM/YY HH:mm:ss')),
			bgColor(color(stp, 'black'), '#84FF02'),
			bgColor(color(`[${frm} ${fr}B]`, 'black'), '#FAFFD1'),
			bgColor(color(`${tipe}`, 'black'), '#E8FF03'),
			` from`,
			color(sender, '#1CFF00'))
	}
	if (!m.isCommand && m.isGroup) {
		console.log(
			bgColor(color(`[MSG]`, 'black'), '#E8FF03'),
			gradient.morning(moment(t * 1000).format('DD/MM/YY HH:mm:ss')),
			bgColor(color(stp, 'black'), '#84FF02'),
			bgColor(color(`[${frm} ${fr}B]`, 'black'), '#FAFFD1'),
			bgColor(color(`${tipe}`, 'black'), '#E8FF03'),
			` from`,
			color(sender, '#1CFF00'),
			'in',
			gradient.morning(chat ? chat : m.chat))
	}
	if (m.isCommand && !m.isGroup) {
		console.log(
			bgColor(color(`[CMD]`, 'black'), '#FF7800'),
			gradient.morning(moment(t * 1000).format('DD/MM/YY HH:mm:ss')),
			bgColor(color(`[${frm} ${fr}B]`, 'black'), '#FAFFD1'),
			bgColor(color(`${tipe}`, 'black'), '#FF7800'),
			` from`,
			color(sender, '#03E7B5'))
	}
	if (m.isCommand && m.isGroup) {
		console.log(
			bgColor(color(`[CMD]`, 'black'), '#FF7800'),
			gradient.morning(moment(t * 1000).format('DD/MM/YY HH:mm:ss')),
			bgColor(color(`[${frm} ${fr}B]`, 'black'), '#FAFFD1'),
			bgColor(color(`${tipe}`, 'black'), '#FF7800'),
			` from`,
			color(sender, '#03E7B5'),
			'in',
			gradient.morning(chat ? chat : m.chat))
	}
	if (img) console.log(img.trimEnd())
	if (typeof m.text === 'string' && m.text) {
		var log = m.text.replace(/\u200e+/g, '')
		var mdRegex = /(?<=(?:^|[\s\n])\S?)(?:([*_~])(.+?)\1|```((?:.||[\n\r])+?)```)(?=\S?(?:[\s\n]|$))/g
		var mdFormat = (depth = 4) => (_, type, text, monospace) => {
			var types = {
				_: 'italic',
				'*': 'bold',
				'~': 'strikethrough'
			}
			text = text || monospace
			var formatted = !types[type] || depth < 1 ? text : chalk[types[type]](text.replace(mdRegex, mdFormat(depth - 1)))
			return formatted
		}
		if (log.length < 4096)
			log = log.replace(urlRegex, (url, i, text) => {
				var end = url.length + i
				return i === 0 || end === text.length || (/^\s$/.test(text[end]) && /^\s$/.test(text[i - 1])) ? chalk.blueBright(url) : url
			})
		log = log.replace(mdRegex, mdFormat(4))
		if (m.mentionedJid)
			for (var user of m.mentionedJid) log = log.replace('@' + user.split`@` [0], chalk.blueBright('@' + await conn.getName(user)))
		console.log(m.error != null ? gradient(['#FF0104', '#FFA002'])(log) : m.isCommand ? color(log, '#FBFF00') : color(log, '#FEFFED'))
	}
	if (Array.isArray(m.messageStubParameters) && m.messageStubParameters.length) {
		console.log(m.messageStubParameters.map(jid => {
			jid = conn.decodeJid ? conn.decodeJid(jid) : jid
			var name = conn.getName(jid)
			return chalk.gray(PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international') + (name ? ' ~' + name : ''))
		}).join(', '))
	}
	if (/document/i.test(m.mtype)) console.log(`📄 ${m.msg.fileName || m.msg.displayName || 'Document'}`)
	else if (/ContactsArray/i.test(m.mtype)) console.log(`👨‍👩‍👧‍👦 ${' ' || ''}`)
	else if (/contact/i.test(m.mtype)) console.log(`👨 ${m.msg.displayName || ''}`)
	else if (/audio/i.test(m.mtype)) {
		var duration = m.msg.seconds
		console.log(`${m.msg.ptt ? '🎤 (PTT ' : '🎵 ('}AUDIO) ${Math.floor(duration / 60).toString().padStart(2, 0)}:${(duration % 60).toString().padStart(2, 0)}`)
	}

	console.log()
}

var file = __filename(
	import.meta.url)
watchFile(file, () => {
	console.log(chalk.redBright("Update 'lib/print.js'"))
})
