/**
 * Upload epheremal file to uguu.se
 * `Expired in 1 day`
 * `100MB Max Filesize`
 * @param {Buffer} buffer File Buffer
 */
var {
	Readable
} = require('stream');
var tmp = async buffer => {
	var tipe = await import('file-type');
	var {
		ext,
		mime
	} = await tipe.fileTypeFromBuffer(buffer) || {}
	var form = new former();
	form.append("file", buffer, 'tmp.' + ext)
	try {
		var {
			data
		} = await axios({
			url: "https://tmpfiles.org/api/v1/upload",
			method: "POST",
			headers: {
				...form.getHeaders()
			},
			data: form.getBuffer()

		})
		console.log(data)
		var ew = /https?:\/\/tmpfiles.org\/(.*)/.exec(data.data.url)
		return 'https://tmpfiles.org/dl/' + ew[1]
	} catch (e) {
		throw e
	}
}

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
var uploaded = async (buffer) => {
	var tipe = await import('file-type');
	var {
		ext,
		mime
	} = await tipe.fileTypeFromBuffer(buffer) || {}

	function bufferToStream(Buffer) {
		var readable = new Readable()
		readable._read = () => {} // _read is required but you can noop it
		readable.push(Buffer)
		readable.push(null)
		return readable
	}
	var form = new former();
	form.append('file', buffer, 'tmp.' + ext)
	var {
		data
	} = await axios.request("https://api.anonfiles.com/upload", {
		headers: {
			...form.getHeaders()
		},
		method: 'POST',
		data: form.getBuffer()
	});
	return data.data.file.url.full
}

function telegra(Path) {
	return new Promise(async (resolve, reject) => {
		if (!fs.existsSync(Path)) return reject(new Error("File not Found"))
		try {
			var form = new former();
			form.append("file", fs.createReadStream(Path))
			var data = await axios({
				url: "https://telegra.ph/upload",
				method: "POST",
				headers: {
					...form.getHeaders()
				},
				data: form
			})
			// return resolve(data)
			return resolve("https://telegra.ph" + data.data[0].src)
		} catch (err) {
			return reject(new Error(String(err)))
		}
	})
}

/**
 * Upload file to fileIo
 * @param {Buffer|ReadableStream|(Buffer|ReadableStream)[]} inp File Buffer/Stream or Array of them
 * @returns {string|null|(string|null)[]}
 */
var fileIO = async buffer => {
	return new Promise(async (resolve, reject) => {
		var tipe = await import('file-type');
		var {
			ext,
			mime
		} = await tipe.fileTypeFromBuffer(buffer) || {}
		var form = new former()
		form.append('file', buffer, 'tmp.' + ext)
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
	for (var upload of [tmp, uploaded, fileIO, uguu]) {
		try {
			return await upload(inp)
		} catch (e) {
			err = e
		}
	}
	if (err) throw err
}