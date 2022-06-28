const {
	promises
} = require('fs');
const {
	join
} = require('path');
let levelling = require('../lib/levelling.cjs')
let moment = require('moment-timezone')
const defaultMenu = {
	before: `
👋🏻 Halo kak %name

*Limit* : %limit
*Role* : %role
*Level* : %level (%exp / %maxexp)
*Total exp* : %totalexp

*Tanggal*: %week, %date
*Waktu*: %time

*Uptime*: %uptime (%muptime)
*Database*: %totalreg

`.trimStart(),
	header: '*%category*',
	body: '⚄ %cmd %islimit %isPremium',
	footer: '\n',
	after: ``,
}
let handler = async (m, {
	conn,
	usedPrefix: _p,
	__dirname,
	args,
	command
}) => {
	let tags
	let teks = `${args[0]}`.toLowerCase()
	let arrayMenu = ['all', 'game', 'rpg', 'xp', 'sticker', 'kerang', 'primbon', 'group', 'premium', 'internet', 'anonymous', 'downloader', 'tools', 'database', 'owner', 'jadian', 'noktg', 'imagemaker', 'textmaker']
	if (!arrayMenu.includes(teks)) teks = '404'
	if (teks == 'all') tags = {
		'main': 'Main',
		'game': 'Games',
		'rpg': 'RPG Games',
		'xp': 'Exp & Limit',
		'sticker': 'Sticker',
		'kerang': 'Kerang Ajaib',
		'primbon': 'Primbon Jawa',
		'admin': 'Admin',
		'group': 'Group',
		'premium': 'Premium',
		'textpro': 'Textpro',
		'ephoto': 'Ephoto',
		'photooxy': 'Photooxy',
		'photofunia': 'Photofunia',
		'internet': 'Internet',
		'anonymous': 'Anonymous Chat',
		'downloader': 'Downloader',
		'tools': 'Tools',
		'fun': 'Fun',
		'database': 'Database',
		'vote': 'Voting',
		'absen': 'Absen',
		'owner': 'Owner',
		'user': 'User',
		'advanced': 'Advanced',
		'info': 'Info',
		'': 'No Category',
	}
	if (teks == 'game') tags = {
		'game': 'Games',
		'fun': 'Fun', 
		'berburu': 'Berburu'
	}
	if (teks == 'textmaker') tags = {
		'textpro': 'Textpro',
		'photofunia': 'Photofunia',
		'ephoto': 'Ephoto'
	}
	if (teks == 'imagemaker') tags = {
		'photooxy': 'Photooxy',
		'canvas': 'Canvas',
		'funnyphoto': 'Funny Photo'
	}
	if (teks == 'rpg') tags = {
		'rpg': 'RPG Games'
	}
	if (teks == 'xp') tags = {
		'xp': 'Exp & Limit'
	}
	if (teks == 'sticker') tags = {
		'sticker': 'Sticker'
	}
	if (teks == 'kerang') tags = {
		'kerang': 'Kerang Ajaib'
	}
	if (teks == 'primbon') tags = {
		'primbon': 'Primbon Jawa'
	}
	if (teks == 'group') tags = {
		'admin': 'Admin',
		'group': 'Group',
		'vote': 'Voting',
		'absen': 'Absen'
	}
	if (teks == 'premium') tags = {
		'premium': 'Premium'
	}
	if (teks == 'internet') tags = {
		'internet': 'Internet'
	}
	if (teks == 'anonymous') tags = {
		'anonymous': 'Anonymous Chat'
	}
	if (teks == 'downloader') tags = {
		'downloader': 'Downloader'
	}
	if (teks == 'tools') tags = {
		'tools': 'Tools'
	}
	if (teks == 'database') tags = {
		'database': 'Database'
	}
	if (teks == 'owner') tags = {
		'owner': 'Owner',
		'advanced': 'Advanced'
	}
	if (teks == 'jadian') tags = {
		'user': 'User', 
		'jadian': 'Jadian'
	}
	if (teks == 'noktg') tags = {
		'info': 'Info',
		'': 'No Category'
	}

	try {
		let _package = JSON.parse(await promises.readFile(join(__dirname, '../package.json')).catch(_ => ({}))) || {}
		let {
			exp,
			limit,
			level,
			role
		} = db.data.users[m.sender]
		let {
			min,
			xp,
			max
		} = levelling.xpRange(level, global.multiplier)
		let name = await conn.getName(m.sender)
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
		let dateIslamic = Intl.DateTimeFormat(locale + '-TN-u-ca-islamic', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		}).format(d)
		let time = d.toLocaleTimeString(locale, {
			hour: 'numeric',
			minute: 'numeric',
			second: 'numeric'
		})
		let _uptime = process.uptime() * 1000
		let _muptime
		if (process.send) {
			process.send('uptime')
			_muptime = await new Promise(resolve => {
				process.once('message', resolve)
				setTimeout(resolve, 1000)
			}) * 1000
		}
		let muptime = clockString(_muptime)
		let uptime = clockString(_uptime)
		let totalreg = Object.keys(db.data.users).length
		let rtotalreg = Object.values(db.data.users).filter(user => user.registered == true).length
		let help = Object.values(global.plugins).filter(plugin => !plugin.disabled).map(plugin => {
			return {
				help: Array.isArray(plugin.tags) ? plugin.help : [plugin.help],
				tags: Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags],
				prefix: 'customPrefix' in plugin,
				limit: plugin.limit,
				premium: plugin.premium,
				enabled: !plugin.disabled,
			}
		})
		if (teks == '404') {
			const sendMsg = await conn.sendMessage(m.chat, {
				text: 'Sekarang Jam ' + time,
				footer: author,
				title: '```'+ ucapan() + name + '```\n*' + week + ' - ' + date + '*\n',
				buttonText: "Click",
				sections: [{
					title: "List Featured",
					rows: [{
							title: "All",
							rowId: _p + `? all`
						},
						{
							title: "Games",
							rowId: _p + `? game`
						},
						{
							title: "RPG Games",
							rowId: _p + `? rpg`
						},
						{
							title: "Exp & Limit",
							rowId: _p + `? xp`
						},
						{
							title: "Stickers",
							rowId: _p + `? sticker`
						},
						{
							title: "Kerang Ajaib",
							rowId: _p + `? kerang`
						},
						{
							title: "Primbon Jawa",
							rowId: _p + `? primbon`
						},
						{
							title: "Text Maker",
							rowId: _p + `? textmaker`
						},
						{
							title: "Image Maker",
							rowId: _p + `? imagemaker`
						},
						{
							title: "Groups",
							rowId: _p + `? group`
						},
						{
							title: "Premium",
							rowId: _p + `? premium`
						},
						{
							title: "Internet",
							rowId: _p + `? internet`
						},
						{
							title: "Anonymous Chat",
							rowId: _p + `? anonymous`
						},
						{
							title: "Downloader",
							rowId: _p + `? downloader`
						},
						{
							title: "Tools",
							rowId: _p + `? tools`
						},
						{
							title: "Database",
							rowId: _p + `? database`
						},
						{
							title: "Owner",
							rowId: _p + `? owner`
						},
						{
							title: "Jadian",
							rowId: _p + `? jadian`
						},
						{
							title: "Tanpa Kategori",
							rowId: _p + `? noktg`
						}
					]
				}]
			})
			await delay(60000)
			return (await conn.sendMessage(m.chat, {
				delete: sendMsg.key
			}))
		}
		let groups = {}
		for (let tag in tags) {
			groups[tag] = []
			for (let plugin of help)
				if (plugin.tags && plugin.tags.includes(tag))
					if (plugin.help) groups[tag].push(plugin)
			// for (let tag of plugin.tags)
			//   if (!(tag in tags)) tags[tag] = tag
		}
		conn.menu = conn.menu ? conn.menu : {}
		let before = conn.menu.before || defaultMenu.before
		let header = conn.menu.header || defaultMenu.header
		let body = conn.menu.body || defaultMenu.body
		let footer = conn.menu.footer || defaultMenu.footer
		let after = conn.menu.after || (conn.user.jid == global.conn.user.jid ? '' : `Powered by https://wa.me/${global.conn.user.jid.split`@`[0]}`) + defaultMenu.after
		let _text = [
			before,
			...Object.keys(tags).map(tag => {
				return header.replace(/%category/g, tags[tag]) + '\n' + [
					...help.filter(menu => menu.tags && menu.tags.includes(tag) && menu.help).map(menu => {
						return menu.help.map(help => {
							return body.replace(/%cmd/g, menu.prefix ? help : '%p' + help)
								.replace(/%islimit/g, menu.limit ? '🄻' : '')
								.replace(/%isPremium/g, menu.premium ? '🄿' : '')
								.trim()
						}).join('\n')
					}),
					footer
				].join('\n')
			}),
			after
		].join('\n')
		let text = typeof conn.menu == 'string' ? conn.menu : typeof conn.menu == 'object' ? _text : ''
		let replace = {
			'%': '%',
			p: _p,
			uptime,
			muptime,
			me: conn.getName(conn.user.jid),
			npmname: _package.name,
			npmdesc: _package.description,
			version: _package.version,
			exp: exp - min,
			maxexp: xp,
			totalexp: exp,
			xp4levelup: max - exp,
			github: _package.homepage ? _package.homepage.url || _package.homepage : '[unknown github url]',
			level,
			limit,
			name,
			weton,
			week,
			date,
			dateIslamic,
			time,
			totalreg,
			rtotalreg,
			role,
			readmore: readMore
		}
		text = await tiny(text.replace(new RegExp(`%(${Object.keys(replace).sort((a, b) => b.length - a.length).join`|`})`, 'g'), (_, name) => '' + replace[name]))
		const pp = await conn.profilePictureUrl(conn.user.jid, 'image').catch(_ => './src/avatar_contact.png')
		conn.sendHydrated(m.chat, text.trim(), 'BOT BY BENNIISMAEL & GHOST', pp, 'https://github.com/botstylee', 'Github', null, null, [
			['Donate', '/donasi'],
			['Speed', '/ping'],
			['Owner', '/owner']
		], false, {
			asLocation: true
		})
	} catch (e) {
		conn.reply(m.chat, 'Maaf, menu sedang error', m)
		throw conn.reply(conn.user.jid, await e, m)
	}
}
handler.help = ['menu', 'help', '?']
handler.tags = ['main']
handler.command = /^(menu|help|\?)$/i

module.exports = handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)

function clockString(ms) {
	let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
	let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
	let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
	return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}

function ucapan() {
	const time = moment.tz('Asia/Jakarta').format('HH')
	res = "Selamat pagi "
	if (time >= 4) {
		res = "Selamat pagi "
	}
	if (time > 10) {
		res = "Selamat siang "
	}
	if (time >= 15) {
		res = "Selamat sore "
	}
	if (time >= 18) {
		res = "Selamat malam "
	}
	return res
}
