/* Created by https://github.com/BrunoSobrino */

let limit = 50
let { youtubeSearch, youtubedl, youtubedlv2, youtubedlv3 } = require('@bochilteam/scraper')
let fs = require('fs')

let handler = async (m, { conn, args, isPrems, isOwner, command, text, usedPrefix }) => {
if (!text) throw 'Cari apa?'
let chat = db.data.chats[m.chat]
let vid = (await youtubeSearch(text)).video[0] 
if (!vid) throw 'Video/Audio Tidak ditemukan'
let { videoId } = vid
const url = 'https://www.youtube.com/watch?v=' + videoId  
const { thumbnail, video: _video, title } = await youtubedl(url).catch(async _ => await youtubedlv2(url)).catch(async _ => await youtubedlv3(url))
const limitedSize = (isPrems || isOwner ? 350 : limit) * 3074
let video, source, res, link, lastError, isLimit
for (let i in _video) {
video = _video[i]
isLimit = limitedSize < video.fileSizeH
if (isLimit) continue
link = await video.download()
if (link) res = await fetch(link)
isLimit = res?.headers.get('content-length') && parseInt(res.headers.get('content-length')) < limitedSize
if (isLimit) continue
if (res) source = await res.arrayBuffer()
if (source instanceof ArrayBuffer) break }
let _thumb = {}
try { _thumb = { thumbnail: await (await fetch(thumbnail)).buffer() } }
catch (e) { }
conn.sendFile(m.chat, link, title + '.mp4', `
*🔥 Title:* ${title}
*📁 File Size:* ${video.fileSizeH}
`.trim(), m, false, {
..._thumb,
asDocument: chat.useDocument
})
}
handler.help = ['play2'].map(v => v + ' <pencarian>')
handler.tags = ['downloader']
handler.command = /^play2?$/i
module.exports = handler
