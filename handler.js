import {
	smsg
} from './lib/simple.js'
import {
	plugins
} from './lib/plugins.js'
import {
	format
} from 'util'
import {
	fileURLToPath
} from 'url'
import path, {
	join
} from 'path'
import {
	unwatchFile,
	watchFile
} from 'fs'
import chalk from 'chalk'
import Connection from './lib/connection.js'
import printMessage from './lib/print.js'
import Helper from './lib/helper.js'
import db, {
	loadDatabase
} from './lib/database.js'
import Queque from './lib/queque.js'

/** @type {import('@adiwajshing/baileys')} */
var {
	getContentType,
	proto,
	WAMessageStubType
} = (await import('@adiwajshing/baileys')).default

var isNumber = x => typeof x === 'number' && !isNaN(x)
/**
 * Handle messages upsert
 * @this {import('./lib/connection').Socket}
 * @param {import('@adiwajshing/baileys').BaileysEventMap<unknown>['messages.upsert']} chatUpdate
 */
export async function handler(chatUpdate) {
	this.msgqueque = this.msgqueque || new Queque()
	if (!chatUpdate)
		return
	var m = chatUpdate.messages[chatUpdate.messages.length - 1]
	if (!m)
		return
	if (db.data == null)
		await loadDatabase()
	try {
		m = smsg(this, m) || m
		if (!m)
			return
		m.exp = 0
		m.limit = false
		try {
			// TODO: use loop to insert data instead of this
			var user = db.data.users[m.sender]
			if (typeof user !== 'object')
				db.data.users[m.sender] = {}
			if (user) {
				if (!isNumber(user.exp))
					user.exp = 0
				if (!isNumber(user.limit))
					user.limit = 10
				if (!isNumber(user.lastclaim))
					user.lastclaim = 0
				if (!('registered' in user))
					user.registered = false
				if (!user.registered) {
					if (!('name' in user))
						user.name = m.name
					if (!isNumber(user.age))
						user.age = -1
					if (!isNumber(user.regTime))
						user.regTime = -1
				}
				if (!isNumber(user.afk))
					user.afk = -1
				if (!('afkReason' in user))
					user.afkReason = ''
				if (!('banned' in user))
					user.banned = false
				if (!isNumber(user.warn))
					user.warn = 0
				if (!isNumber(user.level))
					user.level = 0
				if (!('role' in user))
					user.role = 'Beginner'
				if (!('autolevelup' in user))
					user.autolevelup = true

				if (!isNumber(user.money))
					user.money = 0
				if (!isNumber(user.atm))
					user.atm = 0
				if (!isNumber(user.fullatm))
					user.fullatm = 0
				if (!isNumber(user.bank))
					user.bank = 0
				if (!isNumber(user.health))
					user.health = 100
				if (!isNumber(user.stamina))
					user.stamina = 100
				if (!isNumber(user.limit))
					user.limit = 0
				if (!isNumber(user.potion))
					user.potion = 0
				if (!isNumber(user.trash))
					user.trash = 0
				if (!isNumber(user.wood))
					user.wood = 0
				if (!isNumber(user.rock))
					user.rock = 0
				if (!isNumber(user.brick))
					user.brick = 0
				if (!isNumber(user.glass))
					user.glass = 0
				if (!isNumber(user.stick))
					user.stick = 0
				if (!isNumber(user.string))
					user.string = 0
				if (!isNumber(user.petFood))
					user.petFood = 0

				//building
				if (!isNumber(user.fortress))
					user.fortress = 0
				if (!isNumber(user.house))
					user.house = 0
				if (!isNumber(user.kastel))
					user.kastel = 0
				if (!isNumber(user.peternakan))
					user.peternakan = 0
				if (!isNumber(user.perkebunan))
					user.perkebunan = 0
				if (!isNumber(user.pertambangan))
					user.pertambangan = 0

				//SDA
				if (!isNumber(user.emerald))
					user.emerald = 0
				if (!isNumber(user.diamond))
					user.diamond = 0
				if (!isNumber(user.gold))
					user.gold = 0
				if (!isNumber(user.iron))
					user.iron = 0
				if (!isNumber(user.coal))
					user.coal = 0
				if (!isNumber(user.clay))
					user.clay = 0
				if (!isNumber(user.sand))
					user.sand = 0
				if (!isNumber(user.upgrader))
					user.upgrader = 0


				//chest
				if (!isNumber(user.common))
					user.common = 0
				if (!isNumber(user.uncommon))
					user.uncommon = 0
				if (!isNumber(user.mythic))
					user.mythic = 0
				if (!isNumber(user.legendary))
					user.legendary = 0
				if (!isNumber(user.superior))
					user.superior = 0
				if (!isNumber(user.pet))
					user.pet = 0

				//pet
				if (!isNumber(user.horse))
					user.horse = 0
				if (!isNumber(user.cat))
					user.cat = 0
				if (!isNumber(user.fox))
					user.fox = 0
				if (!isNumber(user.dog))
					user.dog = 0
				if (!isNumber(user.robo))
					user.robo = 0
				if (!isNumber(user.lion))
					user.lion = 0
				if (!isNumber(user.dragon))
					user.dragon = 0
				if (!isNumber(user.wolf))
					user.wolf = 0
				if (!isNumber(user.rhinoceros))
					user.rhinoceros = 0
				if (!isNumber(user.phonix))
					user.phonix = 0
				if (!isNumber(user.griffin))
					user.griffin = 0
				if (!isNumber(user.centaur))
					user.centaur = 0
				if (!isNumber(user.kyubi))
					user.kyubi = 0

				//exp pet
				if (!isNumber(user.horseexp))
					user.horseexp = 0
				if (!isNumber(user.catexp))
					user.catexp = 0
				if (!isNumber(user.foxexp))
					user.foxexp = 0
				if (!isNumber(user.dogexp))
					user.dogexp = 0
				if (!isNumber(user.roboxp))
					user.roboxp = 0
				if (!isNumber(user.lionexp))
					user.lionexp = 0
				if (!isNumber(user.wolfexp))
					user.wolfexp = 0
				if (!isNumber(user.rhinocerosexp))
					user.rhinocerosexp = 0
				if (!isNumber(user.dragonexp))
					user.dragonexp = 0
				if (!isNumber(user.phonixexp))
					user.phonixexp = 0
				if (!isNumber(user.griffinexp))
					user.griffinexp = 0
				if (!isNumber(user.kyubiexp))
					user.kyubiexp = 0
				if (!isNumber(user.centaurexp))
					user.centaurexp = 0

				//last feed pet
				if (!isNumber(user.horselastfeed))
					user.horselastfeed = 0
				if (!isNumber(user.catlastfeed))
					user.catlastfeed = 0
				if (!isNumber(user.foxlastfeed))
					user.foxlastfeed = 0
				if (!isNumber(user.doglastfeed))
					user.doglastfeed = 0
				if (!isNumber(user.lionlastfeed))
					user.lionlastfeed = 0
				if (!isNumber(user.dragonlastfeed))
					user.dragonlastfeed = 0
				if (!isNumber(user.wolflastfeed))
					user.wolflastfeed = 0
				if (!isNumber(user.rhinoceroslastfeed))
					user.rhinoceroslastfeed = 0
				if (!isNumber(user.phonixlastfeed))
					user.phonixlastfeed = 0
				if (!isNumber(user.griffinlastfeed))
					user.griffinlastfeed = 0
				if (!isNumber(user.centaurlastfeed))
					user.centaurlastfeed = 0
				if (!isNumber(user.kyubilastfeed))
					user.kyubilastfeed = 0

				//toold
				if (!isNumber(user.armor))
					user.armor = 0
				if (!isNumber(user.armordurability))
					user.armordurability = 0
				if (!isNumber(user.sword))
					user.sword = 0
				if (!isNumber(user.sworddurability))
					user.sworddurability = 0
				if (!isNumber(user.pickaxe))
					user.pickaxe = 0
				if (!isNumber(user.pickaxedurability))
					user.pickaxedurability = 0
				if (!isNumber(user.fishingrod))
					user.fishingrod = 0
				if (!isNumber(user.fishingroddurability))
					user.fishingroddurability = 0
				if (!isNumber(user.bow))
					user.bow = 0
				if (!isNumber(user.bowdurability))
					user.bowdurability = 0
				if (!isNumber(user.axe))
					user.axe = 0
				if (!isNumber(user.axedurability))
					user.axedurability = 0

				if (!isNumber(user.lastclaim))
					user.lastclaim = 0
				if (!isNumber(user.lastadventure))
					user.lastadventure = 0
				if (!isNumber(user.lastfishing))
					user.lastfishing = 0
				if (!isNumber(user.lastdungeon))
					user.lastdungeon = 0
				if (!isNumber(user.lastduel))
					user.lastduel = 0
				if (!isNumber(user.lastmining))
					user.lastmining = 0
				if (!isNumber(user.lasthunt))
					user.lasthunt = 0
				if (!isNumber(user.lastweekly))
					user.lastweekly = 0
				if (!isNumber(user.lastmonthly))
					user.lastmonthly = 0
				if (!isNumber(user.lastbunga))
					user.lastbunga = 0
				if (!isNumber(user.lastgrab))
					user.lastgrab = 0
				if (!isNumber(user.lastgojek))
					user.lastgojek = 0
				if (!isNumber(user.lastdagang))
					user.lastdagang = 0
				if (!isNumber(user.lastlumber))
					user.lastlumber = 0

				//makanan
				if (!isNumber(user.ganja))
					user.ganja = 0
				if (!isNumber(user.bandage))
					user.bandage = 0
				if (!isNumber(user.soda))
					user.soda = 0
				if (!isNumber(user.vodka))
					user.vodka = 0
				if (!isNumber(user.sushi))
					user.sushi = 0
				if (!isNumber(user.roti))
					user.roti = 0
				if (!isNumber(user.tumiskangkung))
					user.tumiskangkung = 0
				if (!isNumber(user.suplabu))
					user.suplabu = 0
				if (!isNumber(user.kentanggoreng))
					user.kentanggoreng = 0
				if (!isNumber(user.jagungbakar))
					user.jagungbakar = 0
				if (!isNumber(user.gadodado))
					user.gadogado = 0
				if (!isNumber(user.sop))
					user.sop = 0
				if (!isNumber(user.gulai))
					user.gulai = 0
				if (!isNumber(user.ayamgoreng))
					user.ayamgoreng = 0
				if (!isNumber(user.rendang))
					user.rendang = 0
				if (!isNumber(user.oporayam))
					user.oporayam = 0
				if (!isNumber(user.steak))
					user.steak = 0
				if (!isNumber(user.ayambakar))
					user.ayambakar = 0
				if (!isNumber(user.pepesikan))
					user.pepesikan = 0
				if (!isNumber(user.babipanggang))
					user.babipanggang = 0

				//sayuran
				if (!isNumber(user.kangkung))
					user.kangkung = 0
				if (!isNumber(user.wortel))
					user.wortel = 0
				if (!isNumber(user.tomat))
					user.tomat = 0
				if (!isNumber(user.brokoli))
					user.brokoli = 0
				if (!isNumber(user.labu))
					user.labu = 0
				if (!isNumber(user.kentang))
					user.kentang = 0
				if (!isNumber(user.jagung))
					user.jagung = 0
				if (!isNumber(user.bayam))
					user.bayam = 0
				if (!isNumber(user.kubis))
					user.kubis = 0

				//seed
				if (!isNumber(user.seedkangkung))
					user.seedkangkung = 0
				if (!isNumber(user.seedwortel))
					user.seedwortel = 0
				if (!isNumber(user.seedtomat))
					user.seedtomat = 0
				if (!isNumber(user.seedbrokoli))
					user.seedbrokoli = 0
				if (!isNumber(user.seedlabu))
					user.seedlabu = 0
				if (!isNumber(user.seedkentang))
					user.seedkentang = 0
				if (!isNumber(user.seedjagung))
					user.seedjagung = 0
				if (!isNumber(user.seedbayam))
					user.seedbayam = 0
				if (!isNumber(user.seedkubis))
					user.seedkubis = 0

				//database berburu
				if (!isNumber(user.as))
					user.as = 0
				if (!isNumber(user.paus))
					user.paus = 0
				if (!isNumber(user.kepiting))
					user.kepiting = 0
				if (!isNumber(user.gurita))
					user.gurita = 0
				if (!isNumber(user.cumi))
					user.cumi = 0
				if (!isNumber(user.buntal))
					user.buntal = 0
				if (!isNumber(user.dory))
					user.dory = 0
				if (!isNumber(user.lumba))
					user.lumba = 0
				if (!isNumber(user.lobster))
					user.lobster = 0
				if (!isNumber(user.hiu))
					user.hiu = 0
				if (!isNumber(user.udang))
					user.udang = 0
				if (!isNumber(user.ikan))
					user.ikan = 0
				if (!isNumber(user.orca))
					user.orca = 0

				if (!isNumber(user.banteng))
					user.banteng = 0
				if (!isNumber(user.harimau))
					user.harimau = 0
				if (!isNumber(user.gajah))
					user.gajah = 0
				if (!isNumber(user.kambing))
					user.kambing = 0
				if (!isNumber(user.panda))
					user.panda = 0
				if (!isNumber(user.buaya))
					user.buaya = 0
				if (!isNumber(user.kerbau))
					user.kerbau = 0
				if (!isNumber(user.sapi))
					user.sapi = 0
				if (!isNumber(user.monyet))
					user.monyet = 0
				if (!isNumber(user.babihutan))
					user.babihutan = 0
				if (!isNumber(user.babi))
					user.babi = 0
				if (!isNumber(user.ayam))
					user.ayam = 0

				if (!('premium' in user))
					user.premium = false
				if (!user.premium) {
					if (!isNumber(user.expired))
						user.expired = 0
				}
				if (!('sewa' in user))
					user.sewa = false
				if (!isNumber(user.limitjoinprem))
					user.limitjoinprem = 0
				if (!isNumber(user.limitjoinfree))
					user.limitjoinfree = 1
				if (!('pasangan' in user))
					user.pasangan = ''
			} else
				db.data.users[m.sender] = {
					exp: 0,
					limit: 10,
					lastclaim: 0,
					registered: false,
					name: m.name,
					age: -1,
					regTime: -1,
					afk: -1,
					afkReason: '',
					banned: false,
					warn: 0,
					level: 0,
					role: 'Beginner',
					autolevelup: true,

					money: 0,
					bank: 0,
					atm: 0,
					fullatm: 0,
					health: 100,
					stamina: 100,
					limit: 100,
					potion: 10,
					trash: 0,
					wood: 0,
					rock: 0,
					brick: 0,
					glass: 0,
					stick: 0,
					string: 0,

					//building
					fortress: 0,
					kastel: 0,
					house: 0,
					peternakan: 0,
					perkebunan: 0,
					pertambangan: 0,

					//makanan
					gulai: 0,
					rendang: 0,
					oporayam: 0,
					steak: 0,
					pepesikan: 0,
					babipanggang: 0,
					sop: 0,
					gadogado: 0,
					jagungbakar: 0,
					kentanggoreng: 0,
					suplabu: 0,
					tumiskangkung: 0,
					ayambakar: 0,
					ayamgoreng: 0,
					ganja: 0,
					bandage: 0,
					soda: 0,
					vodka: 0,
					sushi: 0,
					roti: 0,

					//sayuran
					kangkung: 0,
					wortel: 0,
					tomat: 0,
					brokoli: 0,
					labu: 0,
					kentang: 0,
					jagung: 0,
					bayam: 0,
					kubis: 0,

					//seed
					seedkangkung: 0,
					seedwortel: 0,
					seedtomat: 0,
					seedbrokoli: 0,
					seedlabu: 0,
					seedkentang: 0,
					seedjagung: 0,
					seedbayam: 0,
					seedkubis: 0,

					//SDA
					emerald: 0,
					diamond: 0,
					gold: 0,
					iron: 0,
					coal: 0,
					clay: 0,
					sand: 0,
					upgrader: 0,

					//crate
					common: 0,
					uncommon: 0,
					mythic: 0,
					legendary: 0,
					superior: 0,
					pet: 0,

					//pet
					horse: 0,
					horseexp: 0,
					cat: 0,
					catngexp: 0,
					fox: 0,
					foxexp: 0,
					dog: 0,
					dogexp: 0,

					horselastfeed: 0,
					catlastfeed: 0,
					foxlastfeed: 0,
					doglastfeed: 0,

					rhinoceros: 0,
					rhinoceroslastfeed: 0,
					rhinocerosexp: 0,
					lion: 0,
					lionlastfeed: 0,
					lionexp: 0,
					wolf: 0,
					wolflastfeed: 0,
					wolfexp: 0,
					griffin: 0,
					griffinlastfeed: 0,
					griffinexp: 0,
					dragon: 0,
					dragonlastfeed: 0,
					dragonexp: 0,
					centaur: 0,
					centaurlastfeed: 0,
					centaurexp: 0,
					phonix: 0,
					phonixlastfeed: 0,
					phonixexp: 0,

					//tools
					armor: 0,
					armordurability: 0,
					sword: 0,
					sworddurability: 0,
					pickaxe: 0,
					pickaxedurability: 0,
					fishingrod: 0,
					fishingroddurability: 0,
					bow: 0,
					bowdurability: 0,
					axe: 0,
					axedurability: 0,

					lastclaim: 0,
					lastadventure: 0,
					lastfishing: 0,
					lastdungeon: 0,
					lastduel: 0,
					lastmining: 0,
					lasthunt: 0,
					lastweekly: 0,
					lastmonthly: 0,
					lastbunga: 0,
					lastgrab: 0,
					lastgojek: 0,
					lastdagang: 0,
					lastlumber: 0,

					//hasil berburu
					as: 0,
					paus: 0,
					kepiting: 0,
					gurita: 0,
					cumi: 0,
					buntal: 0,
					dory: 0,
					lumba: 0,
					lobster: 0,
					hiu: 0,
					udang: 0,
					ikan: 0,
					orca: 0,
					banteng: 0,
					harimau: 0,
					gajah: 0,
					kambing: 0,
					panda: 0,
					buaya: 0,
					kerbau: 0,
					sapi: 0,
					monyet: 0,
					babihutan: 0,
					babi: 0,
					ayam: 0,
					premium: false,
					expired: 0,
					limitjoinfree: 1,
					limitjoinprem: 0,
					sewa: false,
					pasangan: ''
				}
			var chat = db.data.chats[m.chat]
			if (typeof chat !== 'object')
				db.data.chats[m.chat] = {}
			if (chat) {
				if (!('isBanned' in chat))
					chat.isBanned = false
				if (!('stiker' in chat))
					chat.stiker = false
				if (!('simi' in chat))
					chat.simi = false
				if (!('welcome' in chat))
					chat.welcome = false
				if (!('detect' in chat))
					chat.detect = false
				if (!('sWelcome' in chat))
					chat.sWelcome = ''
				if (!('sBye' in chat))
					chat.sBye = ''
				if (!('sPromote' in chat))
					chat.sPromote = ''
				if (!('sDemote' in chat))
					chat.sDemote = ''
				if (!('delete' in chat))
					chat.delete = true
				if (!('antiLink' in chat))
					chat.antiLink = false
				if (!('viewonce' in chat))
					chat.viewonce = false
				if (!('antiToxic' in chat))
					chat.antiToxic = false
				if (!('reminder' in chat))
					chat.reminder = false
				if (!('nofirtex' in chat))
					chat.nofirtext = false
				if (!('groupexpired' in chat))
					chat.groupexpired = false
				if (!chat.groupexpired) {
					if (!isNumber(chat.expired))
						chat.expired = 0
				}
			} else
				db.data.chats[m.chat] = {
					isBanned: false,
					stiker: false,
					simi: false,
					welcome: false,
					detect: false,
					sWelcome: '',
					sBye: '',
					sPromote: '',
					sDemote: '',
					delete: true,
					antiLink: false,
					viewonce: false,
					antiToxic: false,
					reminder: false,
					nofirtex: false,
					groupexpired: false,
					expired: 0,
				}
			var settings = db.data.settings[this.user.jid]
			if (typeof settings !== 'object') db.data.settings[this.user.jid] = {}
			if (settings) {
				if (!('self' in settings)) settings.self = false
				if (!('autoread' in settings)) settings.autoread = false
				if (!('restrict' in settings)) settings.restrict = false
				if (!('pconly' in settings)) settings.pconly = false
			} else db.data.settings[this.user.jid] = {
				self: false,
				autoread: false,
				restrict: false,
				pconly: false
			}
		} catch (e) {
			console.error({
				db: e
			})
		}
		if (opts['nyimak'])
			return
		if (!m.fromMe && opts['self'])
			return
		if (opts['pconly'] && m.chat.endsWith('g.us'))
			return
		if (opts['gconly'] && !m.chat.endsWith('g.us'))
			return
		if (opts['swonly'] && m.chat !== 'status@broadcast')
			return
		if (m.chat == 'status@broadcast')
			return
		if (typeof m.text !== 'string')
			m.text = ''

		var isROwner = [this.decodeJid(this.user.id), ...global.owner.map(([number]) => number)].map(v => v?.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender)
		var isOwner = isROwner || m.fromMe
		var settinge = db.data.settings[this.user.jid]
		if (!isOwner && settinge.self)
			return
		var isMods = isOwner || global.mods.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender)
		var isPrems = isROwner || global.prems.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender) || db.data.users[m.sender].premium

		if (opts['queque'] && m.text && !m.fromMe && !(isMods || isPrems)) {
			var id = m.id
			this.msgqueque.add(id)
			await this.msgqueque.waitQueue(id)
		}

		if (m.isBaileys)
			return
		m.exp += Math.ceil(Math.random() * 10)

		var usedPrefix
		var _user = db.data?.users?.[m.sender]

		var groupMetadata = (m.isGroup ? await Connection.store.fetchGroupMetadata(m.chat, this.groupMetadata) : {}) || {}
		var participants = (m.isGroup ? groupMetadata.participants : []) || []
		var user = (m.isGroup ? participants.find(u => this.decodeJid(u.id) === m.sender) : {}) || {} // User Data
		var bot = (m.isGroup ? participants.find(u => this.decodeJid(u.id) == this.user.jid) : {}) || {} // Your Data
		var isRAdmin = user?.admin == 'superadmin' || false
		var isAdmin = isRAdmin || user?.admin == 'admin' || false // Is User Admin?
		var isBotAdmin = bot?.admin || false // Are you Admin?
		var enable = db.data.chats[m.chat]
		var users = db.data.users[m.sender]
		var stp = m.messageStubType ? WAMessageStubType[m.messageStubType] : ''
		var settinges = db.data.settings[this.user.jid]
		if (settinges.restrict && enable.nofirtek && !m.fromMe && m.isGroup && isBotAdmin) {
			if (!m.fromMe && m.text.match(/(৭৭৭|๒๒๒|؋.ᄻ.ྜྷ.ᇸ.ྙ|๖ۣۜy๖ۣۜF๖ۣۜr๖|๑๑๑|৭৭৭৭৭৭৭৭|๑๑๑๑๑๑๑๑|ผิดุท้่เึางืผิดุท้่เึางื|๒๒๒๒๒๒๒๒|ผิดุท้่เึางืผิดุท้่เึางื)/gi) && m.text.length >= 66255 || stp == "OVERSIZED") {
				conn.reply(m.chat, " ngapain ngirim firtex bang😅☝", m)
				await delay(2000)
				//conn.reply(m.chat, "kamu harus di kick sih bang", false)
				//await delay(2000)
				conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
			}
		}
		if (settinges.restrict && enable.antiToxic && !m.fromMe && m.isGroup && !isAdmin && !isOwner && isBotAdmin) {
			if (!m.fromMe && m.text.match(/(asadebangsat|Dakjal|anak setan|ngntd|ngentot|jancuk|kuntul|babi|kampang|kenthu|tempik|kimak|patek|kondom|bugil|seks|sex|sexy|tai|Tai|jancok|jembut|bokep|xnxx|xxx|xvideos|xvid|jilboob|seksi|Anjing|Babi|Kunyuk|Bajingan|Bangsat|Kampret|Kontol|Memek|Ngentot|Pentil|Perek|Pepek|Pecun|Bencong|Banci|Maho|Sinting|Lonte|Hencet|Taptei|Kampang|Keparat|Bejad|Gembel|Brengsek|Taek|Anjrit|Fuck|Tetek|Ngulum|Jembut|Totong|Kolop|Pukimak|bacot|Bacot|Juancok|asw|Bodat|Heang|Jancuk|Burit|Titit|Nenen|Bejat|Silit|Sempak|Fucking|Asshole|Bitch|Penis|Vagina|Klitoris|Kelentit|Borjong|Dancuk|anjg|Anjg|Bcd|bct|Bgsd|Bgst|bgsd|bgst|ajg|tolol|Tolol|Pantek|kondom|Teho|Bejat|Pantat|Bagudung|Babami|Kanciang|Bungul|Idiot|Kimak|Henceut|Kacuk|pukimak|goblok|bodo|Pussy|ngewe|Dick|Damn|Assu|tempek|celeng|shit|jingan|ngentot anjing ngewe|Dont use unlisted command|kontol|ngentod|colmek|alat vital|bangkinang|tits|tetek|coli|ngocok peli|ANJING!!!|kntl|ngtd|anying|amjin|sikontol|bang bros|ngocok|toket|A n j i n g|Tahi|anjass|biadap|bbii|biadab|Tomlol|dongo|dungu|anjk|bcot|BURUNG KECIL JAN SOK KERAS:V|nude|p3n1s|p3nis)/gi)) {
				await conn.sendPresenceUpdate('composing', m.chat)
				var cBad = db.data.users[m.sender].warn += 1
				var warning = db.data.users[m.sender].warn
				if (warning >= 6) {
					conn.reply(m.chat, `*Over badword!*\nyou will be removed after 3 second`, m).then(() => {
						setTimeout(() => {
							conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
						}, 2000)
						db.data.users[m.sender].warn = 0
					})
				} else {
					conn.reply(m.chat, `*⺀ BADWORD DETECTOR ⺀*\n\n*Kamu mendapat peringatan : [ ${warning} / 6 ]*\n\n*Jangan berkata kasar atau menggunakan kalimat sampah sebanyak 6x atau kamu akan dikeluarkan dari grup secara otomatis.*\n\n▌│█║▌║▌║║▌║▌║█│▌▌│█║`, m)
				}
			}
		}
		if (!m.fromMe && m.text.match(/(makasi|thanks|thank|terima kasih|suwon)/gi)) {
			conn.reply(m.chat, "hooh😅👆", false)
		}
		var ___dirname = path.join(path.dirname(fileURLToPath(
			import.meta.url)), './plugins')
		for (var name in plugins) {
			var plugin = plugins[name]
			if (!plugin)
				continue
			if (plugin.disabled)
				continue
			var __filename = join(___dirname, name)
			if (typeof plugin.all === 'function') {
				try {
					await plugin.all.call(this, m, {
						chatUpdate,
						__dirname: ___dirname,
						__filename
					})
				} catch (e) {
					// if (typeof e === 'string') continue
					console.error(e)
					for (var [jid] of global.owner.filter(([number, _, isDeveloper]) => isDeveloper && number)) {
						var data = (await this.onWhatsApp(jid))[0] || {}
						if (data.exists)
							m.reply(`*Plugin:* ${name}\n*Sender:* ${m.sender}\n*Chat:* ${m.chat}\n*Command:* ${m.text}\n\n\`\`\`${format(e)}\`\`\``.trim(), data.jid)
					}
				}
			}
			/*if (!opts['restrict'])
				if (plugin.tags && plugin.tags.includes('admin')) {
					// global.dfail('restrict', m, this)
					continue
				}*/
			var strict = db.data.settings[this.user.jid].restrict
			if (!strict) {
				db.data.chats[m.chat].antiToxic = false
				db.data.chats[m.chat].antiLink = false
				if (plugin.tags && plugin.tags.includes('admin')) {
					// global.dfail('restrict', m, this)
					continue
				}
			}
			var str2Regex = str => str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
			var _prefix = plugin.customPrefix ? plugin.customPrefix : this.prefix ? this.prefix : global.prefix
			var match = (_prefix instanceof RegExp ? // RegExp Mode?
				[
					[_prefix.exec(m.text), _prefix]
				] :
				Array.isArray(_prefix) ? // Array?
				_prefix.map(p => {
					var re = p instanceof RegExp ? // RegExp in Array?
						p :
						new RegExp(str2Regex(p))
					return [re.exec(m.text), re]
				}) :
				typeof _prefix === 'string' ? // String?
				[
					[new RegExp(str2Regex(_prefix)).exec(m.text), new RegExp(str2Regex(_prefix))]
				] : [
					[
						[], new RegExp
					]
				]
			).find(p => p[1])
			if (typeof plugin.before === 'function') {
				if (await plugin.before.call(this, m, {
						match,
						conn: this,
						participants,
						groupMetadata,
						user,
						bot,
						isROwner,
						isOwner,
						isRAdmin,
						isAdmin,
						isBotAdmin,
						isPrems,
						chatUpdate,
						__dirname: ___dirname,
						__filename
					}))
					continue
			}
			if (typeof plugin !== 'function')
				continue
			if ((usedPrefix = (match[0] || '')[0])) {
				var noPrefix = m.text.replace(usedPrefix, '')
				var [command, ...args] = noPrefix.trim().split` `.filter(v => v)
				args = args || []
				var _args = noPrefix.trim().split` `.slice(1)
				var text = _args.join` `
				command = (command || '').toLowerCase()
				var fail = plugin.fail || global.dfail // When failed
				var isAccept = plugin.command instanceof RegExp ? // RegExp Mode?
					plugin.command.test(command) :
					Array.isArray(plugin.command) ? // Array?
					plugin.command.some(cmd => cmd instanceof RegExp ? // RegExp in Array?
						cmd.test(command) :
						cmd === command
					) :
					typeof plugin.command === 'string' ? // String?
					plugin.command === command :
					false

				if (!isAccept)
					continue
				m.plugin = name
				if (m.chat in db.data.chats || m.sender in db.data.users || this.user.jid in db.data.settings) {
					var chat = db.data.chats[m.chat]
					var user = db.data.users[m.sender]
					var settings = db.data.settings[this.user.jid]
					if (!['owner-unbanchat.cjs', 'group-info.cjs', 'owner-exec.cjs', 'owner-exec2.cjs', 'tool-devare.cjs', 'info-runtime.cjs', 'exp-ceksn.cjs', 'exp-daftar.cjs', 'exp-my.cjs', 'exp-unreg.cjs', 'group-link.cjs', 'enable.cjs', 'user-profile.cjs'].includes(name) && chat?.isBanned)
						return // Except this
					if (!['owner-unbanuser.cjs', 'user-profile.cjs', 'info-runtime.cjs'].includes(name) && user?.banned)
						return
					if (!['owner-unbanchat.cjs', 'user-profile.cjs', 'info-runtime.cjs', 'group-info.cjs', 'enable.cjs', 'owner-exec.cjs', 'owner-exec2.cjs'].includes(name) && settings?.pconly && m.isGroup && !isOwner)
						return
				}
				if (plugin.rowner && plugin.owner && !(isROwner || isOwner)) { // Both Owner
					fail('owner', m, this)
					continue
				}
				if (plugin.rowner && !isROwner) { // Real Owner
					fail('rowner', m, this)
					continue
				}
				if (plugin.owner && !isOwner) { // Number Owner
					fail('owner', m, this)
					continue
				}
				if (plugin.mods && !isMods) { // Moderator
					fail('mods', m, this)
					continue
				}
				if (plugin.premium && !isPrems) { // Premium
					fail('premium', m, this)
					continue
				}
				if (plugin.group && !m.isGroup) { // Group Only
					fail('group', m, this)
					continue
				} else if (plugin.botAdmin && !isBotAdmin) { // You Admin
					fail('botAdmin', m, this)
					continue
				} else if (plugin.admin && !isAdmin) { // User Admin
					fail('admin', m, this)
					continue
				}
				if (plugin.private && m.isGroup) { // Private Chat Only
					fail('private', m, this)
					continue
				}
				if (plugin.register == true && _user.registered == false) { // Butuh daftar?
					fail('unreg', m, this)
					continue
				}
				m.isCommand = true
				var xp = 'exp' in plugin ? parseInt(plugin.exp) : 17 // XP Earning per command
				/* if (xp > 200)
				     m.reply('Ngecit -_-') // Hehehe
				 else*/
				m.exp += xp
				if (!isPrems && plugin.limit && db.data.users[m.sender].limit < plugin.limit * 1) {
					this.reply(m.chat, `Limit anda habis, silahkan beli melalui *${usedPrefix}buy\n*atau tunggu besok*`, m)
					continue // Limit habis
				}
				if (plugin.level > _user.level) {
					this.reply(m.chat, `diperlukan level ${plugin.level} untuk menggunakan perintah ini. Level kamu ${_user.level}`, m)
					continue // If the level has not been reached
				}
				var extra = {
					match,
					usedPrefix,
					noPrefix,
					_args,
					args,
					command,
					text,
					conn: this,
					participants,
					groupMetadata,
					user,
					bot,
					isROwner,
					isOwner,
					isRAdmin,
					isAdmin,
					isBotAdmin,
					isPrems,
					chatUpdate,
					__dirname: ___dirname,
					__filename
				}
				try {
					await plugin.call(this, m, extra)
					if (!isPrems)
						m.limit = m.limit || plugin.limit || false
				} catch (e) {
					// Error occured
					m.error = e
					console.error(e)
					if (e) {
						var text = format(e)
						for (var key of Object.values(global.APIKeys))
							text = text.replace(new RegExp(key, 'g'), '#HIDDEN#')
						if (e.name)
							for (var [jid] of global.owner.filter(([number, _, isDeveloper]) => isDeveloper && number)) {
								var data = (await this.onWhatsApp(jid))[0] || {}
								if (data.exists)
									m.reply(`*Plugin:* ${m.plugin}\n*Sender:* ${m.sender}\n*Chat:* ${m.chat}\n*Command:* ${usedPrefix}${command} ${args.join(' ')}\n\n\`\`\`${text}\`\`\``.trim(), data.jid)
							}
						m.reply(text)
					}
				} finally {
					// m.reply(util.format(_user))
					if (typeof plugin.after === 'function') {
						try {
							await plugin.after.call(this, m, extra)
						} catch (e) {
							console.error(e)
						}
					}
					if (m.limit)
						m.reply(+m.limit + ' Limit terpakai')
				}
				break
			}
		}
	} catch (e) {
		console.error(e)
	} finally {
		if (opts['queque'] && m.text) {
			var id = m.id
			this.msgqueque.unqueue(id)
		}
		//console.log(db.data.users[m.sender])
		var user, stats = db.data.stats
		if (m) {
			if (m.sender && (user = db.data.users[m.sender])) {
				user.exp += m.exp
				user.limit -= m.limit * 1
			}

			var stat
			if (m.plugin) {
				var now = +new Date
				if (m.plugin in stats) {
					stat = stats[m.plugin]
					if (!isNumber(stat.total))
						stat.total = 1
					if (!isNumber(stat.success))
						stat.success = m.error != null ? 0 : 1
					if (!isNumber(stat.last))
						stat.last = now
					if (!isNumber(stat.lastSuccess))
						stat.lastSuccess = m.error != null ? 0 : now
				} else
					stat = stats[m.plugin] = {
						total: 1,
						success: m.error != null ? 0 : 1,
						last: now,
						lastSuccess: m.error != null ? 0 : now
					}
				stat.total += 1
				stat.last = now
				if (m.error == null) {
					stat.success += 1
					stat.lastSuccess = now
				}
			}
		}

		try {
			if (!opts['noprint']) await printMessage(m, this)
		} catch (e) {
			console.log(m, m.quoted, e)
		}
		await this.readMessages([m.key])
		if (opts['autoread'])
			await this.readMessages([m.key])

	}
}

