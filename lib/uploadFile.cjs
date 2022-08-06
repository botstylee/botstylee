var axios = require('axios')
/**
 * Upload epheremal file to uguu.se
 * `Expired in 1 day`
 * `100MB Max Filesize`
 * @param {Buffer} buffer File Buffer
 */
var uguu = async buffer => {
	var tipe = await import('file-type')
	var {
		ext
	} = await tipe.fileTypeFromBuffer(buffer) || {}
	var form = new require("form-data")()
	form.append("files[]", buffer, 'temp.' + ext)
	var a = await axios.request("https://uguu.se/upload.php", {
		method: "POST",
		data: form.getBuffer(),
		headers: {
			...form.getHeaders(),
			"user-agent": "Mozilla/5.0 (Linux; Android 11; V2038) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.87 Mobile Safari/537.36",
			accept: "*/*",
			Host: "uguu.se",
			origin: "https://uguu.se"
		}
	})
	if (a.status != 200) throw a.statusText
	//console.log(a.data)
	return a.data.files[0].url
}

/**
 * Upload file to fileIo
 * @param {Buffer|ReadableStream|(Buffer|ReadableStream)[]} inp File Buffer/Stream or Array of them
 * @returns {string|null|(string|null)[]}
 */
var fileIO = async buffer => {
	return new Promise(async (reso, reje) => {
		var tipe = await import('file-type');
		var {
			ext,
			mime
		} = await tipe.fileTypeFromBuffer(buffer) || {}
		var blob = new Blob([buffer.toArrayBuffer()], {
			type: mime
		})
		var form = new require("form-data")()
		form.append('file', blob, 'tmp.' + ext)
		form.append("expires", "1d")
		try {
			var a = await axios.request("https://file.io/", {
				method: "POST",
				data: form.getBuffer(),
				headers: {
					...form.getHeaders()
				}
			})
			resolve(a.data.link)
		} catch (e) {
			if (e.response) {
				return reject(e.response.data)
			}
		}
	})
}

module.exports = async function(inp) {
	var err = false
	for (var upload of [uguu, fileIO]) {
		try {
			return await upload(inp)
		} catch (e) {
			err = e
		}
	}
	if (err) throw err
}