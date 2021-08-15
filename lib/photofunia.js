const axios = require('axios')
const fetch = require('node-fetch')
const FormData = require('form-data')
const cheerio = require("cheerio")
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

const photofunUse = async (url, teks) => {
var emror = { 

"error" : "Link Tidak Valid"

 }
if (!url.includes(base)) return emror
let form = new FormData()
form.append("text", teks)
let post = await fetch(url, { method: "POST", headers: { "User-Agent": "GoogleBot", ...form.getHeaders(), }, body: form.getBuffer(), } )
let html = await post.text()
var $ = cheerio.load(html)
let gambar = $('div.image-container').find('img').attr('src')
return gambar
}

const dafontSearch = async (query) => {
const base = `https://www.dafont.com`

const res = await axios.get(`${base}/search.php?q=${query}`)

const $ = cheerio.load(res.data)
const hasil = []
const total = $('div.dffont2').text().replace(` fonts on DaFont for ${query}`, '') 

$('div').find('div.container > div > div.preview').each(function(a, b) {

$('div').find('div.container > div > div.lv1left.dfbg').each(function(c, d) { 

$('div').find('div.container > div > div.lv1right.dfbg').each(function(e, f) { 

let link = `${base}/` + $(b).find('a').attr('href')
let judul = $(d).text() 
let style = $(f).text() 
hasil.push({ judul, style, link, total}) 
}) 
}) 
}) 
return hasil
}

const dafontDown = async (link) => {
const des = await axios.get(link)
const sup = cheerio.load(des.data)
const result = []
let style = sup('div').find('div.container > div > div.lv1right.dfbg').text() 

let judul = sup('div').find('div.container > div > div.lv1left.dfbg').text() 

try {
isi = sup('div').find('div.container > div > span').text().split('.ttf')
output = sup('div').find('div.container > div > span').eq(0).text().replace('ttf' , 'zip')
} catch {
isi = sup('div').find('div.container > div > span').text().split('.otf')
output = sup('div').find('div.container > div > span').eq(0).text().replace('otf' , 'zip')
}

let down = 'http:' + sup('div').find('div.container > div > div.dlbox > a').attr('href')
result.push({ style, judul, isi, output, down})
return result
}
module.exports = { photofunSearch, photofunEffect, photofunUse, dafontSearch, dafontDown }