/**
 * Handle groups participants update
 * @this {import('./lib/connection').Socket}
 * @param {import('@adiwajshing/baileys').BaileysEventMap<unknown>['group-participants.update']} groupsUpdate 
 */
export async function participantsUpdate({
	id,
	participants,
	action
}) {
	var settinge = db.data.settings[this.user.jid]
	if (settinge.self)
		return
	if (this.isInit)
		return
	if (db.data == null)
		await loadDatabase()
	var chat = db.data.chats[id] || {}
	var text = ''
	log({
		id,
		participants,
		action
	})
	switch (action) {
		case 'add':
		case 'remove':
			if (chat.welcome) {
				var groupMetadata = await Connection.store.fetchGroupMetadata(id, this.groupMetadata)
				for (var user of participants) {
					var pp = './src/avatar_contact.png'
					try {
						pp = await this.profilePictureUrl(user, 'image')
					} catch (e) {} finally {
						text = (action === 'add' ? (chat.sWelcome || this.welcome || Connection.conn.welcome || 'Welcome, @user!').replace('@subject', await this.getName(id)).replace('@desc', groupMetadata.desc?.toString() || 'unknow') :
							(chat.sBye || this.bye || Connection.conn.bye || 'Bye, @user!')).replace('@user', '@' + user.split('@')[0])
						this.sendFile(id, pp, 'pp.jpg', text, null, false, {
							mentions: [user]
						})
					}
				}
			}
			break
		case 'promote':
			text = (chat.sPromote || this.spromote || Connection.conn.spromote || '@user ```is now Admin```')
		case 'demote':
			if (!text)
				text = (chat.sDemote || this.sdemote || Connection.conn.sdemote || '@user ```is no longer Admin```')
			text = text.replace('@user', '@' + participants[0].split('@')[0])
			if (chat.detect)
				this.sendMessage(id, {
					text,
					mentions: this.parseMention(text)
				})
			break
	}
}

