import { WAMessageStubType } from '@whiskeysockets/baileys'
import PhoneNumber from 'awesome-phonenumber'
import chalk from 'chalk'
import { watchFile } from 'fs'
import gradient from 'gradient-string'
import moment from 'moment-timezone'
import db from './database.js'
import Helper from './helper.js'

var opts = Helper.opts
var terminalImage = opts['img'] ? (await import('terminal-image')).default : ''
var urlRegex = (await import('url-regex-safe')).default({
	strict: false
})

moment.locale('id')

/**
 * Get text with color.
 * @param {string} text
 * @param {string} color
 * @returns {string}
 */
var color = (text, color) => {
	return !color
		? chalk.green(text)
		: color.startsWith('#')
			? chalk.hex(color)(text)
			: chalk.keyword(color)(text)
}

/**
 * Color the background.
 * @param {string} text
 * @param {string} color
 * @returns {string}
 */
function bgColor(text, color) {
	return !color
		? chalk.bgGreen(text)
		: color.startsWith('#')
			? chalk.bgHex(color)(text)
			: chalk.bgKeyword(color)(text)
}

global.color = color
global.bgColor = bgColor

export default async function printMessage(m, conn = { user: {} }) {
	if (!m) return

	var senderName = await conn.getName(m.sender).catch(() => '')
	var phoneNumber = (m.sender || '').replace(/@s\.whatsapp\.net$/, '')
	var senderNumber = phoneNumber
		? PhoneNumber('+' + phoneNumber).getNumber('international') || phoneNumber
		: ''
	var sender = senderNumber + (senderName ? ` ~${senderName}` : '')
	var chatName = await conn.getName(m.chat).catch(() => '')

	var img = false
	try {
		if (opts['img'] && /sticker|image/i.test(m.mtype)) {
			img = await terminalImage.buffer(await m.download())
		}
	} catch (error) {
		console.error(error)
	}

	var rawFileSize =
		m.msg?.vcard?.length ??
		m.msg?.fileLength?.low ??
		m.msg?.fileLength ??
		m.msg?.axolotlSenderKeyDistributionMessage?.length ??
		m.text?.length ??
		0

	var filesize = Number(rawFileSize) || 0
	var stubType = m.messageStubType
		? WAMessageStubType[m.messageStubType]
		: ''

	var messageType = m.mtype
		? m.mtype
			.replace(/message$/i, '')
			.replace('audio', m.msg?.ptt ? 'PTT' : 'audio')
			.replace(/^./, char => char.toUpperCase())
		: ''

	var sizeUnitIndex = filesize > 0
		? Math.floor(Math.log(filesize) / Math.log(1000))
		: 0
	var formattedSize = filesize === 0
		? 0
		: (filesize / 1000 ** sizeUnitIndex).toFixed(1)
	var sizeUnit = ['', ...'KMGTP'][sizeUnitIndex] || ''

	var rawTimestamp = m.messageTimestamp
	var timestamp = Number(
		typeof rawTimestamp === 'object' && rawTimestamp !== null
			? rawTimestamp.low
			: rawTimestamp
	)
	var date = Number.isFinite(timestamp)
		? moment.unix(timestamp).tz('Asia/Jakarta').format('DD/MM/YY HH:mm:ss')
		: moment().tz('Asia/Jakarta').format('DD/MM/YY HH:mm:ss')

	var isGroup = Boolean(m.isGroup)
	var isCommand = Boolean(m.isCommand)
	var label = isCommand ? '[CMD]' : '[MSG]'
	var labelColor = isCommand ? '#FF7800' : '#E8FF03'

	console.log(
		bgColor(color(label, 'black'), labelColor),
		gradient.morning(date),
		...(!isCommand ? [bgColor(color(stubType, 'black'), '#84FF02')] : []),
		bgColor(color(`[${formattedSize} ${sizeUnit}B]`, 'black'), '#FAFFD1'),
		bgColor(color(messageType, 'black'), labelColor),
		'from',
		color(sender, isCommand ? '#03E7B5' : '#1CFF00'),
		...(isGroup ? ['in', gradient.morning(chatName || m.chat)] : [])
	)

	if (img) console.log(img.trimEnd())

	if (typeof m.text === 'string' && m.text) {
		var text = m.text.replace(/\u200e+/g, '')
		var markdownRegex = /(?<=(?:^|[\s\n])\S?)(?:([*_~])(.+?)\1|```((?:.||[\n\r])+?)```)(?=\S?(?:[\s\n]|$))/g

		var formatMarkdown = (depth = 4) => (_, type, formattedText, monospace) => {
			var types = {
				_: 'italic',
				'*': 'bold',
				'~': 'strikethrough'
			}
			var content = formattedText || monospace
			return !types[type] || depth < 1
				? content
				: chalk[types[type]](
					content.replace(markdownRegex, formatMarkdown(depth - 1))
				)
		}

		if (text.length < 4096) {
			text = text.replace(urlRegex, (url, index, originalText) => {
				var end = url.length + index
				var isWholeUrl =
					index === 0 ||
					end === originalText.length ||
					(/^\s$/.test(originalText[end]) &&
						/^\s$/.test(originalText[index - 1]))

				return isWholeUrl ? chalk.blueBright(url) : url
			})
		}

		text = text.replace(markdownRegex, formatMarkdown(4))

		for (var jid of m.mentionedJid || []) {
			var mentionedNumber = jid.split('@')[0]
			var mentionedName = await conn.getName(jid).catch(() => mentionedNumber)
			text = text.replace(
				'@' + mentionedNumber,
				chalk.blueBright('@' + mentionedName)
			)
		}

		console.log(
			m.error != null
				? gradient(['#FF0104', '#FFA002'])(text)
				: isCommand
					? color(text, '#FBFF00')
					: color(text, '#FEFFED')
		)
	}

	if (m.messageStubParameters?.length) {
		var names = await Promise.all(m.messageStubParameters.map(async jid => {
			var decodedJid = conn.decodeJid(jid)
			var name = await conn.getName(decodedJid).catch(() => '')
			var number = decodedJid.replace(/@s\.whatsapp\.net$/, '')
			var formattedNumber = number
				? PhoneNumber('+' + number).getNumber('international') || number
				: decodedJid

			return chalk.gray(formattedNumber + (name ? ` ~${name}` : ''))
		}))

		console.log(names.join(', '))
	}

	if (/document/i.test(m.mtype)) {
		console.log(`📄 ${m.msg?.fileName || m.msg?.displayName || 'Document'}`)
	} else if (/contactsArray/i.test(m.mtype)) {
		console.log('👨‍👩‍👧‍👦 Contacts')
	} else if (/contact/i.test(m.mtype)) {
		console.log(`👨 ${m.msg?.displayName || ''}`)
	} else if (/audio/i.test(m.mtype)) {
		var duration = Number(m.msg?.seconds) || 0
		var minutes = Math.floor(duration / 60)
		var seconds = duration % 60
		var audioLabel = m.msg?.ptt ? '🎤 (PTT AUDIO)' : '🎵 (AUDIO)'

		console.log(
			`${audioLabel} ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
		)
	}

	console.log()
}

var file = Helper.__filename(import.meta.url, true)
watchFile(file, () => {
	console.log(chalk.redBright("Update 'lib/print.js'"))
})
