var _$ = require('cheerio')
var _url = require('url')
var _axios = require('axios')
var _math = require('mathjs')

var GetLink = async (u) => {
	var zippy = await _axios({
		method: 'GET',
		url: u
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
	}
}
module.exports = {
	zippy: GetLink
}