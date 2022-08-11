async function handler(m, {
	conn,
	text,
	command,
	usedPrefix: _p,
	isPrems,
	isOwner,
	args
}) {
	log(command)
	if (command == 'download') {
		if (!args[0]) return m.reply('linknya mana gan?')
		var a
		var rx = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
		conn.sendMessage(m.chat, {
			react: {
				text: '⏳',
				key: m.key
			}
		})
		if (/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/gi.test(args[0])) {
			if (/^.*tiktok/i.test(args[0])) {
				try {
					a = (await axios.get(API('ghst', 'api/tiktok', {
						url: args[0]
					}, 'key'))).data
					console.log(a)
					if (a.status) {
						m.reply(work)
						return (await conn.sendFile(m.chat, a.download.video.no_wm.url, "", require('util').format({
							author: a.author.nickname,
							music: a.download.audio.url,
							with_watermark: a.download.video.with_wm.url,
							source: text
						}), m))
					} else if (a.status == 403) {
						return (m.reply(require('util').format({
							status: 403,
							msg: 'invalid Key'
						})))
					} else {
						return (m.reply(error))
					}
				} catch (e) {
					if (e.response) {
						console.log(e.response.data)
						return (m.reply(require('util').format({
							status: e.response.status,
							msg: e.response.data.info ? e.response.data.info : e.response.data.message
						})))
					} else {
						console.log(e)
						return (m.reply(require('util').format({
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
						return (await conn.sendFile(m.chat, a.data.sd.url, "", require('util').format({
							title: a.data.meta.title,
							quality: 'SD',
							hd_download: a.data.hd.url,
							source: text
						}), m))
					} else if (a.status == 403) {
						return (m.reply(require('util').format({
							status: 403,
							msg: 'invalid Key'
						})))
					} else {
						return (m.reply(error))
					}
				} catch (e) {
					if (e.response) {
						console.log(e.response.data)
						return (m.reply(require('util').format({
							status: e.response.status,
							msg: e.response.data.info ? e.response.data.info : e.response.data.message
						})))
					} else {
						console.log(e)
						return (m.reply(require('util').format({
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
						for (var {
								url,
								thumbnail
							} of a.data) {
							await delay(900)
							conn.sendFile(m.sender, url, "", "", m, 0, {
								asDocument: true
							})
						}
					} else if (a.status == 403) {
						return (m.reply(require('util').format({
							status: 403,
							msg: 'invalid Key'
						})))
					} else {
						return (m.reply(error))
					}
				} catch (e) {
					if (e.response) {
						console.log(e.response.data)
						return (m.reply(require('util').format({
							status: e.response.status,
							msg: e.response.data.info ? e.response.data.info : e.response.data.message
						})))
					} else {
						console.log(e)
						return (m.reply(require('util').format({
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
						return (await conn.sendFile(m.chat, a.data.player.url, a.data.meta.title + ".mp3", "", m, null, {
							asDocument: true
						}))
					} else if (a.status == 403) {
						return (m.reply(require('util').format({
							status: 403,
							msg: 'invalid Key'
						})))
					} else {
						return (m.reply(error))
					}
				} catch (e) {
					if (e.response) {
						console.log(e.response.data)
						return (m.reply(require('util').format({
							status: e.response.status,
							msg: e.response.data.info ? e.response.data.info : e.response.data.message
						})))
					} else {
						console.log(e)
						return (m.reply(require('util').format({
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
						return (await conn.sendFile(m.chat, a.data.url[0].url, "", require('util').format({
							title: a.data.meta.title,
							source: text
						}), m))
					} else if (a.status == 403) {
						return (m.reply(require('util').format({
							status: 403,
							msg: 'invalid Key'
						})))
					} else {
						return (m.reply(error))
					}
				} catch (e) {
					if (e.response) {
						console.log(e.response.data)
						return (m.reply(require('util').format({
							status: e.response.status,
							msg: e.response.data.info ? e.response.data.info : e.response.data.message
						})))
					} else {
						console.log(e)
						return (m.reply(require('util').format({
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
						return (await conn.sendFile(m.chat, a.data.link, a.data.nama, "", m, null, {
							asDocument: true
						}))
					} else if (a.status == 403) {
						return (m.reply(require('util').format({
							status: 403,
							msg: 'invalid Key'
						})))
					} else {
						return (m.reply(error))
					}
				} catch (e) {
					if (e.response) {
						console.log(e.response.data)
						return (m.reply(require('util').format({
							status: e.response.status,
							msg: e.response.data.info ? e.response.data.info : e.response.data.message
						})))
					} else {
						console.log(e)
						return (m.reply(require('util').format({
							status: 500,
							msg: `ada yang error silahkan lapor ke Admin @${nomorown}`
						}), null, {
							mentions: [nomorown + `@s.whatsapp.net`]
						}))
					}
				}
			} else if (rx.test(args[0])) {
				if (!args[1]) return (m.reply(`*untuk link youtube gunakan format command seperti ini*\n*${_p+command} link type*\n\n*contoh: ${_p+command} ${args[0]} mp3*\n*Accepted type: mp3, mp4*`))
				if (!['mp3', 'mp4'].includes(args[1])) return (m.reply(`invalid type\nOnly Accepted mp3 or mp4`))
				try {
					a = (await axios.get(API('ghst', 'api/sosmed', {
						url: args[0]
					}, 'key'))).data
					//console.log(a.data.result)
					var data, isLimit, data2
					if (a.status) {
						if (args[1].includes('mp3')) {
							if (a.data.result.audio_length > 1) {
								data = a.data.result.audio.shift()
								isLimit = data.fileLength > (isPrems || isOwner ? 99 : 20) * 1048576
								log(isLimit)
								if (!isLimit) {
									m.reply(work)
									log({
										data
									})
									return (await conn.sendFile(m.chat, data.url, a.data.details.title + '.mp3', "", m, null, {
										asDocument: true,
										contextInfo: {
											externalAdReply: {
												mediaType: 2,
												description: 'anu',
												title: a.data.details.title,
												mediaUrl: args[0],
												body: author,
												thumbnail: await getbuffer(a.data.details.thumbnail.url),
												sourceUrl: gc,
												showAdAttribution: true, // false
												//renderLargerThumbnail: true // false
											}
										}
									}))
								} else {
									log({
										data
									})
									return (m.reply(`File Melebihi limit user free\n\t\t\t*Limit*\n*USER FREE:* 20mb\n*USER PREMIUM:* 99mb\n*📍Title:* ${a.data.details.title}\n*🔗Link:* ${data.url}\n*quality:* ${data.quality}\n${!(a.data.details.shortDescription) ? "": "\n*📜Description:* " + a.data.details.shortDescription }`))
								}
							}
						} else {
							if (a.data.result.video_length > 1) {
								data = a.data.result.video.pop()
								isLimit = (data.fileLength !== null) ? data.fileLength : (await axios.get(data.url)).headers['content-length'] > (isPrems || isOwner ? 99 : 20) * 1048576
								if (isLimit) {
									data2 = a.data.result.video.shift()
									isLimit = (data2.fileLength !== null) ? data2.fileLength : (await axios.get(data2.url)).headers['content-length'] > (isPrems || isOwner ? 99 : 20) * 1048576
									if (!isLimit) {
										m.reply(work)
										log({
											data2
										})
										return (await conn.sendFile(m.chat, data2.url, a.data.details.title + '.mp4', "", m, null, {
											asDocument: true,
											contextInfo: {
												externalAdReply: {
													mediaType: 2,
													description: 'anu',
													title: a.data.details.title,
													mediaUrl: args[0],
													body: author,
													thumbnail: await getbuffer(a.data.details.thumbnail.url),
													sourceUrl: gc,
													showAdAttribution: true, // false
													//renderLargerThumbnail: true // false
												}
											}
										}))
									} else {
										log({
											data2
										})
										return (m.reply(`File Melebihi limit user free\n\t\t\t*Limit*\n*USER FREE:* 20mb\n*USER PREMIUM:* 99mb\n*📍Title:* ${a.data.details.title}\n*🔗Link:* ${data2.url}\n*quality:* ${data2.quality}\n${!(a.data.details.shortDescription) ? "": "\n*📜Description:* " + a.data.details.shortDescription }`))
									}
								} else {
									m.reply(work)
									log({
										data
									})
									return (await conn.sendFile(m.chat, data.url, a.data.details.title + '.mp4', "", m, null, {
										asDocument: true,
										contextInfo: {
											externalAdReply: {
												mediaType: 2,
												description: 'anu',
												title: a.data.details.title,
												mediaUrl: args[0],
												body: author,
												thumbnail: await getbuffer(a.data.details.thumbnail.url),
												sourceUrl: gc,
												showAdAttribution: true, // false
												//renderLargerThumbnail: true // false
											}
										}
									}))
								}
							} else {
								data = a.data.result.video.shift()
								isLimit = (data.fileLength !== null) ? data.fileLength : (await axios.get(data.url)).headers['content-length'] > (isPrems || isOwner ? 99 : 20) * 1048576
								if (!isLimit) {
									m.reply(work)
									log({
										data
									})
									return (await conn.sendFile(m.chat, data.url, a.data.details.title + '.mp4', "", m, null, {
										asDocument: true,
										contextInfo: {
											externalAdReply: {
												mediaType: 2,
												description: 'anu',
												title: a.data.details.title,
												mediaUrl: args[0],
												body: author,
												thumbnail: await getbuffer(a.data.details.thumbnail.url),
												sourceUrl: gc,
												showAdAttribution: true, // false
												//renderLargerThumbnail: true // false
											}
										}
									}))
								} else {
									log({
										data
									})
									return (m.reply(`File Melebihi limit user free\n\t\t\t*Limit*\n*USER FREE:* 20mb\n*USER PREMIUM:* 99mb\n*📍Title:* ${a.data.details.title}\n*🔗Link:* ${data.url}\n*quality:* ${data.quality}\n${!(a.data.details.shortDescription) ? "": "\n*📜Description:* " + a.data.details.shortDescription }\n`))
								}
							}
						}
					} else if (a.status == 403) {
						return (m.reply(require('util').format({
							status: 403,
							msg: 'invalid Key'
						})))
					} else {
						return (m.reply(error))
					}
				} catch (e) {
					if (e.response) {
						console.log(e.response.data)
						return (m.reply(require('util').format({
							status: e.response.status,
							msg: e.response.data.info ? e.response.data.info : e.response.data.message
						})))
					} else {
						console.log(e)
						return (m.reply(require('util').format({
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
						return (m.reply(require('util').format(a)))
					} else {
						isLimit = (await axios.get(encodeURIComponent(a.url))).headers['content-length'] > (isPrems || isOwner ? 99 : 20) * 1048576
						if (isLimit) {
							return (m.reply(`File Melebihi limit user free\n\t\t\t*Limit*\n*USER FREE:* 20mb\n*USER PREMIUM:* 99mb\n*📍Title:* ${a.name}\n*🔗Link:* ${a.url}`))
						} else {
							m.reply(work)
							return (await conn.sendFile(m.chat, a.url, a.name, "", m, null, {
								asDocument: true
							}))
						}
					}
				} catch (e) {
					log(e)
					return (m.reply(require('util').format({
						status: 500,
						msg: `ada yang error silahkan lapor ke Admin @${nomorown}`
					}), null, {
						mentions: [nomorown + `@s.whatsapp.net`]
					}))
				}
			} else {
				throw '*link yang kamu berikan di dukung.*\n\nhanya mendukung link dari\n\n1. tiktok\n2. zippyshare\n3. YouTube\n4. Instagram\n5. facebook\n6. twitter\n7. SoundCloud\n8. mediafire'
			}
		} else {
			var [query, format] = text.split(/[&|.]/i)
			/*if (!format) {
				m.reply('default search: mp3\ngunakan format seperti ini jika ingin menggunakan format mp3 atau mp4\n' + _p + command + ' query|format\ncontoh: ' + _p + command + ' ya sudahlah LHNTRX|mp4')
			}*/
			await delay(2000)
			/*if (!format) {
				format = 'mp3'
			}*/
			try {
				a = (await axios.get(API('ghst', 'api/sosmed', {
					url: query
				}, 'key'))).data
				console.log(a)
				if (a.status) {
					var rows = []
					for (var i of a.data) {
						rows.push({
							title: i.title,
							description: `*[ MP3 - Cʜᴀɴɴᴇʟ: ${i.owner.channel} - Vɪᴇᴡꜱ: ${i.views} ]*`,
							rowId: _p + command + " " + i.browse + " mp3"
						}, {
							title: i.title,
							description: `*[ MP4 - Cʜᴀɴɴᴇʟ: ${i.owner.channel} - Vɪᴇᴡꜱ: ${i.views} ]*`,
							rowId: _p + command + " " + i.browse + " mp4"
						})
					}
					var sendMsg = await conn.sendMessage(m.chat, {
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
					return (await conn.sendMessage(m.chat, {
						delete: sendMsg.key
					}))
				} else if (a.status == 403) {
					return (m.reply(require('util').format({
						status: 403,
						msg: 'invalid Key'
					})))
				} else {
					return (m.reply(error))
				}
			} catch (e) {
				if (e.response) {
					console.log(e.response.data)
					return (m.reply(require('util').format({
						status: e.response.status,
						msg: e.response.data.info ? e.response.data.info : e.response.data.message
					})))
				} else {
					console.log(e)
					return (m.reply(require('util').format({
						status: 500,
						msg: `ada yang error silahkan lapor ke Admin @${nomorown}`
					}), null, {
						mentions: [nomorown + `@s.whatsapp.net`]
					}))
				}
			}
		}
	} else if (command == 'play') {
		if (m.isGroup) {
			return m.reply('gunakan di private chat aja')
		}
		var query = text
		try {
			a = (await axios.get(API('ghst', 'api/sosmed', {
				url: query
			}, 'key'))).data
			console.log(a)
			if (a.status) {
				var rnd = a.data[Math.floor(Math.random() * a.data.length)]
				var sendMsg = await conn.sendButton(m.chat, `𓅜 *Y T  P L A Y* 𓅜\n\n*t i t l e*: ${rnd.title}\n*s o u r c e*: ${rnd.browse}\n*p u b l i s h e d*: ${rnd.published}\n*v i e w s*: ${rnd.views}\n*d u r a t i o n*: ${rnd.duration}\n*c h a n n e l*: ${rnd.owner.channel}`, `𓅜 *y t  p l a y* 𓅜`, rnd.thumbnail.url, [
					['audio', '.download ' + rnd.browse + ' mp3'],
					['video', '.download ' + rnd.browse + ' mp4']
				], m)
				await delay(60000)
				return (await conn.sendMessage(m.chat, {
					delete: sendMsg.key
				}))
			} else if (a.status == 403) {
				return (m.reply(require('util').format({
					status: 403,
					msg: 'invalid Key'
				})))
			} else {
				return (m.reply(error))
			}
		} catch (e) {
			if (e.response) {
				console.log(e.response.data)
				return (m.reply(require('util').format({
					status: e.response.status,
					msg: e.response.data.info ? e.response.data.info : e.response.data.message
				})))
			} else {
				console.log(e)
				return (m.reply(require('util').format({
					status: 500,
					msg: `ada yang error silahkan lapor ke Admin @${nomorown}`
				}), null, {
					mentions: [nomorown + `@s.whatsapp.net`]
				}))
			}
		}
	} else {
		var query = text
		try {
			a = (await axios.get(API('ghst', 'api/sosmed', {
				url: query
			}, 'key'))).data
			console.log(a)
			if (a.status) {
				var rows = []
				for (var i of a.data) {
					rows.push({
						title: i.title,
						description: `*[ MP3 - Cʜᴀɴɴᴇʟ: ${i.owner.channel} - Vɪᴇᴡꜱ: ${i.views} ]*`,
						rowId: _p + "download " + i.browse + " mp3"
					}, {
						title: i.title,
						description: `*[ MP4 - Cʜᴀɴɴᴇʟ: ${i.owner.channel} - Vɪᴇᴡꜱ: ${i.views} ]*`,
						rowId: _p + "download " + i.browse + " mp4"
					})
				}
				var sendMsg = await conn.sendMessage(m.chat, {
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
				return (await conn.sendMessage(m.chat, {
					delete: sendMsg.key
				}))
			} else if (a.status == 403) {
				return (m.reply(require('util').format({
					status: 403,
					msg: 'invalid Key'
				})))
			} else {
				return (m.reply(error))
			}
		} catch (e) {
			if (e.response) {
				console.log(e.response.data)
				return (m.reply(require('util').format({
					status: e.response.status,
					msg: e.response.data.info ? e.response.data.info : e.response.data.message
				})))
			} else {
				console.log(e)
				return (m.reply(require('util').format({
					status: 500,
					msg: `ada yang error silahkan lapor ke Admin @${nomorown}`
				}), null, {
					mentions: [nomorown + `@s.whatsapp.net`]
				}))
			}
		}
	}
}
handler.help = ['download *url* or *query*', 'play *query*', 'ytplay *query*', 'ytsearch *query*']
handler.tags = ['downloader']
handler.command = ['download', 'play', 'ytplay', 'ytsearch']
handler.limit = true
module.exports = handler
