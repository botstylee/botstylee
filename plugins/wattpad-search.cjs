async function handler(m, {
	args,
	usedPrefix: _p,
	command,
	text
}) {
	var a, b, c, d
	if(!text) throw 'mau nyari story apa kak?'
	if (command == 'wattpad') {
		try {
			a = (await axios.get(API('ghst', 'api/wpsearch', {
				query: text
			}, 'key'))).data
			b = `Menampilkan hasil pencarian untuk : “${text}”, silahkan pilih judul di bawah ini untuk menampilkan informasi, dan daftar part cerita. 🍟`
			c = []
			for (i of a.stories) {
				d = `[${i.completed ? 'Completed' : 'Ongoing'} | Parts: ${i.numParts} | Reads: ${formatnum(i.readCount).en} | Votes: ${formatnum(i.voteCount).en} | Comment: ${formatnum(i.commentCount).en} | By: ${i.user.name}]`
				c.push([i.title, _p + 'wpdet ' + i.id, d])
			}
			return conn.sendList(m.chat, await tiny('*𓅪 w a t t p a d 𓅪*'), b, wm, await tiny('click!'), [
				[await tiny('list'), c]
			], m)
		} catch (e) {
			if (e.response) {
				console.log(e.response.data)
				return (m.reply(require('util').format({
					status: e.response.status,
					msg: e.response.data.info ? e.response.data.info : e.response.data.message ? e.response.data.message : 'tidak di temukan story dari query tersebut'
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
	} else if (command == 'wpdet') {
		try {
			a = (await axios.get(API('ghst', 'api/wpdetails', {
				id: args[0]
			}, 'key'))).data
			b = `*𓅪 W A T T P A D 𓅪*\n\n• *Title* : ${a.title}\n• *Reads* : ${formatnum(a.readCount).en}\n• *Votes* : ${formatnum(a.voteCount).en}\n• *Parts* : ${formatnum(a.numParts).en}\n• *Author* : ${a.user.name}\n\n*${await tiny(wm)}*`
			c = []
			for (i of a.parts) {
				c.push([i.title, _p + 'wpreads ' + i.id])
			}
			conn.reply(m.chat, b, m, {
				contextInfo: {
					externalAdReply: {
						mediaType: 1,
						//description: 'anu',
						title: '*' + await tiny(wm) + '*',
						//mediaUrl: "https://twitter.com/SatriaDewaSTU/status/1537997558941106176?t=BlAsS934h9SmdSP5ESjkEA&s=19",
						//body: "nickelodon",
						thumbnail: await getbuffer(a.cover),
						sourceUrl: "",
						showAdAttribution: /*true,*/ false,
						renderLargerThumbnail: true // false
					}
				}
			})
			await delay(1000)
				return conn.sendList(m.chat, "", a.description, wm, await tiny('click!'), [
					[await tiny('list'), c]
				], m)
		} catch (e) {
			if (e.response) {
				console.log(e.response.data)
				return (m.reply(require('util').format({
					status: e.response.status,
					msg: e.response.data.info ? e.response.data.info : e.response.data.message ? e.response.data.message : 'tidak di temukan story dari id tersebut'
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
		try {
			a = (await axios.get(API('ghst', 'api/wpreading', {
				id: args[0]
			}, 'key'))).data
			conn.reply(m.chat, a.read, m, {
				contextInfo: {
					externalAdReply: {
						mediaType: 1,
						//description: 'anu',
						title: '*' + await tiny(wm) + '*',
						//mediaUrl: "https://twitter.com/SatriaDewaSTU/status/1537997558941106176?t=BlAsS934h9SmdSP5ESjkEA&s=19",
						//body: "nickelodon",
						thumbnail: a.data.photoUrl ? await getbuffer(a.data.photoUrl) : null,
						sourceUrl: "",
						showAdAttribution: /*true,*/ false,
						renderLargerThumbnail: true // false
					}
				}
			})
		} catch (e) {
			if (e.response) {
				console.log(e.response.data)
				return (m.reply(require('util').format({
					status: e.response.status,
					msg: e.response.data.info ? e.response.data.info : e.response.data.message ? e.response.data.message : 'tidak di temukan story dari id tersebut'
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
handler.help = ['wattpad *query*']
handler.tags = ['wattpad']
handler.command = ['wattpad', 'wpdet', 'wpreads']
module.exports = handler
