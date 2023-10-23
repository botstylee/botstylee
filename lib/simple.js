// TODO: Make this file more redeable

import path from 'path'
import {
	toAudio
} from './converter.js'
import fetch, {
	Response
} from 'node-fetch'
import PhoneNumber from 'awesome-phonenumber'
import fs from 'fs'
import util from 'util'
import {
	fileURLToPath
} from 'url'
import Connection from './connection.js'
import {
	Readable
} from 'stream'
import Helper from './helper.js'
import {
	fileTypeFromBuffer,
	fileTypeStream
} from 'file-type'
import Jimp from 'jimp'
var __dirname = path.dirname(fileURLToPath(
	import.meta.url))

/** @type {typeof import('@adiwajshing/baileys')} */ // @ts-ignore
var {
	proto,
	downloadContentFromMessage,
	jidDecode,
	areJidsSameUser,
	generateForwardMessageContent,
	generateWAMessageFromContent,
	generateWAMessageContent,
	extractMessageContent,
	getContentType,
	toReadable
} = (await import('@adiwajshing/baileys')).default
var {
	getExtension
} = (await import('mime')).default
/** 
 * @param {import('./connection').Socket} conn 
 * @param {{
 *	store: typeof import('./connection')['default']['store']
 *	logger: import('./connection.js').Logger
 * }} options
 */
