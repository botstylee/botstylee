var handler = async (m, { conn, usedPrefix, command }) => {
	var quoted = m.quoted || m
	var mime = (quoted.msg || quoted).mimetype || quoted.mediaType || ''
	if (!/video|audio/.test(mime)) throw `Balas audio/video dengan perintah ${usedPrefix + command}.`
	if (!process.env.ACRCLOUD_ACCESS_KEY || !process.env.ACRCLOUD_ACCESS_SECRET) throw 'Fitur identifikasi musik belum dikonfigurasi: set ACRCLOUD_ACCESS_KEY dan ACRCLOUD_ACCESS_SECRET.'
	var buffer = await quoted.download?.()
	if (!buffer) throw 'Media tidak dapat diunduh.'
	var acrcloud = require('acrcloud')
	var acr = new acrcloud({ host: process.env.ACRCLOUD_HOST || 'identify-eu-west-1.acrcloud.com', access_key: process.env.ACRCLOUD_ACCESS_KEY, access_secret: process.env.ACRCLOUD_ACCESS_SECRET })
	await m.reply('Sedang mengenali musik, mohon tunggu...')
	var { status, metadata } = await acr.identify(buffer)
	var track = metadata?.music?.[0]
	if (status?.code !== 0 || !track) throw status?.msg || 'Musik tidak ditemukan.'
	var details = [`*Judul:* ${track.title || 'Tidak diketahui'}`]
	if (track.artists?.length) details.push(`*Artis:* ${track.artists.map(artist => artist.name).join(', ')}`)
	if (track.album?.name) details.push(`*Album:* ${track.album.name}`)
	if (track.genres?.length) details.push(`*Genre:* ${track.genres.map(genre => genre.name).join(', ')}`)
	if (track.release_date) details.push(`*Tanggal rilis:* ${track.release_date}`)
	return conn.reply(m.chat, `${details.join('\n')}\n\nUntuk mencari lagu, ketik: ${usedPrefix}play ${track.title || ''}`.trim(), m)
}
handler.help = ['whatmusic']
handler.tags = ['tools']
handler.command = /^(whatmusic)$/i
module.exports = handler
