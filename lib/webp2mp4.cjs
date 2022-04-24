const axios = require("axios");
const {
	JSDOM
} = require('jsdom')

async function webp2mp4(source) {
	let form = new require("form-data")()
	let isUrl = typeof source === 'string' && /https?:\/\//.test(source)
	form.append('new-image-url', isUrl ? source : '')
	form.append('new-image', isUrl ? '' : source, 'image.webp')
	var res = await axios.request("https://s6.ezgif.com/webp-to-mp4", {
		method: "POST",
		data: form.getBuffer(),
		headers: {
			...form.getHeaders()
		}
	})
	let {
		document
	} = new JSDOM(res.data).window
	let obj = {}
	let form2 = new require('form-data')()
	for (let input of document.querySelectorAll('form input[name]')) {
		obj[input.name] = input.value
		form2.append(input.name, input.value)
	}
	var res2 = await axios.request('https://ezgif.com/webp-to-mp4/' + obj.file, {
		method: "POST",
		data: form2.getBuffer(),
		headers: {
			...form2.getHeaders()
		}
	})
	akhir = require("cheerio").load(res2.data)
	return "https:" + akhir("p.outfile > video > source").attr("src")
}

async function webp2png(source) {
	let form = new require("form-data")()
	let isUrl = typeof source === 'string' && /https?:\/\//.test(source)
	form.append('new-image-url', isUrl ? source : '')
	form.append('new-image', isUrl ? '' : source, 'image.webp')
	var res = await axios.request("https://s6.ezgif.com/webp-to-png", {
		method: "POST",
		data: form.getBuffer(),
		headers: {
			...form.getHeaders()
		}
	})
	let {
		document
	} = new JSDOM(res.data).window
	let obj = {}
	let form2 = new require('form-data')()
	for (let input of document.querySelectorAll('form input[name]')) {
		obj[input.name] = input.value
		form2.append(input.name, input.value)
	}
	var res2 = await axios.request('https://ezgif.com/webp-to-png/' + obj.file, {
		method: "POST",
		data: form2.getBuffer(),
		headers: {
			...form2.getHeaders()
		}
	})
	akhir = require("cheerio").load(res2.data)
	return "https:" + akhir("p.outfile > img").attr("src")
}
if (require.main === module) {
	// TODO: Test
	webp2mp4('https://mathiasbynens.be/demo/animated-webp-supported.webp').then(console.error)
	webp2png('https://mathiasbynens.be/demo/animated-webp-supported.webp').then(console.error)
} else {
	module.exports = {
		webp2mp4,
		webp2png
	}
}