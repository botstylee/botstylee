var {
	promises
} = require('fs');
var {
	join
} = require('path');
var moment = require('moment-timezone')
var defaultMenu = {
	before: `│============================
├  ${ucapan()}, %name!
├ Nama : %name!
├ Hari: *%week %weton*
├ Tanggal: *%date*
├ Waktu: *%time*
├ Uptime: *%uptime*
│============================\n`.trimStart(),
	header: '┌◪「*%category*ッ」◪',
	body: '├❏ %cmd %islimit %isPremium',
	footer: '└────',
	after: ``,
}
var handler = async (m, {
	conn,
	usedPrefix: _p,
	__dirname,
	args,
	command
}) => {
	var tags
	tags = {
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
                'wattpadz': 'Wattpadz',
		'anime': 'Anime',
                'audio': 'Audio',
		'fun': 'Fun',
		'database': 'Database',
		'vote': 'Voting',
		'absen': 'Absen',
		'owner': 'Owner',
		'user': 'User',
		'advanced': 'Advanced',
		'info': 'Info'
	}

	try {
		var _package = JSON.parse(await promises.readFile(join(__dirname, '../package.json')).catch(_ => ({}))) || {}
		var role = db.data.users[m.sender].role
		//var saldo = getMonUser(m.sender)
		var name = await conn.getName(m.sender)
		var d = new Date(new Date + 3600000)
		var locale = 'id'
		// d.getTimeZoneOffset()
		// Offset -420 is 18.00
		// Offset    0 is  0.00
		// Offset  420 is  7.00
		var weton = ['Pahing', 'Pon', 'Wage', 'Kliwon', 'Legi'][Math.floor(d / 84600000) % 5]
		var week = new Intl.DateTimeFormat(locale, {
			weekday: 'long'
		}).format(moment.tz('asia/jakarta'))
		var date = new Intl.DateTimeFormat(locale, {
			day: 'numeric',
			month: 'long',
			weekday: 'long',
			year: 'numeric'
		}).format(moment.tz('asia/jakarta'))
		var dateIslamic = Intl.DateTimeFormat(locale + '-TN-u-ca-islamic', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		}).format(moment.tz('asia/jakarta'))
		var time = new Intl.DateTimeFormat(locale, {
			hour: 'numeric',
			minute: 'numeric',
			second: 'numeric'
		}).format(moment.tz('asia/jakarta'))
		var _uptime = process.uptime() * 1000
		var _muptime
		if (process.send) {
			process.send('uptime')
			_muptime = await new Promise(resolve => {
				process.once('message', resolve)
				setTimeout(resolve, 1000)
			}) * 1000
		}
		var muptime = clockString(_muptime)
		var uptime = clockString(_uptime)
		var {
			plugins
		} = await import('../lib/plugins.js')
		var help = Object.values(plugins).filter(plugin => !plugin.disabled).map(plugin => {
			return {
				help: Array.isArray(plugin.tags) ? plugin.help : [plugin.help],
				tags: Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags],
				prefix: 'customPrefix' in plugin,
				limit: plugin.limit,
				premium: plugin.premium,
				enabled: !plugin.disabled,
			}
		})
		var groups = {}
		for (var tag in tags) {
			groups[tag] = []
			for (var plugin of help)
				if (plugin.tags && plugin.tags.includes(tag))
					if (plugin.help) groups[tag].push(plugin)
			// for (var tag of plugin.tags)
			//   if (!(tag in tags)) tags[tag] = tag
		}
		conn.menu = conn.menu ? conn.menu : {}
		var before = conn.menu.before || defaultMenu.before
		var header = conn.menu.header || defaultMenu.header
		var body = conn.menu.body || defaultMenu.body
		var footer = conn.menu.footer || defaultMenu.footer
		var after = conn.menu.after || (conn.user.jid == global.conn.user.jid ? '' : `Powered by https://wa.me/${global.conn.user.jid.split`@`[0]}`) + defaultMenu.after
		var _text = [
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
		var text = typeof conn.menu == 'string' ? conn.menu : typeof conn.menu == 'object' ? _text : ''
		var replace = {
			'%': '%',
			p: _p,
			uptime,
			muptime,
			role,
			me: conn.getName(conn.user.jid),
			npmname: _package.name,
			npmdesc: _package.description,
			version: _package.version,
			github: _package.homepage ? _package.homepage.url || _package.homepage : '[unknown github url]',
			name,
			weton,
			week,
			date,
			dateIslamic,
			time,
			readmore: readMore
		}
		text = text.replace(new RegExp(`%(${Object.keys(replace).sort((a, b) => b.length - a.length).join`|`})`, 'g'), (_, name) => '' + replace[name])
		var pp = await conn.profilePictureUrl(conn.user.jid, 'image').catch(_ => './src/avatar_contact.png')
		conn.reply(m.chat, text.trim(), m)
	} catch (e) {
		conn.reply(m.chat, 'Maaf, menu sedang error', m)
		log(e)
	}
}
handler.help = ['menu', 'help', '?']
handler.tags = ['main']
handler.command = /^(menu|help|\?)$/i

module.exports = handler

var more = String.fromCharCode(8206)
var readMore = more.repeat(4001)

function clockString(ms) {
	var h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
	var m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
	var s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
	return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}

function ucapan() {
	var time = moment.tz('Asia/Jakarta').format('HH')
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