/**
 * Handle groups update
 * @this {import('./lib/connection').Socket}
 * @param {import('@adiwajshing/baileys').BaileysEventMap<unknown>['groups.update']} groupsUpdate 
 */
export async function groupsUpdate(groupsUpdate) {
	log({
		groupsUpdate
	})
	var settinge = db.data.settings[this.user.jid]
	if (settinge.self)
		return
	for (var groupUpdate of groupsUpdate) {
		var id = groupUpdate.id
		if (!id) continue
		var chats = db.data.chats[id],
			text = ''
		if (!chats?.detect) continue
		if (groupUpdate.desc) text = (chats.sDesc || this.sDesc || Connection.conn.sDesc || '```Description has been changed to```\n@desc').replace('@desc', groupUpdate.desc)
		if (groupUpdate.subject) text = (chats.sSubject || this.sSubject || Connection.conn.sSubject || '```Subject has been changed to```\n@subject').replace('@subject', groupUpdate.subject)
		if (groupUpdate.icon) text = (chats.sIcon || this.sIcon || Connection.conn.sIcon || '```Icon has been changed to```').replace('@icon', groupUpdate.icon)
		if (groupUpdate.revoke) text = (chats.sRevoke || this.sRevoke || Connection.conn.sRevoke || '```Group link has been changed to```\n@revoke').replace('@revoke', groupUpdate.revoke)
		if (!text) continue
		await this.sendMessage(id, {
			text,
			mentions: this.parseMention(text)
		})
	}
}

