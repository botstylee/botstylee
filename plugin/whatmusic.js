let fs = require('fs')
let acrcloud = require('acrcloud')
let acr = new acrcloud({
	host: 'identify-eu-west-1.acrcloud.com',
	access_key: 'f692756eebf6326010ab8694246d80e7',
	access_secret: 'm2KQYmHdBCthmD7sOTtBExB9089TL7hiAazcUEmb'
})

let handler = async (m) => {
	let q = m.quoted ? m.quoted : m
	let mime = (q.msg || q).mimetype || ''
	if (/audio|video/.test(mime)) {
		let media = await q.download()
		let ext = mime.split('/')[1]
		fs.writeFileSync(`./${m.sender}.${ext}`, media)
		let res = await acr.identify(fs.readFileSync(`./${m.sender}.${ext}`))
		let { code, msg } = res.status
		if (code !== 0) throw msg
		let { title, artists, album, genres, release_date } = res.metadata.music[0]
		let txt = `
*RESULT FOUND*

*• Title:* ${title}
*• Artist:* ${artists !== undefined ? artists.map(v => v.name).join(', ') : ''}
*• Album:* ${album.name || ''}
*• Genres:* ${genres !== undefined ? genres.map(v => v.name).join(', ') : ''}
*• Release Date:* ${release_date}
`.trim()
		fs.unlinkSync(`./${m.sender}.${ext}`)
		await m.reply(txt)
	} else throw 'Reply audio/videonya!'
}
handler.help = ['whatmusic <caption/reply>']
handler.tags = ['tools']
handler.command = /^whatmusic$/i

module.exports = handler