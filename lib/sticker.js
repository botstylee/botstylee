import {
	dirname
} from 'path'
import {
	fileURLToPath
} from 'url'
import * as fs from 'fs'
import * as path from 'path'
import * as crypto from 'crypto'
import {
	ffmpeg
} from './converter.js'
import fluent_ffmpeg from 'fluent-ffmpeg'
import {
	spawn
} from 'child_process'
import uploadFile from './uploadFile.js'
import uploadImage from './uploadImage.js'
import {
	fileTypeFromBuffer
} from 'file-type'
import webp from 'node-webpmux'
import fetch from 'node-fetch'

var __dirname = dirname(fileURLToPath(
	import.meta.url))
var tmp = path.join(__dirname, '../tmp')
/**
 * Image to Sticker
 * @param {Buffer} img Image Buffer
 * @param {String} url Image URL
 */
function sticker2(img, url) {
	return new Promise(async (resolve, reject) => {
		try {
			if (url) {
				var res = await fetch(url)
				if (res.status !== 200) throw await res.text()
				img = await res.buffer()
			}
			var inp = path.join(tmp, +new Date + '.jpeg')
			await fs.promises.writeFile(inp, img)
			var ff = spawn('ffmpeg', [
				'-y',
				'-i', inp,
				'-vf', 'scale=512:512:flags=lanczos:force_original_aspect_ratio=decrease,format=rgba,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=#00000000,setsar=1',
				'-f', 'png',
				'-'
			])
			ff.on('error', reject)
			ff.on('close', async () => {
				await fs.promises.unlink(inp)
			})
			var bufs = []
			var [_spawnprocess, ..._spawnargs] = [...(module.exports.support.gm ? ['gm'] : module.exports.magick ? ['magick'] : []), 'convert', 'png:-', 'webp:-']
			var im = spawn(_spawnprocess, _spawnargs)
			im.on('error', e => conn.reply(m.chat, util.format(e), m))
			im.stdout.on('data', chunk => bufs.push(chunk))
			ff.stdout.pipe(im.stdin)
			im.on('exit', () => {
				resolve(Buffer.concat(bufs))
			})
		} catch (e) {
			reject(e)
		}
	})
}

async function canvas(code, type = 'png', quality = 0.92) {
	var res = await fetch('https://nurutomo.herokuapp.com/api/canvas?' + queryURL({
		type,
		quality
	}), {
		method: 'POST',
		headers: {
			'Content-Type': 'text/plain',
			'Content-Length': code.length
		},
		body: code
	})
	var image = await res.buffer()
	return image
}

function queryURL(queries) {
	return new URLSearchParams(Object.entries(queries))
}

/**
 * Image to Sticker
 * @param {Buffer} img Image Buffer
 * @param {String} url Image URL
 */
async function sticker1(img, url) {
	url = url ? url : await uploadImage(img)
	var {
		mime
	} = url ? {
		mime: 'image/jpeg'
	} : await fileTypeFromBuffer(img)
	var sc = `var im = await loadImg('data:${mime};base64,'+(await window.loadToDataURI('${url}')))
c.width = c.height = 512
var max = Math.max(im.width, im.height)
var w = 512 * im.width / max
var h = 512 * im.height / max
ctx.drawImage(im, 256 - w / 2, 256 - h / 2, w, h)
`
	return await canvas(sc, 'webp')
}

/**
 * Image/Video to Sticker
 * @param {Buffer} img Image/Video Buffer
 * @param {String} url Image/Video URL
 * @param {String} packname EXIF Packname
 * @param {String} author EXIF Author
 */
async function sticker3(img, url, packname, author) {
	url = url ? url : await uploadFile(img)
	var res = await fetch('https://api.xteam.xyz/sticker/wm?' + new URLSearchParams(Object.entries({
		url,
		packname,
		author
	})))
	return await res.buffer()
}

/**
 * Image to Sticker
 * @param {Buffer} img Image/Video Buffer
 * @param {String} url Image/Video URL
 */
async function sticker4(img, url) {
	if (url) {
		var res = await fetch(url)
		if (res.status !== 200) throw await res.text()
		img = await res.buffer()
	}
	return await ffmpeg(img, [
		'-vf', 'scale=512:512:flags=lanczos:force_original_aspect_ratio=decrease,format=rgba,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=#00000000,setsar=1'
	], 'jpeg', 'webp')
}

