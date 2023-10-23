import fs, {
	watchFile,
	unwatchFile
} from 'fs'
import {
	fileTypeFromBuffer,
	fileTypeStream
} from 'file-type'
import chalk from 'chalk'
import {
	fileURLToPath
} from 'url'
import moment from 'moment-timezone'
import md5 from 'md5';
import {
	protoType,
	serialize
} from './lib/simple.js';
protoType();
global.moment = moment
/*============= WAKTU =============*/
global.owner = [
	//	['6281234288573'],
	//['+62...'],
	//['212706611366'],
	//['6282256080304'],
	['62895368900456', 'Benniismael', false]
	// [number, dia creator/owner?, dia developer?]
] // Put your number here
global.mods = [] // Want some help?
global.prems = [] // Premium user has unlimited limit
global.ram_usage = 600000000 // 600 MB in this example [Ram Limiter (if your server ram is 1GB put 900MB in bytes, later the server will auto restart before using 1GB ram)]
global.packname = 'ig : Beni_230\'Benniismael'
global.author = 'BENNIISMAEL & GHOST'
global.wm = 'BOTSTYLEE'
global.no_wallet = ''
global.nomorown = '0'
global.titlebot = `⫹⫺ RPG BOT Whatsapp | By ${author}`
global.profil = fs.readFileSync("./src/profil.jpg")
global.anunya = fs.readFileSync("./src/anunya.jpg")
global.rpg = {
	emoticon(string) {
		string = string.toLowerCase()
		var emot = {
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
			brick: '🧱',
			coal: '🕳️',
			clay: '🌕',
			stick: '🦯',
			sand: '🌑',
			glass: '🪞',
			ayambakar: '🍖',
			ayamgoreng: '🍗',
			rendang: '🥘',
			steak: '🥩',
			babipanggang: '🥠',
			gulaiayam: '🍲',
			oporayam: '🍜',
			vodka: '🍷',
			sushi: '🍣',
			bandage: '💉',
			ganja: '☘️',
			soda: '🍺',
			roti: '🍞',
			wortel:'🥕',
			tomat:'🍅',
			kangkung:'🥦',
			kentang:'🥔',
			kubis:'🥬',
			jagung:'🌽',
			bayam:'🍃',
			labu: '🎃',
			seedkangkung: '🌾',
			seedwortel: '🌾',	
			seedtomat: '🌾',
			seedbrokoli: '🌾', 
			seedlabu: '🌾',
			seedkentang: '🌾', 
			seedjagung: '🌾',
			seedbayam: '🌾',
			seedkubis: '🌾',
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
		var results = Object.keys(emot).map(v => [v, new RegExp(v, 'gi')]).filter(v => v[1].test(string))
		if (!results.length) return ''
		else return emot[results[0][0]]
	},
	// inspired from https://github.com/Fokusdotid/Family-MD/blob/main/plugins/_role.js
	// https://github.com/BochilGaming/games-wabot/issues/389
	// https://github.com/BochilGaming/games-wabot/issues/32
	// Also thanks to github copilot for the idea of role name
	role(level) {
		level = parseInt(level)
		if (isNaN(level)) return {
			name: '',
			level: ''
		}
		// this code make config.js to be a more understandable code
		var role = [{
				name: 'Warrior V',
				level: 0
			}, {
				name: 'Warrior IV',
				level: 4
			}, {
				name: 'Warrior III',
				level: 8
			}, {
				name: 'Warrior II',
				level: 12
			}, {
				name: 'Warrior I',
				level: 16
			},
			{
				name: 'Paladin V',
				level: 20
			}, {
				name: 'Paladin IV',
				level: 24
			}, {
				name: 'Paladin III',
				level: 28
			}, {
				name: 'Paladin II',
				level: 32
			}, {
				name: 'Paladin I',
				level: 36
			},
			{
				name: 'Sorcerer V',
				level: 40
			}, {
				name: 'Sorcerer IV',
				level: 44
			}, {
				name: 'Sorcerer III',
				level: 48
			}, {
				name: 'Sorcerer II',
				level: 52
			}, {
				name: 'Sorcerer I',
				level: 56
			},
			{
				name: 'Ranger V',
				level: 60
			}, {
				name: 'Ranger IV',
				level: 64
			}, {
				name: 'Ranger III',
				level: 68
			}, {
				name: 'Ranger II',
				level: 72
			}, {
				name: 'Ranger I',
				level: 76
			},
			{
				name: 'Mage V',
				level: 80
			}, {
				name: 'Mage IV',
				level: 84
			}, {
				name: 'Mage III',
				level: 88
			}, {
				name: 'Mage II',
				level: 92
			}, {
				name: 'Mage I',
				level: 96
			},
			{
				name: 'Cleric V',
				level: 100
			}, {
				name: 'Cleric IV',
				level: 104
			}, {
				name: 'Cleric III',
				level: 108
			}, {
				name: 'Cleric II',
				level: 112
			}, {
				name: 'Cleric I',
				level: 116
			},
			{
				name: 'Thief V',
				level: 120
			}, {
				name: 'Thief IV',
				level: 124
			}, {
				name: 'Thief III',
				level: 128
			}, {
				name: 'Thief II',
				level: 132
			}, {
				name: 'Thief I',
				level: 136
			},
			{
				name: 'Assassin V',
				level: 140
			}, {
				name: 'Assassin IV',
				level: 144
			}, {
				name: 'Assassin III',
				level: 148
			}, {
				name: 'Assassin II',
				level: 152
			}, {
				name: 'Assassin I',
				level: 156
			},
			{
				name: 'Monk V',
				level: 160
			}, {
				name: 'Monk IV',
				level: 164
			}, {
				name: 'Monk III',
				level: 168
			}, {
				name: 'Monk II',
				level: 172
			}, {
				name: 'Monk I',
				level: 176
			},
			{
				name: 'Bard V',
				level: 180
			}, {
				name: 'Bard IV',
				level: 184
			}, {
				name: 'Bard III',
				level: 188
			}, {
				name: 'Bard II',
				level: 192
			}, {
				name: 'Bard I',
				level: 196
			},
			{
				name: 'Necromancer V',
				level: 200
			}, {
				name: 'Necromancer IV',
				level: 204
			}, {
				name: 'Necromancer III',
				level: 208
			}, {
				name: 'Necromancer II',
				level: 212
			}, {
				name: 'Necromancer I',
				level: 216
			},
			{
				name: 'Warlock V',
				level: 220
			}, {
				name: 'Warlock IV',
				level: 224
			}, {
				name: 'Warlock III',
				level: 228
			}, {
				name: 'Warlock II',
				level: 232
			}, {
				name: 'Warlock I',
				level: 236
			},
			{
				name: 'Wizard V',
				level: 240
			}, {
				name: 'Wizard IV',
				level: 244
			}, {
				name: 'Wizard III',
				level: 248
			}, {
				name: 'Wizard II',
				level: 252
			}, {
				name: 'Wizard I',
				level: 256
			},
			{
				name: 'Sage V',
				level: 260
			}, {
				name: 'Sage IV',
				level: 264
			}, {
				name: 'Sage III',
				level: 268
			}, {
				name: 'Sage II',
				level: 272
			}, {
				name: 'Sage I',
				level: 276
			},
			{
				name: 'Priest V',
				level: 280
			}, {
				name: 'Priest IV',
				level: 284
			}, {
				name: 'Priest III',
				level: 288
			}, {
				name: 'Priest II',
				level: 292
			}, {
				name: 'Priest I',
				level: 296
			},
			{
				name: 'Rogue V',
				level: 300
			}, {
				name: 'Rogue IV',
				level: 304
			}, {
				name: 'Rogue III',
				level: 308
			}, {
				name: 'Rogue II',
				level: 312
			}, {
				name: 'Rogue I',
				level: 316
			},
			{
				name: 'Brawler V',
				level: 320
			}, {
				name: 'Brawler IV',
				level: 324
			}, {
				name: 'Brawler III',
				level: 328
			}, {
				name: 'Brawler II',
				level: 332
			}, {
				name: 'Brawler I',
				level: 336
			},
			{
				name: 'Archer V',
				level: 340
			}, {
				name: 'Archer IV',
				level: 344
			}, {
				name: 'Archer III',
				level: 348
			}, {
				name: 'Archer II',
				level: 352
			}, {
				name: 'Archer I',
				level: 356
			},
			{
				name: 'Sniper V',
				level: 360
			}, {
				name: 'Sniper IV',
				level: 364
			}, {
				name: 'Sniper III',
				level: 368
			}, {
				name: 'Sniper II',
				level: 372
			}, {
				name: 'Sniper I',
				level: 376
			},
			{
				name: 'Ninja V',
				level: 380
			}, {
				name: 'Ninja IV',
				level: 384
			}, {
				name: 'Ninja III',
				level: 388
			}, {
				name: 'Ninja II',
				level: 392
			}, {
				name: 'Ninja I',
				level: 396
			},
			{
				name: 'Samurai V',
				level: 400
			}, {
				name: 'Samurai IV',
				level: 404
			}, {
				name: 'Samurai III',
				level: 408
			}, {
				name: 'Samurai II',
				level: 412
			}, {
				name: 'Samurai I',
				level: 416
			},
			{
				name: 'Berserker V',
				level: 420
			}, {
				name: 'Berserker IV',
				level: 424
			}, {
				name: 'Berserker III',
				level: 428
			}, {
				name: 'Berserker II',
				level: 432
			}, {
				name: 'Berserker I',
				level: 436
			},
			{
				name: 'Legend V',
				level: 440
			}, {
				name: 'Legend IV',
				level: 444
			}, {
				name: 'Legend III',
				level: 448
			}, {
				name: 'Legend II',
				level: 452
			}, {
				name: 'Legend I',
				level: 456
			},
			{
				name: 'Champion V',
				level: 460
			}, {
				name: 'Champion IV',
				level: 464
			}, {
				name: 'Champion III',
				level: 468
			}, {
				name: 'Champion II',
				level: 472
			}, {
				name: 'Champion I',
				level: 476
			},
			{
				name: 'Grandmaster V',
				level: 480
			}, {
				name: 'Grandmaster IV',
				level: 484
			}, {
				name: 'Grandmaster III',
				level: 488
			}, {
				name: 'Grandmaster II',
				level: 492
			}, {
				name: 'Grandmaster I',
				level: 496
			},
			{
				name: 'Elder V',
				level: 500
			}, {
				name: 'Elder IV',
				level: 504
			}, {
				name: 'Elder III',
				level: 508
			}, {
				name: 'Elder II',
				level: 512
			}, {
				name: 'Elder I',
				level: 516
			},
			{
				name: 'Immortal V',
				level: 520
			}, {
				name: 'Immortal IV',
				level: 524
			}, {
				name: 'Immortal III',
				level: 528
			}, {
				name: 'Immortal II',
				level: 532
			}, {
				name: 'Immortal I',
				level: 536
			},
			{
				name: 'Nephalem V',
				level: 540
			}, {
				name: 'Nephalem IV',
				level: 544
			}, {
				name: 'Nephalem III',
				level: 548
			}, {
				name: 'Nephalem II',
				level: 552
			}, {
				name: 'Nephalem I',
				level: 556
			},
			{
				name: 'Eternal V',
				level: 560
			}, {
				name: 'Eternal IV',
				level: 564
			}, {
				name: 'Eternal III',
				level: 568
			}, {
				name: 'Eternal II',
				level: 572
			}, {
				name: 'Eternal I',
				level: 576
			},
			{
				name: 'Neptune V',
				level: 580
			}, {
				name: 'Neptune IV',
				level: 584
			}, {
				name: 'Neptune III',
				level: 588
			}, {
				name: 'Neptune II',
				level: 592
			}, {
				name: 'Neptune I',
				level: 596
			},
			{
				name: 'Pluto V',
				level: 600
			}, {
				name: 'Pluto IV',
				level: 604
			}, {
				name: 'Pluto III',
				level: 608
			}, {
				name: 'Pluto II',
				level: 612
			}, {
				name: 'Pluto I',
				level: 616
			},
			{
				name: 'Eris V',
				level: 620
			}, {
				name: 'Eris IV',
				level: 624
			}, {
				name: 'Eris III',
				level: 628
			}, {
				name: 'Eris II',
				level: 632
			}, {
				name: 'Eris I',
				level: 636
			},
			{
				name: 'Ascension V',
				level: 640
			}, {
				name: 'Ascension IV',
				level: 644
			}, {
				name: 'Ascension III',
				level: 648
			}, {
				name: 'Ascension II',
				level: 652
			}, {
				name: 'Ascension I',
				level: 656
			},
			{
				name: 'Elysium V',
				level: 660
			}, {
				name: 'Elysium IV',
				level: 664
			}, {
				name: 'Elysium III',
				level: 668
			}, {
				name: 'Elysium II',
				level: 672
			}, {
				name: 'Elysium I',
				level: 676
			},
			{
				name: 'Ether V',
				level: 680
			}, {
				name: 'Ether IV',
				level: 684
			}, {
				name: 'Ether III',
				level: 688
			}, {
				name: 'Ether II',
				level: 692
			}, {
				name: 'Ether I',
				level: 696
			},
			{
				name: 'Gaea V',
				level: 700
			}, {
				name: 'Gaea IV',
				level: 704
			}, {
				name: 'Gaea III',
				level: 708
			}, {
				name: 'Gaea II',
				level: 712
			}, {
				name: 'Gaea I',
				level: 716
			},
			{
				name: 'Hades V',
				level: 720
			}, {
				name: 'Hades IV',
				level: 724
			}, {
				name: 'Hades III',
				level: 728
			}, {
				name: 'Hades II',
				level: 732
			}, {
				name: 'Hades I',
				level: 736
			},
			{
				name: 'Heimdall V',
				level: 740
			}, {
				name: 'Heimdall IV',
				level: 744
			}, {
				name: 'Heimdall III',
				level: 748
			}, {
				name: 'Heimdall II',
				level: 752
			}, {
				name: 'Heimdall I',
				level: 756
			},
			{
				name: 'Hyperion V',
				level: 760
			}, {
				name: 'Hyperion IV',
				level: 764
			}, {
				name: 'Hyperion III',
				level: 768
			}, {
				name: 'Hyperion II',
				level: 772
			}, {
				name: 'Hyperion I',
				level: 776
			},
			{
				name: 'Iris V',
				level: 780
			}, {
				name: 'Iris IV',
				level: 784
			}, {
				name: 'Iris III',
				level: 788
			}, {
				name: 'Iris II',
				level: 792
			}, {
				name: 'Iris I',
				level: 796
			},
			{
				name: 'Jupiter V',
				level: 800
			}, {
				name: 'Jupiter IV',
				level: 804
			}, {
				name: 'Jupiter III',
				level: 808
			}, {
				name: 'Jupiter II',
				level: 812
			}, {
				name: 'Jupiter I',
				level: 816
			},
			{
				name: 'Kronos V',
				level: 820
			}, {
				name: 'Kronos IV',
				level: 824
			}, {
				name: 'Kronos III',
				level: 828
			}, {
				name: 'Kronos II',
				level: 832
			}, {
				name: 'Kronos I',
				level: 836
			},
			{
				name: 'Lilith V',
				level: 840
			}, {
				name: 'Lilith IV',
				level: 844
			}, {
				name: 'Lilith III',
				level: 848
			}, {
				name: 'Lilith II',
				level: 852
			}, {
				name: 'Lilith I',
				level: 856
			},
			{
				name: 'Maelstrom V',
				level: 860
			}, {
				name: 'Maelstrom IV',
				level: 864
			}, {
				name: 'Maelstrom III',
				level: 868
			}, {
				name: 'Maelstrom II',
				level: 872
			}, {
				name: 'Maelstrom I',
				level: 876
			},
			{
				name: 'Nova V',
				level: 880
			}, {
				name: 'Nova IV',
				level: 884
			}, {
				name: 'Nova III',
				level: 888
			}, {
				name: 'Nova II',
				level: 892
			}, {
				name: 'Nova I',
				level: 896
			},
			{
				name: 'Odin V',
				level: 900
			}, {
				name: 'Odin IV',
				level: 904
			}, {
				name: 'Odin III',
				level: 908
			}, {
				name: 'Odin II',
				level: 912
			}, {
				name: 'Odin I',
				level: 916
			},
			{
				name: 'Osiris V',
				level: 920
			}, {
				name: 'Osiris IV',
				level: 924
			}, {
				name: 'Osiris III',
				level: 928
			}, {
				name: 'Osiris II',
				level: 932
			}, {
				name: 'Osiris I',
				level: 936
			},
			{
				name: 'Poseidon V',
				level: 940
			}, {
				name: 'Poseidon IV',
				level: 944
			}, {
				name: 'Poseidon III',
				level: 948
			}, {
				name: 'Poseidon II',
				level: 952
			}, {
				name: 'Poseidon I',
				level: 956
			},
			{
				name: 'Ragnarok V',
				level: 960
			}, {
				name: 'Ragnarok IV',
				level: 964
			}, {
				name: 'Ragnarok III',
				level: 968
			}, {
				name: 'Ragnarok II',
				level: 972
			}, {
				name: 'Ragnarok I',
				level: 976
			},
			{
				name: 'Saturn V',
				level: 980
			}, {
				name: 'Saturn IV',
				level: 984
			}, {
				name: 'Saturn III',
				level: 988
			}, {
				name: 'Saturn II',
				level: 992
			}, {
				name: 'Saturn I',
				level: 996
			},
			{
				name: 'Titan V',
				level: 1000
			}, {
				name: 'Titan IV',
				level: 1004
			}, {
				name: 'Titan III',
				level: 1008
			}, {
				name: 'Titan II',
				level: 1012
			}, {
				name: 'Titan I',
				level: 1016
			},
			{
				name: 'Uranus V',
				level: 1020
			}, {
				name: 'Uranus IV',
				level: 1024
			}, {
				name: 'Uranus III',
				level: 1028
			}, {
				name: 'Uranus II',
				level: 1032
			}, {
				name: 'Uranus I',
				level: 1036
			},
			{
				name: 'Venus V',
				level: 1040
			}, {
				name: 'Venus IV',
				level: 1044
			}, {
				name: 'Venus III',
				level: 1048
			}, {
				name: 'Venus II',
				level: 1052
			}, {
				name: 'Venus I',
				level: 1056
			},
			{
				name: 'Zeus V',
				level: 1060
			}, {
				name: 'Zeus IV',
				level: 1064
			}, {
				name: 'Zeus III',
				level: 1068
			}, {
				name: 'Zeus II',
				level: 1072
			}, {
				name: 'Zeus I',
				level: 1076
			},
		]

		return role.reverse().find(role => level >= role.level)
	}
}
			
global.log = function log() {
	var args = [].slice.call(arguments);
	console.log.apply(console, args);
}
global.APIs = { // API Prefix
	// name: 'https://website'
	nrtm: 'https://nurutomo.herokuapp.com/',
	ghst: 'https://api-ghost.herokuapp.com/',
	botstyle: 'https://botstyle-api.herokuapp.com',
	beni: 'https://rest-beni.herokuapp.com/'
}
global.APIKeys = { // APIKey Here
	// 'https://website': 'apikey'
        'https://botstyle-api.herokuapp.com': 'iAEzm9gH',
	'https://api-ghost.herokuapp.com': 'EsLLv3'
}

global.multiplier = 69
// Function untuk menghitung keuntungan berdasarkan persentase
function calculateProfit(originalPrice, profitPercentage) {
	if (originalPrice <= 0 || profitPercentage <= 0) {
		return 0; // Mengembalikan 0 jika harga asli atau persentase keuntungan tidak valid
	}

	var profitAmount = (originalPrice * profitPercentage) / 100; // Menghitung jumlah keuntungan
	var totalPrice = originalPrice + profitAmount; // Menghitung harga total

	return {
		profitAmount: profitAmount,
		totalPrice: totalPrice
	};
}
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
// profit via persentase
var file = fileURLToPath(
	import.meta.url)
watchFile(file, () => {
	unwatchFile(file)
	console.log(chalk.redBright("Update 'config.js'"))
	import(`${file}?update=${Date.now()}`)
})

function ucapan() {
	var time = moment.tz('Asia/Jakarta').format('HH')
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

// Message filter
var usedCommandRecently = new Set()

/**
 * Check is number filtered.
 * @param {String} from 
 * @returns {Boolean}
 */
global.isFiltered = (from) => {
	return !!usedCommandRecently.has(from)
}

/**
 * Add number to filter.
 * @param {String} from 
 */
global.addFilter = (from) => {
	usedCommandRecently.add(from)
	setTimeout(() => {
		return usedCommandRecently.delete(from)
	}, 3000) // 5 seconds delay, I don't recommend below that.
}

global.thumb = async function thumb(url, text, attribute) {
	return {
		mediaType: 1,
		description: '',
		title: text && text.length > 0 ? text[0] : "",
		mediaUrl: "",
		body: text && text.length > 1 ? text[1] : "",
		thumbnailUrl: "",
		thumbnail: Buffer.isBuffer(url) ? url : { url },
		sourceUrl: Buffer.isBuffer(url) ? '' : attribute.length > 2 ? url : '',
		showAdAttribution: attribute && attribute.length > 0 ? attribute[0] : false, // false
		renderLargerThumbnail: attribute && attribute.length > 1 ? attribute[1] : false // false
	}
}
global.pmenus = ["乂", "◈", "➭", "ଓ", "⟆•", "⳻", "•", "↬", "◈", "⭑", "ᯬ", "◉", "᭻", "»", "〆", "々", "⛥", "✗", "⚜", "⚚", "♪"].getRandom()
global.htjava = ["乂", "⛶", "❏", "⫹⫺", "☰", "⎔", "✦", "⭔", "⬟", "⛊", "⚝"].getRandom()
global.cmenut = htjava + "───『"
global.cmenuh = "』───" + htjava
global.cmenub = "│" + pmenus
global.cmenuf = "╰──────────⳹"
global.htki = '––––––『' // Hiasan Titile (KIRI)
global.htka = '』––––––' // Hiasan Title  (KANAN)
global.lopr = 'Ⓟ' //LOGO PREMIUM ON MENU.JS
global.lolm = 'Ⓛ' //LOGO LIMIT/FREE ON MENU.JS

global.sa = '╭─'
global.gx = '│✇'
global.gy = '│•'
global.gz = '│'
global.sb = '╰────࿐'
global.kki = '「'
global.kka = '」'
global.zt = '*'
global.zc = ''
