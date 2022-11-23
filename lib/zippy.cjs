var _$ = require('cheerio')
var _url = require('url')
var _axios = require('axios')
var _math = require('mathjs')

var GetLink = async (u) => {
/*	var zippy = await _axios({
		method: 'GET',
		url: u,
		headers: {
			//'User-Agent':'Mozilla/5.0 (Linux; Android 12; V2038; Flow) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/367.0.0.299 Mobile Safari/537.36',
			host: new URL(u).host,
			accept: '/'
}
})
var $ = _$.load(zippy.data)
if (!$('#dlbutton').length) {
	return {
		status: zippy.status,
		error: true,
		message: $('#lrbox>div').first().text().trim()
	}
}
var filename0 = $('title').text()
var filename = filename0.replace('Zippyshare.com - ', '')
var url = _url.parse($('.flagen').attr('href'), true)
var urlori = _url.parse(u)
var key = url.query['key']
var time;
var dlurl;
try {
	time = /var b = ([0-9]+);$/gm.exec($('#dlbutton').next().html())[1]
	dlurl = urlori.protocol + '//' + urlori.hostname + '/d/' + key + '/' + (2 + 2 * 2 + parseInt(time)) + '3' + '/' + filename
} catch (error) {
	time = _math.evaluate(/ \+ \((.*)\) \+ /gm.exec($('#dlbutton').next().html())[1])
	dlurl = urlori.protocol + '//' + urlori.hostname + '/d/' + key + '/' + (time) + '/' + filename
}
return {
	status: zippy.status,
	error: false,
	url: dlurl,
	name: filename
}*/
axios.get(urls).then(({
	data
}) => {
	var $ = cheerio.load(data)
	var li = $.html()
	var po = $('#dlbutton').next().html()
	var le = po.split(';')[0]
	var lo = le.split("document.getElementById('dlbutton').href =")[1]
	var result = `${urls.split('/v')[0]}${eval(lo)}`
	var ho = $('#lrbox').text().replace(/\n/g, '')
	var ext = ho.split('Name:')[1].split('Size:')[0].split('.')[1]
	var hasil = {
		name: ho.split('Name:')[1].split('Size:')[0].trim(),
		extension: ext,
		filesize: ho.split('Size:')[1].split('Uploaded:')[0].trim(),
		upload: ho.split('Uploaded:')[1].split('          ')[0].trim(),
		url: result
	}
	return (hasil)
})
}
module.exports = {
	zippy: GetLink
}