export function HelperConnection(conn, {
	store,
	logger
}) {
	var botUser = conn.user || {}

	/** @type {import('@adiwajshing/baileys').WASocket} */
	var sock = Object.defineProperties(conn, {
		decodeJid: {
			value(jid) {
				if (!jid || typeof jid !== 'string') return (!nullish(jid) && jid) || null
				// @ts-ignore
				return jid?.decodeJid?.()
			}
		},
		logger: {
			value: {
				...logger,
				info: logger.info?.bind(logger),
				error: logger.error?.bind(logger),
				warn: logger.warn?.bind(logger),
				fatal: logger.fatal?.bind(logger),
				debug: logger.debug?.bind(logger),
				trace: logger.trace?.bind(logger)
			},
			enumerable: true,
			writable: true,
		},
		getFile: {
			/**
			 * getBuffer hehe
			 * @param {fs.PathLike} PATH 
			 * @param {Boolean} saveToFile
			 * @returns {Promise<{
			 *	res: Response
			 *	filename?: string
			 *	data: Readable
			 *	toBuffer: () => Promise<Buffer>
			 *	clear: () => Promise<void>
			 * }>}
			 */
			async value(PATH, saveToFile = false) {
				var res,
					filename,
					/** @type {Readable | Buffer} */
					data
				if (Buffer.isBuffer(PATH) || Helper.isReadableStream(PATH)) data = PATH
				// Convert ArrayBuffer to buffer using prototype function
				else if (PATH instanceof ArrayBuffer) data = PATH.toBuffer()
				else if (/^data:.*?\/.*?;base64,/i.test(PATH)) data = Buffer.from(PATH.split`,` [1], 'base64')
				else if (/^https?:\/\//.test(PATH)) {
					res = await fetch(PATH)
					data = res.body
				} else if (fs.existsSync(PATH)) {
					filename = PATH
					data = fs.createReadStream(PATH)
				} else data = Buffer.alloc(0)

				var isStream = Helper.isReadableStream(data)
				if (!isStream || Buffer.isBuffer(data)) {
					if (!Buffer.isBuffer(data)) throw new TypeError('Converting buffer to stream, but data have type' + typeof data, data)
					data = toReadable(data)
					isStream = true
				}
				var streamWithType = await fileTypeStream(data)
				var iyh = {
					...data,
					mime: 'text/plain',
					ext: 'txt'
				}
				filename = res ? res.headers ? res.headers.get("content-disposition") ? res.headers.get('content-disposition').split("filename=")[1]?.replaceAll(/(\")/g, "") ? res.headers.get('content-disposition').split("filename=")[1]?.replaceAll(/(\")/g, "") : Date.now() + '.' + streamWithType.fileType?.ext : Date.now() + '.' + streamWithType.fileType?.ext : Date.now() + '.' + streamWithType.fileType?.ext : Date.now() + '.' + streamWithType.fileType?.ext
				filename.includes('undefined') && res ? filename = Date.now() + '.' + (getExtension(res.headers.get('content-type')) ? getExtension(res.headers.get('content-type')) : 'txt') : filename.includes('undefined') ? filename = Date.now() + '.txt' : ""
				log(filename)
				if (data && saveToFile && !filename) {
					filename = path.join(__dirname, `../tmp/${filename}`)
					await Helper.saveStreamToFile(data, filename)
				}
				res ? res : res = null
				return {
					res,
					headers: res?.headers,
					filename,
					...streamWithType.fileType ? {
						...streamWithType.fileType
					} : {
						...iyh
					},
					data: streamWithType,
					async toBuffer() {
						var buffers = []
						for await (var chunk of streamWithType) buffers.push(chunk)
						return Buffer.concat(buffers)
					},
					async clear() {
						// if (res) /** @type {Response} */ (res).body
						streamWithType.destroy()
						if (filename) await fs.promises.unlink(filename)
					}
				}
			},
			enumerable: true,
			writable: true,
		},
		// waitEvent: {
		//		 /**
		//			* waitEvent
		//			* @param {String} eventName 
		//			* @param {Boolean} is 
		//			* @param {Number} maxTries 
		//			*/
		//		 value(eventName, is = () => true, maxTries = 25) { //Idk why this exist?
		//				 return new Promise((resolve, reject) => {
		//						 var tries = 0
		//						 var on = (...args) => {
		//								 if (++tries > maxTries) reject('Max tries reached')
		//								 else if (is()) {
		//										 conn.ev.off(eventName, on)
		//										 resolve(...args)
		//								 }
		//						 }
		//						 conn.ev.on(eventName, on)
		//				 })
		//		 }
		// },
		/** Resize Image
		 *
		 * @param {Buffer} Buffer (Only Image)
		 * @param {Numeric} Width
		 * @param {Numeric} Height
		 */
		resize: {
			async value(image, width, height) {
				var oyy = await Jimp.read(image)
				var kiyomasa = await oyy.resize(width, height).getBufferAsync(Jimp.MIME_JPEG)
				return kiyomasa
			}
		},
		genThumb: {
			async value(image, WIDTH = 300) {
				var jimp = await Jimp.read(image);
				var result = (await jimp
					.quality(100)
					.resize(WIDTH, Jimp.AUTO, Jimp.RESIZE_BILINEAR)
					.getBufferAsync(Jimp.MIME_JPEG)).toString('base64');
				return result
			}
		},
		/** Profile Image
		 *
		 * @param {Buffer} Buffer (Only Image)
		 * @param {Numeric} Width
		 * @param {Numeric} Height
		 */
		generateProfilePicture: {
			async value(buffer) {
				var jimp_1 = await Jimp.read(buffer);
				var resz = jimp_1.getWidth() > jimp_1.getHeight() ? jimp_1.resize(550, Jimp.AUTO) : jimp_1.resize(Jimp.AUTO, 650)
				var jimp_2 = await Jimp.read(await resz.getBufferAsync(Jimp.MIME_JPEG));
				return {
					img: await resz.getBufferAsync(Jimp.MIME_JPEG)
				}
			}
		},
		/**
		 * Send Payment
		 */
		sendPayment: {
			async value(jid, amount, currency, text = '', from, image, options) {
				var file = await conn.resize(image, 300, 150)
				var a = ["AED", "AFN", "ALL", "AMD", "ANG", "AOA", "ARS", "AUD", "AWG", "AZN", "BAM", "BBD", "BDT", "BGN", "BHD", "BIF", "BMD", "BND", "BOB", "BOV", "BRL", "BSD", "BTN", "BWP", "BYR", "BZD", "CAD", "CDF", "CHE", "CHF", "CHW", "CLF", "CLP", "CNY", "COP", "COU", "CRC", "CUC", "CUP", "CVE", "CZK", "DJF", "DKK", "DOP", "DZD", "EGP", "ERN", "ETB", "EUR", "FJD", "FKP", "GBP", "GEL", "GHS", "GIP", "GMD", "GNF", "GTQ", "GYD", "HKD", "HNL", "HRK", "HTG", "HUF", "IDR", "ILS", "INR", "IQD", "IRR", "ISK", "JMD", "JOD", "JPY", "KES", "KGS", "KHR", "KMF", "KPW", "KRW", "KWD", "KYD", "KZT", "LAK", "LBP", "LKR", "LRD", "LSL", "LTL", "LVL", "LYD", "MAD", "MDL", "MGA", "MKD", "MMK", "MNT", "MOP", "MRO", "MUR", "MVR", "MWK", "MXN", "MXV", "MYR", "MZN", "NAD", "NGN", "NIO", "NOK", "NPR", "NZD", "OMR", "PAB", "PEN", "PGK", "PHP", "PKR", "PLN", "PYG", "QAR", "RON", "RSD", "RUB", "RWF", "SAR", "SBD", "SCR", "SDG", "SEK", "SGD", "SHP", "SLL", "SOS", "SRD", "SSP", "STD", "SYP", "SZL", "THB", "TJS", "TMT", "TND", "TOP", "TRY", "TTD", "TWD", "TZS", "UAH", "UGX", "USD", "USN", "USS", "UYI", "UYU", "UZS", "VEF", "VND", "VUV", "WST", "XAF", "XAG", "XAU", "XBA", "XBB", "XBC", "XBD", "XCD", "XDR", "XFU", "XOF", "XPD", "XPF", "XPT", "XTS", "XXX", "YER", "ZAR", "ZMW"]
				var b = a[Math.floor(Math.random() * a.length)]
				var requestPaymentMessage = {
					amount: {
						currencyCode: currency || b,
						offset: 0,
						value: amount || 9.99
					},
					expiryTimestamp: 0,
					amount1000: (amount || 9.99) * 1000,
					currencyCodeIso4217: currency || b,
					requestFrom: from || '0@s.whatsapp.net',
					noteMessage: {
						extendedTextMessage: {
							text: text || 'Example Payment Message'
						}
					},
					background: !!image ? file : undefined
				};
				return conn.relayMessage(jid, {
					requestPaymentMessage
				}, {
					...options
				});
			}
		},
		/**
		 * Send Poll
		 */
		sendPoll: {
			async value(jid, name = '', optiPoll, options) {
				if (!Array.isArray(optiPoll[0]) && typeof optiPoll[0] === 'string') optiPoll = [optiPoll]
				if (!options) options = {}
				var pollMessage = {
					name: name,
					options: optiPoll.map(btn => ({
						optionName: !nullish(btn[0]) && btn[0] || ''
					})),
					selectableOptionsCount: 1
				}
				return conn.relayMessage(jid, {
					pollCreationMessage: pollMessage
				}, {
					...options
				});
			}
		},
		/**
		 * Picture	
		 */
		updateProfilePicture: {
			async value(jid, buffer) {
				var {
					img,
					preview
				} = await conn.generateProfilePicture(buffer)
				await conn.query({
					tag: 'iq',
					attrs: {
						to: jid,
						type: 'set',
						xmlns: 'w:profile:picture'
					},
					content: [{
						tag: 'picture',
						attrs: {
							type: 'image'
						},
						content: img
					}]
				})
			}
		},
		/**
		 *status 
		 */
		updateProfileStatus: {
			async value(status) {
				return conn.query({
					tag: 'iq',
					attrs: {
						to: 's.whatsapp.net',
						type: 'set',
						xmlns: 'status',
					},
					content: [{
						tag: 'status',
						attrs: {},
						content: Buffer.from(status, 'utf-8')
					}]
				})
			}
		},
		sendFile: {
			/**
			 * Send Media/File with Automatic Type Specifier
			 * @param {String} jid
			 * @param {String|Buffer} path
			 * @param {String} filename
			 * @param {String} caption
			 * @param {import('@adiwajshing/baileys').proto.WebMessageInfo} quoted
			 * @param {Boolean} ptt
			 * @param {Object} options
			 */
			async value(jid, path, filename = '', caption = '', quoted, ptt = false, options = {}) {
				var file = await conn.getFile(path)
				var mtype = '',
					stream = file.data,
					mimetype = options.mimetype || file.mime,
					toBuffer = file.toBuffer,
					convert
				var opt = {}

				if (quoted) opt.quoted = quoted
				if (!file.ext === 'txt') options.asDocument = true
				log({
					type: file
				})
				if (file.res !== null) {
					mimetype = file.res.headers.get('content-type')
				} else {
					mimetype = options.mimetype || file.mime
				}
				if (/webp/.test(file.mime) || (/image/.test(file.mime) && options.asSticker)) mtype = 'sticker'
				else if (/image/.test(file.mime) || (/webp/.test(file.mime) && options.asImage)) mtype = 'image'
				else if (/video/.test(file.mime)) mtype = 'video'
				else if (/audio/.test(file.mime))(
					convert = ptt ? await toAudio(stream, file.ext) : false,
					convert ? stream = convert.data : convert = false,
					convert ? toBuffer = convert.toBuffer : convert = false,
					mtype = 'audio',
					mimetype = ptt ? 'audio/ogg; codecs=opus' : mimetype
				)
				else mtype = 'document'
				if (options.asDocument) mtype = 'document'

				delete options.asSticker
				delete options.asLocation
				delete options.asVideo
				delete options.asDocument
				delete options.asImage

				var message = {
					...options,
					caption,
					ptt,
					[mtype]: {
						stream
					},
					mimetype,
					fileName: filename || file.filename
				}
				log({
					mimetype
				})
				var error = false
				try {
					if (options.asPtv && mtype == 'video') {
						var msg = await generateWAMessageContent({
							video: await toBuffer()
						}, {
							upload: conn.waUploadToServer
						})
						return await conn.relayMessage(jid, {
							ptvMessage: msg.videoMessage
						}, {
							quoted,
							...options
						})
					} else {
						return await conn.sendMessage(jid, message, {
							...opt,
							...options
						})
					}
				} catch (e) {
					console.error(e)
					return await conn.sendMessage(jid, {
							...message,
							[mtype]: await toBuffer()
						}, {
							...opt,
							...options
						})
						.catch(e => (error = e))
				} finally {
					file.clear()
					if (convert) convert.clear()
					if (error) throw error
				}
			},
			enumerable: true,
			writable: true,
		},
		sendContact: {
			/**
			 * Send Contact
			 * @param {String} jid 
			 * @param {String[][]|String[]} data
			 * @param {import('@adiwajshing/baileys').proto.WebMessageInfo} quoted 
			 * @param {Object} options 
			 */
			async value(jid, data, quoted, options) {
				if (!Array.isArray(data[0]) && typeof data[0] === 'string') data = [data]
				var contacts = []
				for (var [number, name] of data) {
					number = number.replace(/[^0-9]/g, '')
					var njid = number + '@s.whatsapp.net'
					var biz = await conn.getBusinessProfile(njid).catch(_ => null) || {}
					var vcard = `
BEGIN:VCARD
VERSION:3.0
N:;${name.replace(/\n/g, '\\n')};;;
FN:${name.replace(/\n/g, '\\n')}
TEL;type=CELL;type=VOICE;waid=${number}:${PhoneNumber('+' + number).getNumber('international')}${biz.description ? `
X-WA-BIZ-NAME:${(store.getContact(njid)?.vname || conn.getName(njid) || name).replace(/\n/, '\\n')}
X-WA-BIZ-DESCRIPTION:${biz.description.replace(/\n/g, '\\n')}
`.trim() : ''}
END:VCARD
`.trim()
					contacts.push({
						vcard,
						displayName: name
					})

				}
				return await conn.sendMessage(jid, {
					...options,
					contacts: {
						...options,
						displayName: (contacts.length >= 2 ? `${contacts.length} kontak` : contacts[0].displayName) || null,
						contacts,
					}
				}, {
					quoted,
					...options
				})
			},
			enumerable: true,
			writable: true,
		},
		reply: {
			/**
			 * Reply to a message
			 * @param {String} jid
			 * @param {String|Buffer} text
			 * @param {import('@adiwajshing/baileys').proto.WebMessageInfo} quoted
			 * @param {Object} options
			 */
			value(jid, text = '', quoted, options) {
				return Buffer.isBuffer(text) ? conn.sendFile(jid, text, 'file', '', quoted, false, options) : typeof text == "object" ? conn.sendMessage(jid, {
					...options,
					text: JSON.stringify(text, null, 2)
				}, {
					quoted,
					...options
				}) : conn.sendMessage(jid, {
					...options,
					text
				}, {
					quoted,
					...options
				})
			},
			writable: true,
		},
		editMessage: {
			value(jid, key, text = "", quoted, options) {
				return conn.relayMessage(jid, {
					protocolMessage: {
						key,
						type: 14,
						editedMessage: {
							conversation: text
						}
					}
				}, {
					quoted,
					...options
				})
			},
			writeable: true,
		},
		// TODO: Fix sendLocation
		// Maybe aploud buffer to whatsapp first and then send location
		sendButton: {
			/**
			 * send Button
			 * @param {String} jid
			 * @param {String} text
			 * @param {String} footer
			 * @param {Buffer} buffer
			 * @param {String[] | String[][]} buttons
			 * @param {import('@adiwajshing/baileys').proto.WebMessageInfo} quoted
			 * @param {Object} options
			 */
			async value(jid, text = '', footer = '', buffer, buttons, quoted, options) {
				var file,
					toBuffer
				if (Array.isArray(buffer))(
					options = quoted,
					quoted = buttons,
					buttons = buffer,
					buffer = null
				)
				else if (buffer) {
					try {
						file = await conn.getFile(buffer)
						buffer = file.data
						toBuffer = file.toBuffer
					} catch (e) {
						console.error(e)
						file = buffer = null
					}
				}
				if (!Array.isArray(buttons[0]) && typeof buttons[0] === 'string') buttons = [buttons]
				if (!options) options = {}
				var message = {
					...options,
					[buffer ? 'caption' : 'text']: text || '',
					footer,
					buttons: buttons.map(btn => ({
						buttonId: !nullish(btn[1]) && btn[1] || !nullish(btn[0]) && btn[0] || '',
						buttonText: {
							displayText: !nullish(btn[0]) && btn[0] || !nullish(btn[1]) && btn[1] || ''
						}
					})),
					...(buffer ?
						options.asLocation && /image/.test(file.mime) ? {
							location: {
								...options,
								jpegThumbnail: await conn.resize(await toBuffer(), 300, 150)
							}
						} : {
							[/video/.test(file.mime) ? 'video' : /image/.test(file.mime) ? 'image' : 'document']: {
								stream: buffer
							},
							mimetype: file.mime
						} : {})
				}

				var error = false
				try {
					return await conn.sendMessage(jid, message, {
						quoted,
						upload: conn.waUploadToServer,
						...options
					})
				} catch (e) {
					console.error(error = e)
				} finally {
					if (file) file.clear()
					if (error) throw error
				}
			},
			enumerable: true,
			writable: true,
		},
		sendHydrated: {
			/**
			 * 
			 * @param {String} jid 
			 * @param {String} text 
			 * @param {String} footer 
			 * @param {fs.PathLike} buffer
			 * @param {String|string[]} url
			 * @param {String|string[]} urlText
			 * @param {String|string[]} call
			 * @param {String|string[]} callText
			 * @param {String[][]} buttons
			 * @param {import('@adiwajshing/baileys').proto.WebMessageInfo} quoted
			 * @param {Object} options
			 */
			async value(jid, text = '', footer = '', buffer, url, urlText, call, callText, buttons, quoted, options) {
				var file,
					toBuffer
				if (buffer) {
					try {
						file = await conn.getFile(buffer)
						buffer = file.data
						toBuffer = file.toBuffer
					} catch (e) {
						console.error(e)
						file = buffer = null
					}
				}
				if (!options) options = {}
				var templateButtons = []
				if (url || urlText) {
					if (!Array.isArray(url)) url = [url]
					if (!Array.isArray(urlText)) urlText = [urlText]
					templateButtons.push(...(
						url.map((v, i) => [v, urlText[i]])
						.map(([url, urlText], i) => ({
							index: templateButtons.length + i + 1,
							urlButton: {
								displayText: !nullish(urlText) && urlText || !nullish(url) && url || '',
								url: !nullish(url) && url || !nullish(urlText) && urlText || ''
							}
						})) || []
					))
				}
				if (call || callText) {
					if (!Array.isArray(call)) call = [call]
					if (!Array.isArray(callText)) callText = [callText]
					templateButtons.push(...(
						call.map((v, i) => [v, callText[i]])
						.map(([call, callText], i) => ({
							index: templateButtons.length + i + 1,
							callButton: {
								displayText: !nullish(callText) && callText || !nullish(call) && call || '',
								phoneNumber: !nullish(call) && call || !nullish(callText) && callText || ''
							}
						})) || []
					))
				}
				if (buttons.length) {
					if (!Array.isArray(buttons[0])) buttons = [buttons]
					templateButtons.push(...(
						buttons.map(([text, id], index) => ({
							index: templateButtons.length + index + 1,
							quickReplyButton: {
								displayText: !nullish(text) && text || !nullish(id) && id || '',
								id: !nullish(id) && id || !nullish(text) && text || ''
							}
						})) || []
					))
				}
				if (options.asLocation && /image/.test(file.mime)) {
					var b = generateWAMessageFromContent(jid, proto.Message.fromObject({
						templateMessage: {
							hydratedTemplate: {
								locationMessage: {
									jpegThumbnail: await conn.resize(await toBuffer(), 300, 150)
								},
								hydratedContentText: text || '',
								hydratedFooterText: footer,
								...options,
								hydratedButtons: templateButtons
							}
						}
					}), {
						userJid: conn.user.jid,
						quoted: quoted,
						ephemeralExpiration: 86400,
						...options
					})
					return await conn.relayMessage(jid, b.message, {
						messageId: b.key.id
					})
				} else {
					var mimetype = options.mimetype || file ? file.res ? file.res.headers.get('content-type') : file.mime : null
					var message = {
						...options,
						[buffer ? 'caption' : 'text']: text || '',
						footer,
						templateButtons,
						...(buffer ? {
							[/video/.test(file.mime) ? 'video' : /image/.test(file.mime) ? 'image' : 'document']: {
								stream: buffer
							},
							mimetype: file.mime
						} : {})
					}
					if (message.document) {
						message = Object.assign(message, {
							mimetype,
							fileName: await say,
							fileLength: 50000,
							pageCount: 7000
						})
					}
					log(message)
					var error = false
					try {
						return await conn.sendMessage(jid, message, {
							quoted,
							upload: conn.waUploadToServer,
							...options
						})
					} catch (e) {
						error = e
						console.error(e)
					} finally {
						if (file) file.clear()
						if (error) throw error
					}
				}
			},
			enumerable: true,
			writable: true,
		},
		sendList: {
			async value(jid, title, text, footer, buttonText, listSections, quoted, options) {
				if (!options) options = {}
				// send a list message!
				var sections = listSections.map(([title, rows]) => ({
					title: !nullish(title) && title || !nullish(rowTitle) && rowTitle || '',
					rows: rows.map(([rowTitle, rowId, description]) => ({
						title: !nullish(rowTitle) && rowTitle || !nullish(rowId) && rowId || '',
						rowId: !nullish(rowId) && rowId || !nullish(rowTitle) && rowTitle || '',
						description: !nullish(description) && description || ''
					}))
				}))

				var listMessage = {
					text,
					footer,
					title,
					buttonText,
					sections
				}
				return conn.sendMessage(jid, listMessage, {
					quoted,
					upload: conn.waUploadToServer,
					...options
				})
			}
		},
		cMod: {
			/**
			 * cMod
			 * @param {String} jid 
			 * @param {import('@adiwajshing/baileys').proto.WebMessageInfo} message 
			 * @param {String} text 
			 * @param {String} sender 
			 * @param {*} options 
			 * @returns 
			 */
			value(jid, message, text = '', sender = conn.user.jid, options = {}) {
				if (options.mentions && !Array.isArray(options.mentions)) options.mentions = [options.mentions]
				var copy = message.toJSON()
				delete copy.message.messageContextInfo
				delete copy.message.senderKeyDistributionMessage
				var mtype = Object.keys(copy.message)[0]
				var msg = copy.message
				var content = msg[mtype]
				if (typeof content === 'string') msg[mtype] = text || content
				else if (content.caption) content.caption = text || content.caption
				else if (content.text) content.text = text || content.text
				if (typeof content !== 'string') {
					msg[mtype] = {
						...content,
						...options
					}
					msg[mtype].contextInfo = {
						...(content.contextInfo || {}),
						mentionedJid: options.mentions || content.contextInfo?.mentionedJid || []
					}
				}
				if (copy.participant) sender = copy.participant = sender || copy.participant
				else if (copy.key.participant) sender = copy.key.participant = sender || copy.key.participant
				if (copy.key.remoteJid.includes('@s.whatsapp.net')) sender = sender || copy.key.remoteJid
				else if (copy.key.remoteJid.includes('@broadcast')) sender = sender || copy.key.remoteJid
				copy.key.remoteJid = jid
				copy.key.fromMe = areJidsSameUser(sender, conn.user.id) || false
				return proto.WebMessageInfo.fromObject(copy)
			},
			enumerable: true,
			writable: true,
		},
		copyNForward: {
			/**
			 * Exact Copy Forward
			 * @param {String} jid
			 * @param {import('@adiwajshing/baileys').proto.WebMessageInfo} message
			 * @param {Boolean|Number} forwardingScore
			 * @param {Object} options
			 */
			async value(jid, message, forwardingScore = true, options = {}) {
				var vtype
				if (options.readViewOnce && message.message.viewOnceMessage?.message) {
					vtype = Object.keys(message.message.viewOnceMessage.message)[0]
					delete message.message.viewOnceMessage.message[vtype].viewOnce
					message.message = proto.Message.fromObject(
						JSON.parse(JSON.stringify(message.message.viewOnceMessage.message))
					)
					message.message[vtype].contextInfo = message.message.viewOnceMessage.contextInfo
				}
				var mtype = getContentType(message.message)
				var m = generateForwardMessageContent(message, !!forwardingScore)
				var ctype = getContentType(m)
				if (forwardingScore && typeof forwardingScore === 'number' && forwardingScore > 1) m[ctype].contextInfo.forwardingScore += forwardingScore
				m[ctype].contextInfo = {
					...(message.message[mtype].contextInfo || {}),
					...(m[ctype].contextInfo || {})
				}
				m = generateWAMessageFromContent(jid, m, {
					...options,
					userJid: conn.user.jid
				})
				await conn.relayMessage(jid, m.message, {
					messageId: m.key.id,
					additionalAttributes: {
						...options
					}
				})
				return m
			},
			enumerable: true,
			writable: true,
		},
		fakeReply: {
			/**
			 * Fake Replies
			 * @param {String} jid
			 * @param {String|Object} text
			 * @param {String} fakeJid
			 * @param {String} fakeText
			 * @param {String} fakeGroupJid
			 * @param {String} options
			 */
			value(jid, text = '', fakeJid = this.user.jid, fakeText = '', fakeGroupJid, options) {
				return conn.reply(jid, text, {
					key: {
						fromMe: areJidsSameUser(fakeJid, conn.user.id),
						participant: fakeJid,
						...(fakeGroupJid ? {
							remoteJid: fakeGroupJid
						} : {})
					},
					message: {
						conversation: fakeText
					},
					...options
				})
			},
			writable: true,
		},
		downloadM: {
			/**
			 * Download media message
			 * @param {Object} m
			 * @param {String} type
			* @param {{
						 *	saveToFile?: fs.PathLike | fs.promises.FileHandle;
						 *	asStream?: boolean
						 * }} opts
						 * @returns {Promise<fs.PathLike | fs.promises.FileHandle | Buffer>} the return will string, which is a filename if `opts.saveToFile` is `'true'`

			 */
			async value(m, type, opts) {
				var filename
				if (!m || !(m.url || m.directPath)) return Buffer.alloc(0)
				var stream = await downloadContentFromMessage(m, type)
				if (opts.asStream) {
					// TODO: Support return as stream
					// return stream
				}
				// Use push to fix performance issue
				var buffers = []
				for await (var chunk of stream) buffers.push(chunk)
				buffers = Buffer.concat(buffers)

				// Destroy the stream
				stream.destroy()

				// If saveToFile is true, call getFile function to save file and then get filename
				if (opts.saveToFile)({
					filename
				} = await conn.getFile(buffers, true))
				return opts.saveToFile && fs.existsSync(filename) ? filename : buffers

			},
			enumerable: true,
			writable: true,
		},
		parseMention: {
			/**
			 * Parses string into mentionedJid(s)
			 * @param {String} text
			 * @returns {Array<String>}
			 */
			value(text = '') {
				return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net')
			},
			enumerable: true,
			writable: true,
		},
		getName: {
			/**
			 * Get name from jid
			 * @param {String} jid
			 * @param {Boolean} withoutContact
			 */
			value(jid = '', withoutContact = false) {
				jid = conn.decodeJid(jid)
				withoutContact = conn.withoutContact || withoutContact
				var v
				if (jid.endsWith('@g.us')) return (async () => {
					v = await store.fetchGroupMetadata(jid, conn.groupMetadata) || {}
					return (v.name || v.subject || PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international'))
				})()

				else v = jid === '0@s.whatsapp.net' ? {
						jid,
						vname: 'WhatsApp'
					} : areJidsSameUser(jid, conn.user?.id || '') ?
					conn.user :
					(store.getContact(jid) || {})
				return (withoutContact ? '' : v.name) || v.subject || v.vname || v.notify || v.verifiedName || PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international')
			},
			enumerable: true,
			writable: true,
		},
		loadMessage: {
			/**
			 * 
			 * @param {String} messageID 
			 * @returns {import('@adiwajshing/baileys').proto.WebMessageInfo}
			 */
			value(jid, id) {
				if (!jid && !id) return null
				// if only 1 argument is passed, it is assumed to be a message id not a jid
				if (jid && !id)[id, jid] = [jid, null]
				return jid && id ? store.loadMessage(jid, id) : store.loadMessage(id)
			},
			enumerable: true,
			writable: true,
		},
		// TODO: Fix xml-notwell-format
		sendGroupV4Invite: {
			/**
			 * sendGroupV4Invite
			 * @param {String} jid 
			 * @param {*} participant 
			 * @param {String} inviteCode 
			 * @param {Number} inviteExpiration 
			 * @param {String} groupName 
			 * @param {String} caption 
			 * @param {Buffer} jpegThumbnail
			 * @param {*} options 
			 */
			async value(jid, participant, inviteCode, inviteExpiration, groupName = 'unknown subject', caption = 'Invitation to join my WhatsApp group', jpegThumbnail, options = {}) {
				/*var msg = proto.Message.fromObject({
					groupInviteMessage: proto.GroupInviteMessage.fromObject({
						inviteCode,
						inviteExpiration: parseInt(inviteExpiration) || +new Date(new Date + (3 * 86400000)),
						groupJid: jid,
						groupName: (groupName ? groupName : await conn.getName(jid)) || null,
						jpegThumbnail: Buffer.isBuffer(jpegThumbnail) ? jpegThumbnail.toString('base64') : null,
						caption
					})
				})*/
				var message = generateWAMessageFromContent(participant, {
					groupInviteMessage: {
						groupJid: jid,
						inviteCode,
						groupName: (groupName ? groupName : await conn.getName(jid)) || null,
						jpegThumbnail: Buffer.isBuffer(jpegThumbnail) ? jpegThumbnail.toString('base64') : null,
						caption,
						groupType: 1,
						inviteExpiration: parseInt(inviteExpiration) || +new Date(new Date + (3 * 86400000))
					}
				}, {
					userJid: conn.user.jid,
					quoted: null
				})
				await conn.relayMessage(participant, message.message, {
					messageId: message.key.id,
					additionalAttributes: {
						...options
					}
				})
				return message
			},
			enumerable: true,
			writable: true,
		},

		serializeM: {
			/**
			 * Serialize Message, so it easier to manipulate
			 * @param {import('@adiwajshing/baileys').proto.WebMessageInfo} m
			 */
			value(m) {
				return smsg(conn, m)
			},
			writable: true,
		},
		user: {
			get() {
				Object.assign(botUser, conn.authState.creds.me || {})
				return {
					...botUser,
					jid: botUser.id?.decodeJid?.() || botUser.id,
				}
			},
			set(value) {
				Object.assign(botUser, value)
			},
			enumerable: true,
			configurable: true,
		}
	})

	return sock
}
/**
 * Serialize Message
 * @param {ReturnType<typeof makeWASocket>} conn 
 * @param {import('@adiwajshing/baileys').proto.WebMessageInfo} m 
 * @param {Boolean} hasParent 
 */
export function smsg(conn, m, hasParent) {
	if (!m) return m
	/**
	 * @type {import('@adiwajshing/baileys').proto.WebMessageInfo}
	 */
	var M = proto.WebMessageInfo
	m = M.fromObject(m)
	Object.defineProperty(m, 'conn', {
		enumerable: false,
		writable: true,
		value: conn
	})
	var protocolMessageKey
	if (m.message) {
		if (m.mtype == 'protocolMessage' && m.msg.key) {
			protocolMessageKey = m.msg.key
			if (protocolMessageKey == 'status@broadcast') protocolMessageKey.remoteJid = m.chat
			if (!protocolMessageKey.participant || protocolMessageKey.participant == 'status_me') protocolMessageKey.participant = m.sender
			protocolMessageKey.fromMe = areJidsSameUser(protocolMessageKey.participant, conn.user.id)
			if (!protocolMessageKey.fromMe && areJidsSameUser(protocolMessageKey.remoteJid, conn.user.id)) protocolMessageKey.remoteJid = m.sender
		}
		if (m.quoted)
			if (!m.quoted.mediaMessage) delete m.quoted.download
	}
	if (!m.mediaMessage) delete m.download

	try {
		if (protocolMessageKey && m.mtype == 'protocolMessage') conn.ev.emit('messages.delete', {
			keys: [protocolMessageKey]
		})
	} catch (e) {
		console.error(e)
	}
	return m
}

// https://github.com/Nurutomo/wabot-aq/issues/490
var MediaType = ['imageMessage', 'videoMessage', 'audioMessage', 'stickerMessage', 'documentMessage']
export function serialize() {
	return Object.defineProperties(proto.WebMessageInfo.prototype, {
		conn: {
			value: Connection.conn,
			enumerable: false,
			writable: true
		},
		id: {
			get() {
				return this.key?.id
			}
		},
		isBaileys: {
			get() {
				return this.id?.length === 16 || this.id?.startsWith('3EB0') && this.id?.length === 12 || false
			}
		},
		chat: {
			get() {
				var senderKeyDistributionMessage = this.message?.senderKeyDistributionMessage?.groupId
				return (
					this.key?.remoteJid ||
					(senderKeyDistributionMessage &&
						senderKeyDistributionMessage !== 'status@broadcast'
					) || ''
				).decodeJid()
			}
		},
		isGroup: {
			get() {
				return this.chat.endsWith('@g.us')
			},
			enumerable: true
		},
		sender: {
			get() {
				return this.conn?.decodeJid(this.key?.fromMe && this.conn?.user.id || this.participant || this.key.participant || this.chat || '')
			},
			enumerable: true
		},
		fromMe: {
			get() {
				return this.key?.fromMe || areJidsSameUser(this.conn?.user.id, this.sender) || false
			}
		},
		mtype: {
			get() {
				if (!this.message) return ''
				return getContentType(this.message)
			},
			enumerable: true
		},
		msg: {
			get() {
				if (!this.message) return null
				if (this.mtype?.startsWith('viewOnce')) {
					return this.message[this.mtype].message.imageMessage || this.message[this.mtype].message.videoMessage
				} else {
					return this.message[this.mtype]
				}
			}
		},
		mediaMessage: {
			get() {
				if (!this.message) return null
				var data
				if (this.mtype?.startsWith('viewOnce')) {
					data = this.message[this.mtype].message || this.message[this.mtype].message
				}
				var Message = ((this.msg?.url || this.msg?.directPath) ? data ? {
					...data
				} : {
					...this.message
				} : extractMessageContent(this.message)) || null
				if (!Message) return null
				var mtype = Object.keys(Message)[0]
				return MediaType.includes(mtype) ? Message : null
			},
			enumerable: true
		},
		mediaType: {
			get() {
				var message
				if (!(message = this.mediaMessage)) return null
				return Object.keys(message)[0]
			},
			enumerable: true,
		},
		quoted: {
			get() {
				/** @type {ReturnType<typeof makeWASocket>} */
				var self = this
				var msg = self.msg
				var contextInfo = msg?.contextInfo
				var quoted = contextInfo?.quotedMessage
				if (!msg || !contextInfo || !quoted) return null
				var type = getContentType(quoted)
				var q = quoted[type]
				var text = typeof q === 'string' ? q : q.text
				return Object.defineProperties(JSON.parse(JSON.stringify(typeof q === 'string' ? {
					text: q
				} : q)), {
					mtype: {
						get() {
							return type
						},
						enumerable: true
					},
					mediaMessage: {
						get() {
							var Message = ((q.url || q.directPath) ? {
								...quoted
							} : extractMessageContent(quoted)) || null
							if (!Message) return null
							var mtype = Object.keys(Message)[0]
							return MediaType.includes(mtype) ? Message : null
						},
						enumerable: true
					},
					mediaType: {
						get() {
							var message
							if (!(message = this.mediaMessage)) return null
							return Object.keys(message)[0]
						},
						enumerable: true,
					},
					id: {
						get() {
							return contextInfo.stanzaId
						},
						enumerable: true
					},
					chat: {
						get() {
							return contextInfo.remoteJid || self.chat
						},
						enumerable: true
					},
					isBaileys: {
						get() {
							return this.id?.length === 16 || this.id?.startsWith('3EB0') && this.id.length === 12 || false
						},
						enumerable: true
					},
					sender: {
						get() {
							return (contextInfo.participant || this.chat || '').decodeJid()
						},
						enumerable: true
					},
					fromMe: {
						get() {
							return areJidsSameUser(this.sender, self.conn?.user.jid)
						},
						enumerable: true,
					},
					text: {
						get() {
							return text || this.caption || this.contentText || this.selectedDisplayText || this.title || ''
						},
						enumerable: true
					},
					mentionedJid: {
						get() {
							return q.contextInfo?.mentionedJid || self.getQuotedObj()?.mentionedJid || []
						},
						enumerable: true
					},
					name: {
						get() {
							var sender = this.sender
							return sender ? self.conn?.getName(sender) : null
						},
						enumerable: true

					},
					vM: {
						get() {
							return proto.WebMessageInfo.fromObject({
								key: {
									fromMe: this.fromMe,
									remoteJid: this.chat,
									id: this.id
								},
								message: quoted,
								...(self.isGroup ? {
									participant: this.sender
								} : {})
							})
						}
					},
					fakeObj: {
						get() {
							return this.vM
						}
					},
					download: {
						value(saveToFile = false) {
							var mtype = this.mediaType
							return self.conn?.downloadM(this.mediaMessage[mtype], mtype.replace(/message/i, ''), {
								saveToFile
							})
						},
						enumerable: true,
						configurable: true,
					},
					reply: {
						/**
						 * Reply to quoted message
						 * @param {String|Object} text
						 * @param {String|false} chatId
						 * @param {Object} options
						 */
						value(text, chatId, options) {
							return self.conn?.reply(chatId ? chatId : this.chat, text, this.vM, options)
						},
						enumerable: true,
					},
					copy: {
						/**
						 * Copy quoted message
						 */
						value() {
							var M = proto.WebMessageInfo
							return smsg(conn, M.fromObject(M.toObject(this.vM)))
						},
						enumerable: true,
					},
					forward: {
						/**
						 * Forward quoted message
						 * @param {String} jid
						 *	@param {Boolean} forceForward
						 */
						value(jid, force = false, options) {
							return self.conn?.sendMessage(jid, {
								forward: this.vM,
								force,
								...options
							}, {
								...options
							})
						},
						enumerable: true,
					},
					copyNForward: {
						/**
						 * Exact Forward quoted message
						 * @param {String} jid
						 * @param {Boolean|Number} forceForward
						 * @param {Object} options
						 */
						value(jid, forceForward = false, options) {
							return self.conn?.copyNForward(jid, this.vM, forceForward, options)
						},
						enumerable: true,

					},
					cMod: {
						/**
						 * Modify quoted Message
						 * @param {String} jid
						 * @param {String} text
						 * @param {String} sender
						 * @param {Object} options
						 */
						value(jid, text = '', sender = this.sender, options = {}) {
							return self.conn?.cMod(jid, this.vM, text, sender, options)
						},
						enumerable: true,

					},
					delete: {
						/**
						 * Delete quoted message
						 */
						value() {
							return self.conn?.sendMessage(this.chat, {
								delete: this.vM.key
							})
						},
						enumerable: true,

					},
					react: {
						value(text) {
							return self.conn?.sendMessage(this.chat, {
								react: {
									text,
									key: this.vM.key
								}
							})
						},
						enumerable: true,
					}
				})
			},
			enumerable: true
		},
		_text: {
			value: null,
			writable: true,
		},
		text: {
			get() {
				var msg = this.msg
				var text = (typeof msg === 'string' ? msg : msg?.text) || msg?.caption || msg?.contentText || ''
				return typeof this._text === 'string' ? this._text : '' || (typeof text === 'string' ? text : (
					text?.selectedDisplayText ||
					text?.hydratedTemplate?.hydratedContentText ||
					text
				)) || ''
			},
			set(str) {
				return this._text = str
			},
			enumerable: true
		},
		mentionedJid: {
			get() {
				return this.msg?.contextInfo?.mentionedJid?.length && this.msg.contextInfo.mentionedJid || []
			},
			enumerable: true
		},
		name: {
			get() {
				return !nullish(this.pushName) && this.pushName || this.conn?.getName(this.sender)
			},
			enumerable: true
		},
		download: {
			value(saveToFile = false) {
				var mtype = this.mediaType
				return this.conn?.downloadM(this.mediaMessage[mtype], mtype.replace(/message/i, ''), {
					saveToFile
				})
			},
			enumerable: true,
			configurable: true
		},
		reply: {
			value(text, chatId, options) {
				return this.conn?.reply(chatId ? chatId : this.chat, text, this, options)
			}
		},
		copy: {
			value() {
				var M = proto.WebMessageInfo
				return smsg(this.conn, M.fromObject(M.toObject(this)))
			},
			enumerable: true
		},
		forward: {
			value(jid, force = false, options = {}) {
				return this.conn?.sendMessage(jid, {
					forward: this,
					force,
					...options
				}, {
					...options
				})
			},
			enumerable: true
		},
		copyNForward: {
			value(jid, forceForward = false, options = {}) {
				return this.conn?.copyNForward(jid, this, forceForward, options)
			},
			enumerable: true
		},
		cMod: {
			value(jid, text = '', sender = this.sender, options = {}) {
				return this.conn?.cMod(jid, this, text, sender, options)
			},
			enumerable: true
		},
		getQuotedObj: {
			value() {
				if (!this.quoted.id) return null
				var q = proto.WebMessageInfo.fromObject(this.conn?.loadMessage(this.quoted.sender, this.quoted.id) || this.conn?.loadMessage(this.quoted.id) || this.quoted.vM)
				return smsg(this.conn, q)
			},
			enumerable: true
		},
		getQuotedMessage: {
			get() {
				return this.getQuotedObj
			}
		},
		delete: {
			value() {
				return this.conn?.sendMessage(this.chat, {
					delete: this.key
				})
			},
			enumerable: true
		},
		react: {
			value(text) {
				return this.conn?.sendMessage(this.chat, {
					react: {
						text,
						key: this.key
					}
				})
			},
			enumerable: true
		}
	})
}

export function logic(check, inp, out) {
	if (inp.length !== out.length) throw new Error('Input and Output must have same length')
	for (var i in inp)
		if (util.isDeepStrictEqual(check, inp[i])) return out[i]
	return null
}

export function protoType() {
	/**
	 * @returns {ArrayBuffer}
	 */
	Buffer.prototype.toArrayBuffer = function toArrayBufferV2() {
		var ab = new ArrayBuffer(this.length);
		var view = new Uint8Array(ab);
		for (var i = 0; i < this.length; ++i) {
			view[i] = this[i];
		}
		return ab;
	}
	/**
	 * @returns {ArrayBuffer}
	 */
	Buffer.prototype.toArrayBufferV2 = function toArrayBuffer() {
		return this.buffer.slice(this.byteOffset, this.byteOffset + this.byteLength)
	}
	/**
	 * @returns {Buffer}
	 */
	ArrayBuffer.prototype.toBuffer = function toBuffer() {
		var buf = Buffer.alloc(this.byteLength)
		var view = new Uint8Array(this)
		for (var i = 0; i < buf.length; ++i) {
			buf[i] = view[i]
		}
		return buf;
	}
	/**
	 * @returns {Promise<import('file-type').FileTypeResult | undefined>}
	 */
	Uint8Array.prototype.getFileType =
		ArrayBuffer.prototype.getFileType =
		Buffer.prototype.getFileType = function getFileType() {
			return fileTypeFromBuffer(this)
		}
	/**
	 * @returns {Boolean}
	 */
	String.prototype.isNumber =
		Number.prototype.isNumber = function isNumber() {
			var int = parseInt(this)
			return typeof int === 'number' && !isNaN(int)
		}
	/**
	 * @returns {String}
	 */
	String.prototype.capitalize = function capitalize() {
		return this.charAt(0).toUpperCase() + this.slice(1, this.length)
	}
	/**
	 * @returns {String}
	 */
	String.prototype.capitalizeV2 = function capitalizeV2() {
		var str = this.split(' ')
		return str.map(v => v.capitalize()).join(' ')
	}
	String.prototype.decodeJid = function decodeJid() {
		if (/:\d+@/gi.test(this)) {
			var decode = jidDecode(this) || {}
			return (decode.user && decode.server && decode.user + '@' + decode.server || this).trim()
		} else return this.trim()
	}
	/**
	 * Number must be milliseconds
	 * @returns {string}
	 */
	Number.prototype.toTimeString = function toTimeString() {
		// var milliseconds = this % 1000
		var seconds = Math.floor((this / 1000) % 60)
		var minutes = Math.floor((this / (60 * 1000)) % 60)
		var hours = Math.floor((this / (60 * 60 * 1000)) % 24)
		var days = Math.floor((this / (24 * 60 * 60 * 1000)))
		return (
			(days ? `${days} day(s) ` : '') +
			(hours ? `${hours} hour(s) ` : '') +
			(minutes ? `${minutes} minute(s) ` : '') +
			(seconds ? `${seconds} second(s)` : '')
		).trim()
	}
	Number.prototype.getRandom =
		String.prototype.getRandom =
		Array.prototype.getRandom = function getRandom() {
			if (Array.isArray(this) || this instanceof String) return this[Math.floor(Math.random() * this.length)]
			return Math.floor(Math.random() * this)
		}
	Number.prototype.getSize = function getSize() {
		var SI_POSTFIXES = ["B", " KB", " MB", " GB", " TB", " PB", " EB"]
		var tier = Math.log10(Math.abs(this)) / 3 | 0
		if (tier == 0) return this
		var postfix = SI_POSTFIXES[tier]
		var scale = Math.pow(10, tier * 3)
		var scaled = this / scale
		var formatted = scaled.toFixed(1) + ''
		if (/\.0$/.test(formatted))
			formatted = formatted.substr(0, formatted.length - 2)
		return {
			size: formatted,
			postfix,
			formatted: formatted + postfix
		}
	}
}


/**
 * ??
 * @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing_operator
 * @returns {boolean}
 */
function nullish(args) {
	return !(args !== null && args !== undefined)
}