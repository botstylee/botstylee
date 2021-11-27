let fetch = require('node-fetch')
let axios = require('axios').default
let Formdata = require('form-data')
let { JSDOM } = require('jsdom')

function post(url, formdata) {
  return fetch(url, {
    method: 'POST',
    headers: {
      accept: "*/*",
      'accept-language': "en-US,en;q=0.9",
      'content-type': "application/x-www-form-urlencoded; charset=UTF-8"
    },
    body: new URLSearchParams(Object.entries(formdata))
  })
}
const ytIdRegex = /(?:http(?:s|):\/\/|)(?:(?:www\.|)youtube(?:\-nocookie|)\.com\/(?:shorts\/)?(?:watch\?.*(?:|\&)v=|embed\/|v\/)|youtu\.be\/)([-_0-9A-Za-z]{11})/

/**
 * Download YouTube Video via y2mate
 * @param {String} url YouTube Video URL
 * @param {String} quality (avaiable: `144p`, `240p`, `360p`, `480p`, `720p`, `1080p`, `1440p`, `2160p`)
 * @param {String} type (avaiable: `mp3`, `mp4`)
 * @param {String} bitrate (avaiable for video: `144`, `240`, `360`, `480`, `720`, `1080`, `1440`, `2160`)
 * (avaiable for audio: `128`)
 * @param {String} server (avaiable: `id4`, `en60`, `en61`, `en68`)
 */
async function yt(url, quality, type, bitrate, server = 'en68') {
  if (!ytIdRegex.test(url)) throw 'Invalid URL'
  let ytId = ytIdRegex.exec(url)
  url = 'https://youtu.be/' + ytId[1]
  let res = await post(`https://www.y2mate.com/mates/${server}/analyze/ajax`, {
    url,
    q_auto: 0,
    ajax: 1
  })
  let json = await res.json()
  let { document } = (new JSDOM(json.result)).window
  let tables = document.querySelectorAll('table')
  let table = tables[{ mp4: 0, mp3: 1 }[type] || 0]
  let list
  switch (type) {
    case 'mp4':
      list = Object.fromEntries([...table.querySelectorAll('td > a[href="#"]')].filter(v => !/\.3gp/.test(v.innerHTML)).map(v => [v.innerHTML.match(/.*?(?=\()/)[0].trim(), v.parentElement.nextSibling.nextSibling.innerHTML]))
      break
    case 'mp3':
      list = {
        '128kbps': table.querySelector('td > a[href="#"]').parentElement.nextSibling.nextSibling.innerHTML
      }
      break
    default:
      list = {}
  }
  let filesize = list[quality]
  let id = /var k__id = "(.*?)"/.exec(document.body.innerHTML) || ['', '']
  let thumb = document.querySelector('img').src
  let title = document.querySelector('b').innerHTML
  let res2 = await post(`https://www.y2mate.com/mates/${server}/convert`, {
    type: 'youtube',
    _id: id[1],
    v_id: ytId[1],
    ajax: '1',
    token: '',
    ftype: type,
    fquality: bitrate
  })
  let json2 = await res2.json()
  let KB = parseFloat(filesize) * (1000 * /MB$/.test(filesize))
  return {
    dl_link: /<a.+?href="(.+?)"/.exec(json2.result)[1],
    thumb,
    title,
    filesizeF: filesize,
    filesize: KB
  }
}

const getK = async (url)  => {
    let a = await axios({
        method: 'post',
        url: 'https://yt1s.com/api/ajaxSearch/index',
        data: `q=${url}&vt=home`,
    })
    let b = {
       mp3: a.data.links.mp3.mp3128.k,
       mp4: a.data.links.mp4.auto.k,
       id: a.data.vid, data:{ 
           data: a.data
         }
       }
    return b
}
const search = async (text)  => {
let a = await axios({
        method: 'post',
        url: 'https://yt1s.com/api/ajaxSearch/index',
        data: `q=${text}&vt=home`,
    })
      let b = JSON.parse(JSON.stringify(a.data.items))
	let c = b[Math.floor(Math.random() * b.length)];
    
    let d = await axios({
        method: 'post',
        url: 'https://yt1s.com/api/ajaxSearch/index',
        data: `q=https://youtu.be/${c.v}&vt=home`,
    })
    let e = {
       mp3: d.data.links.mp3.mp3128.k,
       mp4: d.data.links.mp4.auto.k,
       id: d.data.vid, data: { 
          data: d.data 
         }
       }
    return e
}
const ytu = async (k, vid) => {
    var form = new Formdata()
    form.append('vid', vid)
    form.append('k', k)

    var config = {
        method: 'post',
        url: 'https://yt1s.com/api/ajaxConvert/convert',
        headers: {
            ...form.getHeaders()
        },
        data: form
    };
    const res99 = await axios(config)
    return res99.data
}
/* Example
            res2 = await getK(url)
		vid2 = await yta(res2.mp4, res2.id)
		aud2 = await yta(res2.mp3, res2.id)
		res1 = await search(text)
		vid = await yta(res1.mp4, res1.id)
		aud = await yta(res1.mp3, res1.id)
*/
module.exports = {
  getK,
  search,
  ytu,
  yt,
  ytIdRegex,
  /**
   * Download YouTube Video as Audio via y2mate
   * @param {String} url YouTube Video URL
   * @param {String} server (avaiable: `id4`, `en60`, `en61`, `en68`)
   */
  yta(url, server = 'en68') { return yt(url, '128kbps', 'mp3', '128', server) },
  /**
   * Download YouTube Video as Video via y2mate
   * @param {String} url YouTube Video URL
   * @param {String} server (avaiable: `id4`, `en60`, `en61`, `en68`)
   */
  ytv(url, server = 'en68') { return yt(url, '360p', 'mp4', '360', server) },
  servers: ['id4', 'en60', 'en61', 'en68']
}
