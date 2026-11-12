var acrcloud = require('acrcloud')
var acr = new acrcloud({
	host: process.env.ACRCLOUD_HOST || 'identify-eu-west-1.acrcloud.com',
	access_key: process.env.ACRCLOUD_ACCESS_KEY || '',
	access_secret: process.env.ACRCLOUD_ACCESS_SECRET || ''
})

var handler = async (m, { conn, usedPrefix, command }) => {
	var q = m.quoted || m
	var mime = (q.msg || q).mimetype || q.mediaType || ''
	if (!/video|audio/.test(mime)) throw `Balas audio/video dengan perintah ${usedPrefix + command}`
	if (!process.env.ACRCLOUD_ACCESS_KEY || !process.env.ACRCLOUD_ACCESS_SECRET) throw 'Fitur identifikasi musik belum dikonfigurasi (ACRCLOUD_ACCESS_KEY / ACRCLOUD_ACCESS_SECRET).'
	var buffer = await q.download?.()
	if (!buffer) throw 'Media tidak dapat diunduh.'
	await m.reply('_Sedang mengenali musik, mohon tunggu..._')
	var { status, metadata } = await acr.identify(buffer)
	if (status?.code !== 0 || !metadata?.music?.length) throw status?.msg || 'Musik tidak ditemukan.'
	var { title, artists, album, genres, release_date } = metadata.music[0]
	var txt = `*Judul:* ${title || 'Tidak diketahui'}${artists?.length ? `\n*Artis:* ${artists.map(item => item.name).join(', ')}` : ''}${album?.name ? `\n*Album:* ${album.name}` : ''}${genres?.length ? `\n*Genre:* ${genres.map(item => item.name).join(', ')}` : ''}${release_date ? `\n*Tanggal rilis:* ${release_date}` : ''}`
	return conn.reply(m.chat, txt, m)
}
handler.help = ['whatmusic']
handler.tags = ['tools']
handler.command = /^(whatmusic)$/i
module.exports = handler
