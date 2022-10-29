import fetch from 'node-fetch';
import {
	FormData,
	Blob
} from 'formdata-node';
import {
	fileTypeFromBuffer
} from 'file-type'

/**
 * Upload image to telegra.ph
 * Supported mimetype:
 * - `image/jpeg`
 * - `image/jpg`
 * - `image/png`s
 * @param {Buffer} buffer Image Buffer
 * @return {Promise<string>}
 */
export default async buffer => {
	var {
		ext,
		mime
	} = await fileTypeFromBuffer(buffer)
	var form = new FormData()
	var blob = new Blob([buffer.toArrayBuffer()], {
		type: mime
	})
	form.append('file', blob, 'tmp.' + ext)
	var res = await fetch('https://telegra.ph/upload', {
		method: 'POST',
		body: form
	})
	var img = await res.json()
	if (img.error) throw img.error
	return 'https://telegra.ph' + img[0].src
}