async function sticker5(img, url, packname, author, categories = [''], extra = {}) {
	var {
		Sticker
	} = await import('wa-sticker-formatter')
	var stickerMetadata = {
		type: 'default',
		pack: packname,
		author,
		categories,
		...extra
	}
	return (new Sticker(img ? img : url, stickerMetadata)).toBuffer()
}

/**
 * Convert using fluent-ffmpeg
 * @param {string} img 
 * @param {string} url 
 */
function sticker6(img, url) {
	return new Promise(async (resolve, reject) => {
		if (url) {
			var res = await fetch(url)
			if (res.status !== 200) throw await res.text()
			img = await res.buffer()
		}
		var type = await fileTypeFromBuffer(img) || {
			mime: 'application/octet-stream',
			ext: 'bin'
		}
		if (type.ext == 'bin') reject(img)
		var tmp = path.join(__dirname, `../tmp/${+ new Date()}.${type.ext}`)
		var out = path.join(tmp + '.webp')
		await fs.promises.writeFile(tmp, img)
		// https://github.com/MhankBarBar/termux-wabot/blob/main/index.js#L313#L368
		var Fffmpeg = /video/i.test(type.mime) ? fluent_ffmpeg(tmp).inputFormat(type.ext) : fluent_ffmpeg(tmp).input(tmp)
		Fffmpeg
			.on('error', function(err) {
				console.error(err)
				fs.promises.unlink(tmp)
				reject(img)
			})
			.on('end', async function() {
				fs.promises.unlink(tmp)
				resolve(await fs.promises.readFile(out))
			})
			.addOutputOptions([
				`-vcodec`, `libwebp`, `-vf`,
				`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`
			])
			.toFormat('webp')
			.save(out)
	})
}
/**
 * Add WhatsApp JSON Exif Metadata
 * Taken from https://github.com/pedroslopez/whatsapp-web.js/pull/527/files
 * @param {Buffer} webpSticker 
 * @param {String} packname 
 * @param {String} author 
 * @param {String} categories 
 * @param {Object} extra 
 * @returns 
 */
async function addExif(webpSticker, packname, author, categories = [''], extra = {}) {
	var img = new webp.Image();
	var stickerPackId = crypto.randomBytes(32).toString('hex');
	var json = {
		'sticker-pack-id': stickerPackId,
		'sticker-pack-name': packname,
		'sticker-pack-publisher': author,
		'emojis': categories,
		...extra
	};
	var exifAttr = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00]);
	var jsonBuffer = Buffer.from(JSON.stringify(json), 'utf8');
	var exif = Buffer.concat([exifAttr, jsonBuffer]);
	exif.writeUIntLE(jsonBuffer.length, 14, 4);
	await img.load(webpSticker)
	img.exif = exif
	return await img.save(null)
}

/**
 * Image/Video to Sticker
 * @param {Buffer} img Image/Video Buffer
 * @param {String} url Image/Video URL
 * @param {...String} 
 */
async function sticker(img, url, ...args) {
	var lastError, stiker
	for (var func of [
			sticker3, global.support.ffmpeg && sticker6, sticker5,
			global.support.ffmpeg && global.support.ffmpegWebp && sticker4,
			global.support.ffmpeg && (global.support.convert || global.support.magick || global.support.gm) && sticker2,
			sticker1
		].filter(f => f)) {
		try {
			stiker = await func(img, url, ...args)
			if (stiker.includes('WEBP')) {
				try {
					return await addExif(stiker, ...args)
				} catch (e) {
					console.error(e)
					return stiker
				}
			}
			if (stiker.includes('html')) continue
			throw stiker.toString()
		} catch (err) {
			lastError = err
			continue
		}
	}
	console.error(lastError)
	return lastError
}

var support = {
	ffmpeg: true,
	ffprobe: true,
	ffmpegWebp: true,
	convert: true,
	magick: false,
	gm: false,
	find: false
}

export {
	sticker,
	sticker1,
	sticker2,
	sticker3,
	sticker4,
	sticker6,
	addExif,
	support
}