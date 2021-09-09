/* Scraping Sfile.mobi
*/

const fetch = require("node-fetch");
const cheerio = require("cheerio");
const cookie = require("cookie");
const axios = require("axios");
const FormData = require("form-data");

function sfile(urlnya) {
return new Promise((resolve, reject) => {
let oi =   axios.request({
    url: urlnya,
    method: 'get',
    headers: {
      Accept: 'application/json, text/plain, */*',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }})
            .then(({ data }) => {//console.log(data)
            const $ = cheerio.load(data)
            const link = $('a#download').attr('href')
            let judul = $('div > b').text()
            let uploadet = $('div.list').eq(2).text().replace('\n - Uploaded: ','')
            let total = $('div.list').eq(3).text().replace('\n - Downloads: ','')
            let deskripsi = $('div.list').eq(4).text().replace('\n',' ')
            let res = {
            status: true,
            msg: "Thanks For Using This API",
            result: {
            title: judul,
            tanggal_upload: uploadet,
            total_download: total,
            deskripsi: deskripsi,
            url_download: link }
            }
            resolve({res})
            }).catch(reject)
})
}

module.exports = sfile;

/* sfile("https://sfile.mobi/8z1Gt0tFrUK")
.then(res =>{ console.log(res) }) 
*/