/**
 * @this {import('./lib/connection').Socket}
 * @param {import('@adiwajshing/baileys').BaileysEventMap<unknown>['messages.delete']} message 
 */
export async function deleteUpdate(message) {
	log(message)
	if (Array.isArray(message.keys) && message.keys.length > 0) {
		var tasks = await Promise.allSettled(message.keys.map(async (key) => {
			if (key.fromMe || key.remoteJid == "status@broadcast") return
			var msg = this.loadMessage(key.remoteJid, key.id) || this.loadMessage(key.id)
			if (!msg || !msg.message) return
			var chat = db.data.chats[key.remoteJid]
			if (!chat || chat.delete) return

			// if message type is conversation, convert it to extended text message because if not, it will throw an error
			var mtype = getContentType(msg.message)
			if (mtype === 'conversation') {
				msg.message.extendedTextMessage = {
					text: msg.message[mtype]
				}
				delete msg.message[mtype]
			}

			var participant = msg.participant || msg.key.participant || msg.key.remoteJid

			await this.reply(key.remoteJid, `
        Terdeteksi @${participant.split`@`[0]} telah menghapus pesan
Untuk mematikan fitur ini, ketik
*.enable delete*
`.trim(), msg, {
				mentions: [participant]
			})
			return await this.copyNForward(key.remoteJid, msg).catch(e => console.log(e, msg))
		}))
		tasks.map(t => t.status === 'rejected' && console.error(t.reason))
	}
}


