import fetch from 'node-fetch';
import {
	FormData,
	Blob
} from 'formdata-node';
import {
	JSDOM
} from 'jsdom';
/**
 * 
 * @param {Buffer|String} source 
 */
async function webp2mp4(source) {
	var form = new FormData()
	var isUrl = typeof source === 'string' && /https?:\/\//.test(source)
	var blob = !isUrl && new Blob([source.toArrayBuffer()])
	form.append('new-image-url', isUrl ? blob : '')
	form.append('new-image', isUrl ? '' : blob, 'image.webp')
	var res = await fetch('https://s6.ezgif.com/webp-to-mp4', {
		method: 'POST',
		body: form
	})
	var html = await res.text()
	var {
		document
	} = new JSDOM(html).window
	var form2 = new FormData()
	var obj = {}
	for (var input of document.querySelectorAll('form input[name]')) {
		obj[input.name] = input.value
		form2.append(input.name, input.value)
	}
	var res2 = await fetch('https://ezgif.com/webp-to-mp4/' + obj.file, {
		method: 'POST',
		body: form2
	})
	var html2 = await res2.text()
	var {
		document: document2
	} = new JSDOM(html2).window
	return new URL(document2.querySelector('div#output > p.outfile > video > source').src, res2.url).toString()
}

async function webp2png(source) {
	var form = new FormData()
	var isUrl = typeof source === 'string' && /https?:\/\//.test(source)
	var blob = !isUrl && new Blob([source.toArrayBuffer()])
	form.append('new-image-url', isUrl ? blob : '')
	form.append('new-image', isUrl ? '' : blob, 'image.webp')
	var res = await fetch('https://s6.ezgif.com/webp-to-png', {
		method: 'POST',
		body: form
	})
	var html = await res.text()
	var {
		document
	} = new JSDOM(html).window
	var form2 = new FormData()
	var obj = {}
	for (var input of document.querySelectorAll('form input[name]')) {
		obj[input.name] = input.value
		form2.append(input.name, input.value)
	}
	var res2 = await fetch('https://ezgif.com/webp-to-png/' + obj.file, {
		method: 'POST',
		body: form2
	})
	var html2 = await res2.text()
	var {
		document: document2
	} = new JSDOM(html2).window
	return new URL(document2.querySelector('div#output > p.outfile > img').src, res2.url).toString()
}

export {
	webp2mp4,
	webp2png
}