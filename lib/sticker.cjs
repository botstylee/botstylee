var fs = require('fs')
var path = require('path')
var crypto = require('crypto')
var fetch = (...args) => import('node-fetch').then(({
	default: fetch
}) => fetch(...args));
var {
	ffmpeg
} = require('./converter.cjs')
var {
	spawn
} = require('child_process')
var uploadFile = require('./uploadFile.cjs')
var {
	fileTypeFromBuffer
} = import('file-type')
var uploadImage = require('./uploadImage.cjs')

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
				img = (await res.arrayBuffer()).toBuffer()
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
	var image = (await res.arrayBuffer()).toBuffer()
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
	return (await res.arrayBuffer()).toBuffer()
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
		img = (await res.arrayBuffer()).toBuffer()
	}
	return await ffmpeg(img, [
		'-vf', 'scale=512:512:flags=lanczos:force_original_aspect_ratio=decrease,format=rgba,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=#00000000,setsar=1'
	], 'jpeg', 'webp')
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
	var {
		Image
	} = require('node-webpmux') // Optional Feature
	var img = new Image();
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

module.exports = {
	/**
	 * Image/Video to Sticker
	 * @param {Buffer} img Image/Video Buffer
	 * @param {String} url Image/Video URL
	 * @param {...String} 
	 */
	async sticker(img, url, ...args) {
		var lastError
		for (var func of [
				sticker3,
				this.support.ffmpeg && this.support.ffmpegWebp && sticker4,
				this.support.ffmpeg && (this.support.convert || this.support.magick || this.support.gm) && sticker2,
				sticker1
			].filter(f => f)) {
			try {
				var stiker = await func(img, url, ...args)
				if (stiker.includes('RIFF')) {
					try {
						return await addExif(stiker, ...args)
					} catch (e) {
						return stiker
					}
				}
				throw stiker.toString()
			} catch (err) {
				lastError = err
			}
		}
		throw lastError
	},
	sticker1,
	sticker2,
	sticker3,
	sticker4,
	addExif,
	support: {
		ffmpeg: true,
		ffprobe: true,
		ffmpegWebp: true,
		convert: true,
		magick: false,
		gm: false,
	},
}