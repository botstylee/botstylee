import fs, {
	watchFile,
	unwatchFile
} from 'fs'
import chalk from 'chalk'
import {
	fileURLToPath
} from 'url'
import moment from 'moment-timezone'
var a = (await import("./lib/tictactoe.cjs")).default
/*============= WAKTU =============*/
let wibh = moment.tz('Asia/Jakarta').format('HH')
let wibm = moment.tz('Asia/Jakarta').format('mm')
let wibs = moment.tz('Asia/Jakarta').format('ss')
let wktuwib = `${wibh} Jᴀᴍ ${wibm} Mᴇɴɪᴛ ${wibs} Dᴇᴛɪᴋ`
let d = new Date(new Date + 3600000)
let locale = 'id'
// d.getTimeZoneOffset()
// Offset -420 is 18.00
// Offset    0 is  0.00
// Offset  420 is  7.00
let weton = ['Pahing', 'Pon', 'Wage', 'Kliwon', 'Legi'][Math.floor(d / 84600000) % 5]
let week = d.toLocaleDateString(locale, {
	weekday: 'long'
})
let date = d.toLocaleDateString(locale, {
	day: 'numeric',
	month: 'long',
	year: 'numeric'
})
global.TicTacToe = a
global.moment = moment
global.botdate = `⫹⫺ 𝗗𝗮𝘁𝗲: ${week} ${date}\n⫹⫺ 𝗧𝗶𝗺𝗲: ${wktuwib}`
global.bottime = `𝗧 𝗜 𝗠 𝗘 : ${wktuwib}`
global.work = `*Sᴜᴄᴄᴇꜱꜱ Fᴇᴛᴄʜɪɴɢ Dᴀᴛᴀ*\n*Sᴇɴᴅɪɴɢ Fɪʟᴇ...*`
global.error = `*Cᴀɴ\'ᴛ Fᴇᴛᴄʜɪɴɢ Dᴀᴛᴀ*`
global.profil = fs.readFileSync("./src/botstyle.png")
global.zippy = (await import('./lib/zippy.cjs')).zippy
global.tiny = (await import('./lib/tiny.cjs')).default
global.gc = "https://chat.whatsapp.com/KihEAYjKr04LI4uUrbiiip"
global.gh = "https://github.com/botstylee"
global.yt = "https://youtube.com/channel/UCrNO1yUYW0i3xsJp4NGBh4Q"
function ucapan() {
	const time = moment.tz('Asia/Jakarta').format('HH')
	var res
	res = tiny("Selamat pagi ")
	if (time >= 4) {
		res = tiny("Selamat pagi ")
	}
	if (time > 10) {
		res = tiny("Selamat siang ")
	}
	if (time >= 15) {
		res = tiny("Selamat sore ")
	}
	if (time >= 18) {
		res = tiny("Selamat malam ")
	}
	return res
}
global.say = ucapan()
global.getbuffer = async function getBuffer(url, options) {
	try {
		options ? options : {}
		var res = await axios({
			method: "get",
			url,
			headers: {
				'DNT': 1,
				'User-Agent': 'GoogleBot',
				'Upgrade-Insecure-Request': 1
			},
			...options,
			responseType: 'arraybuffer'
		})
		return res.data
	} catch (e) {
		console.log(`Error : ${e}`)
	}
}
global.log = async function log(data, data2, data3) {
	if (!(data2 || data3)) {
		return console.log(data)
	} else if (!data3) {
		return console.log(data, data2)
	} else {
		return console.log(data, data2, data3)
	}
}
global.owner = [
	//  ['6281234288573'],
	//['12546153210'],
	//['62895368900456'],
	['62895368900456', 'Benniismael', true]
	// [number, dia creator/owner?, dia developer?]
] // Put your number here
global.mods = [] // Want some help?
global.prems = [] // Premium user has unlimited limit
global.APIs = { // API Prefix
	// name: 'https://website'
	nrtm: 'https://nurutomo.herokuapp.com/',
	ghst: 'https://ghostui-api.herokuapp.com/',
	beni: 'https://rest-beni.herokuapp.com/'
}
global.APIKeys = { // APIKey Here
	// 'https://website': 'apikey'
	'https://ghostui-api.herokuapp.com/': 'salahlo'
}
// Sticker WM
global.packname = 'ig : Beni_230\'Benniismael'
global.author = 'BENNIISMAEL & GHOST'
global.nomorown = '62895368900456'
global.multiplier = 69 // The higher, The harder levelup
global.titlebot = `⫹⫺ RPG BOT Whatsapp | By ${author}`
global.rpg = {
	emoticon(string) {
		string = string.toLowerCase()
		let emot = {
			level: '🧬',
			limit: '🌌',
			health: '❤️',
			exp: '✉️',
			money: '💵',
			potion: '🥤',
			diamond: '💎',
			common: '📦',
			uncommon: '🎁',
			mythic: '🗳️',
			legendary: '🗃️',
			pet: '🎁',
			trash: '🗑',
			armor: '🥼',
			sword: '⚔️',
			fishingrod: '🎣',
			pickaxe: '⛏️',
			bow: '🏹',
			axe: '🪓',
			wood: '🪵',
			rock: '🪨',
			string: '🕸️',
			horse: '🐎',
			cat: '🐈',
			dog: '🐕',
			fox: '🦊',
			petFood: '🍖',
			iron: '⛓️',
			gold: '👑',
			emerald: '💚',
/*=====| Hasil berburu |========*/
			kepiting: '🦀',
			lobster: '🦞',
			udang: '🦐',
			cumi: '🦑', 
			gurita: '🐙', 
			buntal: '🐡', 
			dory: '🐠', 
			orca: '🐟', 
			lumba: '🐬', 
			paus: '🐳', 
			hiu: '🦈', 
			banteng: '🐂', 
			harimau: '🐅', 
			gajah: '🐘', 
			kambing: '🐐', 
			panda: '🐼', 
			buaya: '🐊', 
			kerbau: '🐃', 
			sapi: '🐮', 
			monyet: '🐒', 
			babihutan: '🐗', 
			babi: '🐖', 
			ayam: '🐓'
		}
		let results = Object.keys(emot).map(v => [v, new RegExp(v, 'gi')]).filter(v => v[1].test(string))
		if (!results.length) return ''
		else return emot[results[0][0]]
	}
}


let file = fileURLToPath(
	import.meta.url)
watchFile(file, () => {
	unwatchFile(file)
	console.log(chalk.redBright("Update 'config.js'"))
	import(`${file}?update=${Date.now()}`)
})
