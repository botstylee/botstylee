const axios = require('axios')
const fetch = require('node-fetch')
const FormData = require('form-data')

const base = `https://m.photofunia.com`
const photofunSearch = async(teks) => {
var res = await axios.get(`${base}/search?q=${teks}`)
var $ = cheerio.load(res.data) 
var hasil = []
$('ul > li > a.effect').each(function(a, b) {
let judul = $(b).find('span > span.name').text().replace('\n         ', '').replace('      ', '') 
let desc = $(b).find('span > span.description').text()
let thumb = $(b).find('img').attr('src') 
let link = 'https://m.photofunia.com' + $(b).attr('href') 
hasil.push({ judul, desc, thumb, link}) 
}) 
return hasil
}

const photofunEffect = async(url) => {
var emror = { 

"error" : "Link Tidak Valid"

 }
if (!url.includes(base)) return emror
var res = await axios.get(url)
var $ = cheerio.load(res.data)
var hasil = []
var inputs = []
let exam = $('div > div.image-preview > a > img').attr('src')
let judul = $('div > h2').text() 
$('form > div >  input').each(function(a, b) {
let input = $(b).attr('name')
inputs.push({ input }) 
}) 
let desc = $('div.description').text() 
hasil.push({ judul, desc, exam, inputs }) 
return hasil
}

module.exports = { photofunSearch, photofunEffect }
