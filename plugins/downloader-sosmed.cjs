async function handler(m, {
	conn,
	text,
	command,
	usedPrefix: _p,
	isPrems,
	isOwner,
	args
}) {
	return new Promise(async (resolve, reject) => {
		if (!args[0]) return m.reply('linknya mana gan?')
		var a
		var rx = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
		conn.sendMessage(m.chat, {
			react: {
				text: '⏳',
				key: m.key
			}
		})
		if (/^.*tiktok/i.test(args[0])) {
			try {
				a = (await axios.get(API('ghst', 'api/tiktok', {
					url: args[0]
				}, 'key'))).data
				console.log(a)
				if (a.success) {
					m.reply(work)
					await delay(2000)
					return resolve(await conn.sendFile(m.chat, a.video.nowm, "", require('util').format({
						author: a.author.nickname,
						music: a.music,
						nowatermark_hd: a.video.nowm_hd,
						source: text
					}), m))
				} else if (a.status == 403) {
					return resolve(m.reply(require('util').format({
						status: 403,
						msg: 'invalid Key'
					})))
				} else {
					return resolve(m.reply(error))
				}
			} catch (e) {
				if (e.response) {
					console.log(e.response.data)
					return resolve(m.reply(require('util').format({
						status: e.response.status,
						msg: e.response.statusText
					})))
				} else {
					console.log(e)
					return resolve(m.reply(require('util').format({
						status: 500,
						msg: `ada yang error silahkan lapor ke Admin @${nomorown}`
					}), null, {
						mentions: [nomorown + `@s.whatsapp.net`]
					}))
				}
			}
		} else if (/^.*(fb.watch|facebook.com|fb.gg)/i.test(args[0])) {
			try {
				a = (await axios.get(API('ghst', 'api/sosmed', {
					url: args[0]
				}, 'key'))).data
				console.log(a)
				if (a.status) {
					m.reply(work)
					await delay(2000)
					return resolve(await conn.sendFile(m.chat, a.data.sd.url, "", require('util').format({
						title: a.data.meta.title,
						quality: 'SD',
						hd_download: a.data.hd.url,
						source: text
					}), m))
				} else if (a.status == 403) {
					return resolve(m.reply(require('util').format({
						status: 403,
						msg: 'invalid Key'
					})))
				} else {
					return resolve(m.reply(error))
				}
			} catch (e) {
				if (e.response) {
					console.log(e.response.data)
					return resolve(m.reply(require('util').format({
						status: e.response.status,
						msg: e.response.statusText
					})))
				} else {
					console.log(e)
					return resolve(m.reply(require('util').format({
						status: 500,
						msg: `ada yang error silahkan lapor ke Admin @${nomorown}`
					}), null, {
						mentions: [nomorown + `@s.whatsapp.net`]
					}))
				}
			}
		} else if (/^.*instagram.com\/(p|reel|tv|stories)/i.test(args[0])) {
			try {
				a = (await axios.get(API('ghst', 'api/sosmed', {
					url: args[0]
				}, 'key'))).data
				console.log(a)
				if (a.status) {
					m.reply(work)
					await delay(2000)
					for (let {
							url,
							thumbnail
						} of a.data) {
						await delay(1500)
						return resolve(await conn.sendFile(m.chat, url, "", "", m, 0, {
							asDocument: true
						}))
					}
				} else if (a.status == 403) {
					return resolve(m.reply(require('util').format({
						status: 403,
						msg: 'invalid Key'
					})))
				} else {
					return resolve(m.reply(error))
				}
			} catch (e) {
				if (e.response) {
					console.log(e.response.data)
					return resolve(m.reply(require('util').format({
						status: e.response.status,
						msg: e.response.statusText
					})))
				} else {
					console.log(e)
					return resolve(m.reply(require('util').format({
						status: 500,
						msg: `ada yang error silahkan lapor ke Admin @${nomorown}`
					}), null, {
						mentions: [nomorown + `@s.whatsapp.net`]
					}))
				}
			}
		} else if (/^.*soundcloud/i.test(args[0])) {
			try {
				a = (await axios.get(API('ghst', 'api/sosmed', {
					url: args[0]
				}, 'key'))).data
				console.log(a)
				if (a.status) {
					m.reply(work)
					await delay(2000)
					return resolve(await conn.sendFile(m.chat, a.data.player.url, a.data.meta.title + ".mp3", "", m, null, {
						asDocument: true
					}))
				} else if (a.status == 403) {
					return resolve(m.reply(require('util').format({
						status: 403,
						msg: 'invalid Key'
					})))
				} else {
					return resolve(m.reply(error))
				}
			} catch (e) {
				if (e.response) {
					console.log(e.response.data)
					return resolve(m.reply(require('util').format({
						status: e.response.status,
						msg: e.response.statusText
					})))
				} else {
					console.log(e)
					return resolve(m.reply(require('util').format({
						status: 500,
						msg: `ada yang error silahkan lapor ke Admin @${nomorown}`
					}), null, {
						mentions: [nomorown + `@s.whatsapp.net`]
					}))
				}
			}
		} else if (/^.*twitter/i.test(args[0])) {
			try {
				a = (await axios.get(API('ghst', 'api/sosmed', {
					url: args[0]
				}, 'key'))).data
				console.log(a)
				if (a.status) {
					m.reply(work)
					await delay(2000)
					return resolve(await conn.sendFile(m.chat, a.data.url[0].url, "", require('util').format({
						title: a.data.meta.title,
						source: text
					}), m))
				} else if (a.status == 403) {
					return resolve(m.reply(require('util').format({
						status: 403,
						msg: 'invalid Key'
					})))
				} else {
					return resolve(m.reply(error))
				}
			} catch (e) {
				if (e.response) {
					console.log(e.response.data)
					return resolve(m.reply(require('util').format({
						status: e.response.status,
						msg: e.response.statusText
					})))
				} else {
					console.log(e)
					return resolve(m.reply(require('util').format({
						status: 500,
						msg: `ada yang error silahkan lapor ke Admin @${nomorown}`
					}), null, {
						mentions: [nomorown + `@s.whatsapp.net`]
					}))
				}
			}
		} else if (/^.*mediafire/i.test(args[0])) {
			try {
				a = (await axios.get(API('ghst', 'api/sosmed', {
					url: args[0]
				}, 'key'))).data
				console.log(a)
				if (a.status) {
					m.reply(work)
					await delay(2000)
					return resolve(await conn.sendFile(m.chat, a.data.link, a.data.nama, "", m, null, {
						asDocument: true
					}))
				} else if (a.status == 403) {
					return resolve(m.reply(require('util').format({
						status: 403,
						msg: 'invalid Key'
					})))
				} else {
					return resolve(m.reply(error))
				}
			} catch (e) {
				if (e.response) {
					console.log(e.response.data)
					return resolve(m.reply(require('util').format({
						status: e.response.status,
						msg: e.response.statusText
					})))
				} else {
					console.log(e)
					return resolve(m.reply(require('util').format({
						status: 500,
						msg: `ada yang error silahkan lapor ke Admin @${nomorown}`
					}), null, {
						mentions: [nomorown + `@s.whatsapp.net`]
					}))
				}
			}
		} else if (rx.test(args[0])) {
			if (!args[1]) return resolve(m.reply(`*untuk link youtube gunakan format command seperti ini*\n*${_p+command} link type*\n\n*contoh: ${_p+command} ${args[0]} mp3*\n*Accepted type: mp3, mp4*`))
			if (!['mp3', 'mp4'].includes(args[1])) return resolve(m.reply(`invalid type\nOnly Accepted mp3 or mp4`))
			try {
				a = (await axios.get(API('ghst', 'api/sosmed', {
					url: args[0]
				}, 'key'))).data
				console.log(a)
				var data, isLimit
				if (a.status) {
					if (args[1].includes('mp3')) {
						if (a.data.result.audio_length > 1) {
							data = a.data.result.audio.slice(1)[0]
							isLimit = (isPrems || isOwner ? 99 : 30) * 1048576 < data.fileLength
							if (!isLimit) {
								m.reply(work)
								await delay(2000)
								return resolve(await conn.sendFile(m.chat, data.url, a.data.details.title + '.mp3', "", m, null, {
									asDocument: true,
									contextInfo: {
										externalAdReply: {
											mediaType: 2,
											description: 'anu',
											title: a.data.details.title,
											mediaUrl: data.url,
											body: author,
											thumbnail: await getbuffer(a.data.details.thumbnail.url),
											sourceUrl: "",
											showAdAttribution: true, // false
											//renderLargerThumbnail: true // false
										}
									}
								}))
							} else {
								return resolve(m.reply(`File Melebihi limit user free\n\t\t\t*Limit*\n*USER FREE:* 30mb\n*USER PREMIUM:* 99mb\n*📍Title:* ${a.data.details.title}${!(a.data.details.shortDescription) ? "": "\n*📜Description:* " + a.data.details.shortDescription }\n*🔗Link:* ${data.url}`))
							}
						}
					} else {
						if (a.data.result.video_length > 1) {
							data = a.data.result.video.slice(-1)[0]
							isLimit = (isPrems || isOwner ? 99 : 30) * 1048576 < (data.fileLength !== null) ? data.fileLength : (await axios.get(data.url)).headers['content-length']
							if (isLimit) {
								data = a.data.result.video.slice(1)[0]
								isLimit = (isPrems || isOwner ? 99 : 30) * 1048576 < (data.fileLength !== null) ? data.fileLength : (await axios.get(data.url)).headers['content-length']
								if (!isLimit) {
									m.reply(work)
									await delay(2000)
									return resolve(await conn.sendFile(m.chat, data.url, a.data.details.title + '.mp4', "", m, null, {
										asDocument: true,
										contextInfo: {
										externalAdReply: {
											mediaType: 2,
											description: 'anu',
											title: a.data.details.title,
											mediaUrl: data.url,
											body: author,
											thumbnail: await getbuffer(a.data.details.thumbnail.url),
											sourceUrl: "",
											showAdAttribution: true, // false
											//renderLargerThumbnail: true // false
										}
									}
									}))
								} else {
									return resolve(m.reply(`File Melebihi limit user free\n\t\t\t*Limit*\n*USER FREE:* 30mb\n*USER PREMIUM:* 99mb\n*📍Title:* ${a.data.details.title}${!(a.data.details.shortDescription) ? "": "\n*📜Description:* " + a.data.details.shortDescription }\n*🔗Link:* ${data.url}`))
								}
							} else {
								m.reply(work)
								await delay(2000)
								return resolve(await conn.sendFile(m.chat, data.url, a.data.details.title + '.mp4', "", m, null, {
									asDocument: true,
									contextInfo: {
										externalAdReply: {
											mediaType: 2,
											description: 'anu',
											title: a.data.details.title,
											mediaUrl: data.url,
											body: author,
											thumbnail: await getbuffer(a.data.details.thumbnail.url),
											sourceUrl: "",
											showAdAttribution: true, // false
											//renderLargerThumbnail: true // false
										}
									}
								}))
							}
						} else {
							data = a.data.result.video[0]
							isLimit = (isPrems || isOwner ? 99 : 30) * 1048576 < (data.fileLength !== null) ? data.fileLength : (await axios.get(data.url)).headers['content-length']
							if (!isLimit) {
								m.reply(work)
								await delay(2000)
								return resolve(await conn.sendFile(m.chat, data.url, a.data.details.title + '.mp4', "", m, null, {
									asDocument: true,
									contextInfo: {
										externalAdReply: {
											mediaType: 2,
											description: 'anu',
											title: a.data.details.title,
											mediaUrl: data.url,
											body: author,
											thumbnail: await getbuffer(a.data.details.thumbnail.url),
											sourceUrl: "",
											showAdAttribution: true, // false
											//renderLargerThumbnail: true // false
										}
									}
								}))
							} else {
								return resolve(m.reply(`File Melebihi limit user free\n\t\t\t*Limit*\n*USER FREE:* 30mb\n*USER PREMIUM:* 99mb\n*📍Title:* ${a.data.details.title}${!(a.data.details.shortDescription) ? "": "\n*📜Description:* " + a.data.details.shortDescription }\n*🔗Link:* ${data.url}`))
							}
						}
					}
				} else if (a.status == 403) {
					return resolve(m.reply(require('util').format({
						status: 403,
						msg: 'invalid Key'
					})))
				} else {
					return resolve(m.reply(error))
				}
			} catch (e) {
				if (e.response) {
					console.log(e.response.data)
					return resolve(m.reply(require('util').format({
						status: e.response.status,
						msg: e.response.statusText
					})))
				} else {
					console.log(e)
					return resolve(m.reply(require('util').format({
						status: 500,
						msg: `ada yang error silahkan lapor ke Admin @${nomorown}`
					}), null, {
						mentions: [nomorown + `@s.whatsapp.net`]
					}))
				}
			}
		} else if (/^.*zippyshare/i.test(args[0])) {
			try {
				var a = await zippy(args[0])
				if (a.error) {
					return resolve(m.reply(require('util').format(a)))
				} else {
					isLimit = (isPrems || isOwner ? 99 : 30) * 1048576 < (await axios.get(encodeURIComponent(a.url))).headers['content-length']
					if (isLimit) {
						return resolve(m.reply(`File Melebihi limit user free\n\t\t\t*Limit*\n*USER FREE:* 30mb\n*USER PREMIUM:* 99mb\n*📍Title:* ${a.name}\n*🔗Link:* ${a.url}`))
					} else {
						m.reply(work)
						await delay(2000)
						return resolve(await conn.sendFile(m.chat, a.url, a.name, "", m, null, {
							asDocument: true
						}))
					}
				}
			} catch (e) {
				log(e)
				return resolve(m.reply(require('util').format({
					status: 500,
					msg: `ada yang error silahkan lapor ke Admin @${nomorown}`
				}), null, {
					mentions: [nomorown + `@s.whatsapp.net`]
				}))
			}
		} else {
			let [query, format] = text.split(/[&|.]/i)
			if (!format) {
				m.reply('default search: mp3\ngunakan format seperti ini jika ingin menggunakan format mp3 atau mp4\n' + _p + command + ' query|format\ncontoh: ' + _p + command + ' ya sudahlah LHNTRX|mp4')
			}
			await delay(3000)
			if (!format) {
				format = 'mp3'
			}
			try {
				a = (await axios.get(API('ghst', 'api/sosmed', {
					url: query
				}, 'key'))).data
				console.log(a)
				if (a.status) {
					var rows = []
					for (var i of a.data) {
						if (format.includes('mp4')) {
							rows.push({
								title: i.title,
								description: `Cʜᴀɴɴᴇʟ: ${i.owner.channel} | Vɪᴇᴡꜱ: ${i.views}`,
								rowId: _p + command + " " + i.browse + " mp4"
							})
						} else {
							rows.push({
								title: i.title,
								description: `Cʜᴀɴɴᴇʟ: ${i.owner.channel} | Dᴜʀᴀᴛɪᴏɴꜱ: ${i.duration}`,
								rowId: _p + command + " " + i.browse + " mp3"
							})
						}
					}
					const sendMsg = await conn.sendMessage(m.chat, {
						text: '*Aᴠᴀɪʟᴀʙʟᴇ Rᴇꜱᴜʟᴛ:* *' + a.data_length + '*',
						footer: author,
						title: '```' + 'Hᴀꜱɪʟ Pᴇɴᴄᴀʀɪᴀɴ Dᴀʀɪ``` *' + query + '*\n',
						buttonText: "ꜱᴇᴀʀᴄʜ ʜᴇʀᴇ!",
						sections: [{
							title: "Hᴀꜱɪʟ Pᴇɴᴄᴀʀɪᴀɴ",
							rows
						}]
					})
					await delay(60000)
					return resolve(await conn.sendMessage(m.chat, {
						delete: sendMsg.key
					}))
				} else if (a.status == 403) {
					return resolve(m.reply(require('util').format({
						status: 403,
						msg: 'invalid Key'
					})))
				} else {
					return resolve(m.reply(error))
				}
			} catch (e) {
				if (e.response) {
					console.log(e.response.data)
					return resolve(m.reply(require('util').format({
						status: e.response.status,
						msg: e.response.statusText
					})))
				} else {
					console.log(e)
					return resolve(m.reply(require('util').format({
						status: 500,
						msg: `ada yang error silahkan lapor ke Admin @${nomorown}`
					}), null, {
						mentions: [nomorown + `@s.whatsapp.net`]
					}))
				}
			}
		}
	})
}
handler.help = ['download *url*']
handler.tags = ['downloader']
handler.command = /^download$/i
module.exports = handler