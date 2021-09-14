global.DeveloperMode = 'false' //true Or false
global.linkGC = ['https://chat.whatsapp.com/DmYC7VwLxpVIPHrysJFIC7']
global.owner = ['6282114499086'] // Put your number here
global.mods = [] // Want some help?
global.prems = [] // Premium user has unlimited limit
global.APIs = { // API Prefix
  // name: 'https://website'
  nrtm: 'https://nurutomo.herokuapp.com',
  pencarikode: 'https://pencarikode.xyz',
  xteam: 'https://api.xteam.xyz',
  dhnjing: 'https://dhnjing.xyz',
  bx: 'https://bx-hunter.herokuapp.com',
  neoxr: 'https://neoxr-api.herokuapp.com',
  nzcha: 'http://nzcha-apii.herokuapp.com',
  bg: 'http://bochil.ddns.net',
  fdci: 'https://api.fdci.se',
  bsbt: 'https://bsbt-api-rest.herokuapp.com',
  zekais: 'http://zekais-api.herokuapp.com',
  zeks: 'https://api.zeks.xyz',
  zahir: 'https://zahirr-web.herokuapp.com',
  hardianto: 'https://hardianto-chan.herokuapp.com'
  
}
global.APIKeys = { // APIKey Here
  // 'https://website': 'apikey'
  'https://api.xteam.xyz': 'benniismaelapikey',
  'https://pencarikode.xyz': 'pais',
  'https://neoxr-api.herokuapp.com': 'yntkts',
  'https://bx-hunter.herokuapp.com': 'Ikyy69',
  'https://bsbt-api-rest.herokuapp.com': 'benniismael',
  'https://api.zeks.xyz': 'apivinz',
  'https://zahirr-web.herokuapp.com': 'zahirgans',
  'https://hardianto-chan.herokuapp.com': 'hardianto'
}

// Sticker WM
global.packname = 'Benniganteng\'ig : Beni_230'
global.author = 'Benniismael'

global.wait = '_*tunggu..*_'
global.eror = '_*Server Error*_'
global.fla = 'https://www6.flamingtext.com/net-fu/proxy_form.cgi?&imageoutput=true&script=sketch-name&doScale=true&scaleWidth=800&scaleHeight=500&fontsize=100&fillTextType=1&fillTextPattern=Warning!&text='


global.multiplier = 69 // The higher, The harder levelup

let fs = require('fs')
let chalk = require('chalk')
let file = require.resolve(__filename)
fs.watchFile(file, () => {
  fs.unwatchFile(file)
  console.log(chalk.redBright("Update 'config.js'"))
  delete require.cache[file]
  require(file)
})
