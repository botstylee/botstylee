var fs = require('fs');
var path = require('path')
var crypto = require('crypto')
var {
	ffmpeg
} = require('./converter.cjs')
var {
	spawn
} = require('child_process')
var uploadFile = require('./uploadFile.cjs')
var uploadImage = require('./uploadImage.cjs')

var tmp = path.join(__dirname, '../tmp')

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
/**
 * Image to Sticker
 * @param {Buffer} img Image/Video Buffer
 * @param {String} url Image/Video URL
 */
async function stiker(img, url) {
	var {
		fileTypeFromBuffer
	} = await import('file-type')
	if (url) {
		img = await getbuffer(url)
	}
	var {
		ext
	} = await fileTypeFromBuffer(img)
	if (ext == 'mp4') {
		return await ffmpeg(img, [
			`-vcodec`, `libwebp`,
			`-vf`, `scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`
		], 'mp4', 'webp')
	} else {
		return await ffmpeg(img, [
			'-vf', 'scale=512:512:flags=lanczos:force_original_aspect_ratio=decrease,format=rgba,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=#00000000,setsar=1'
		], 'jpeg', 'webp')
	}
}

/**
 * Image to Sticker
 */

module.exports = {
	async sticker(img, ...args) {
		var s
		if (Buffer.isBuffer(img)) s = await stiker(img)
		else s = await stiker(null, img)
		return await addExif(s, ...args)
	},
	addExif
}