global.dfail = (type, m, conn) => {
	var msg = {
		rowner: '```Oɴʟʏ ᴏᴡɴᴇʀ ᴄᴀɴ ᴀᴄᴄᴇꜱꜱ ᴛʜɪꜱ ᴄᴏᴍᴍᴀɴᴅ!!```',
		owner: '```Oɴʟʏ ᴏᴡɴᴇʀ ʙᴏᴛ ᴄᴀɴ ᴀᴄᴄᴇꜱꜱ ᴛʜɪꜱ ᴄᴏᴍᴍᴀɴᴅ!!!```',
		mods: '```Oɴʟʏ ᴍᴏᴅᴇʀᴀᴛᴏʀ ᴄᴀɴ ᴀᴄᴄᴇꜱꜱ ᴛʜɪꜱ ᴄᴏᴍᴍᴀɴᴅ!!```',
		premium: 'Pᴇʀɪɴᴛᴀʜ ɪɴɪ ʜᴀɴʏᴀ ᴜɴᴛᴜᴋ ᴍᴇᴍʙᴇʀ _*Pʀᴇᴍɪᴜᴍ*_ !',
		group: '```Pᴇʀɪɴᴛᴀʜ ɪɴɪ ʜᴀɴʏᴀ ᴅᴀᴘᴀᴛ ᴅɪɢᴜɴᴀᴋᴀɴ ᴅɪ ɢʀᴜᴘ!```',
		private: '```Pᴇʀɪɴᴛᴀʜ ɪɴɪ ʜᴀɴʏᴀ ᴅᴀᴘᴀᴛ ᴅɪɢᴜɴᴀᴋᴀɴ ᴅɪ Cʜᴀᴛ Pʀɪʙᴀᴅɪ!```',
		admin: 'Pᴇʀɪɴᴛᴀʜ ɪɴɪ ʜᴀɴʏᴀ ᴜɴᴛᴜᴋ *Aᴅᴍɪɴ* ɢʀᴜᴘ!',
		botAdmin: 'Jᴀᴅɪᴋᴀɴ ʙᴏᴛ ꜱᴇʙᴀɢᴀɪ *Aᴅᴍɪɴ* ᴜɴᴛᴜᴋ ᴍᴇɴɢɢᴜɴᴀᴋᴀɴ ᴘᴇʀɪɴᴛᴀʜ ɪɴɪ!',
		unreg: 'Sɪʟᴀʜᴋᴀɴ ᴅᴀғᴛᴀʀ ᴜɴᴛᴜᴋ ᴍᴇɴɢɢᴜɴᴀᴋᴀɴ ғɪᴛᴜʀ ɪɴɪ ᴅᴇɴɢᴀɴ ᴄᴀʀᴀ ᴍᴇɴɢᴇᴛɪᴋ:\n\n*#ᴅᴀғᴛᴀʀ ɴᴀᴍᴀ.ᴜᴍᴜʀ*\n\nCᴏɴᴛᴏʜ: *#ᴅᴀғᴛᴀʀ Mᴀɴᴜꜱɪᴀ.16*',
		restrict: 'Fɪᴛᴜʀ ɪɴɪ ᴅɪ *ᴅɪꜱᴀʙʟᴇ*!'
	} [type]
	if (msg) return m.reply(msg)
}

var file = Helper.__filename(
	import.meta.url, true)
watchFile(file, async () => {
	unwatchFile(file)
	console.log(chalk.redBright("Update 'handler.js'"))
	if (Connection.reload) console.log(await Connection.reload(await Connection.conn))
})
