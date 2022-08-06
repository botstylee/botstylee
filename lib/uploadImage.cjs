var axios = require("axios");
/**
 * Upload image to uguu.se
 * Supported mimetype:
 * - `image/jpeg`
 * - `image/jpg`
 * - `image/png`s
 * @param {Buffer} buffer Image Buffer
 */
module.exports = async buffer => {
	var tipe = await import('file-type')
	var {
		ext
	} = await tipe.fileTypeFromBuffer(buffer)
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