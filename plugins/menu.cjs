var {
	promises
} = require('fs');
var {
	join
} = require('path');
var levelling = require('../lib/levelling.cjs')
var _package = JSON.parse(await promises.readFile(join(__dirname, '../package.json')).catch(_ => ({}))) || {}
var {
	exp,
	limit,
	level,
	role
} = db.data.users[m.sender]
var {
	min,
	xp,
	max
} = levelling.xpRange(level, global.multiplier)
var name = await conn.getName(m.sender)
var d = new Date(new Date + 3600000)
var locale = 'id'
// d.getTimeZoneOffset()
// Offset -420 is 18.00
// Offset    0 is  0.00
// Offset  420 is  7.00
var weton = ['Pahing', 'Pon', 'Wage', 'Kliwon', 'Legi'][Math.floor(d / 84600000) % 5]
var week = d.toLocaleDateString(locale, {
	weekday: 'long'
})
var date = d.toLocaleDateString(locale, {
	day: 'numeric',
	month: 'long',
	year: 'numeric'
})
var dateIslamic = Intl.DateTimeFormat(locale + '-TN-u-ca-islamic', {
	day: 'numeric',
	month: 'long',
	year: 'numeric'
}).format(d)
var time = d.toLocaleTimeString(locale, {
	hour: 'numeric',
	minute: 'numeric',
	second: 'numeric'
})
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
var totalreg = Object.keys(db.data.users).length
var rtotalreg = Object.values(db.data.users).filter(user => user.registered == true).length
var moment = require('moment-timezone')
var tags = {
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
		'info': 'Info',
		'': 'No Category'
    }
    for (let plugin of Object.values(global.plugins))
      if (plugin && 'tags' in plugin)
        for (let tag of plugin.tags)
          if (!tag in  tags) tags[tag] = tag
    let help = Object.values(global.plugins).map(plugin => {
      return {
        help: plugin.help,
        tags: plugin.tags,
        prefix: 'customPrefix' in plugin,
        limit: plugin.limit
      }
    })
    let groups = {}
    for (let tag in tags) {
      groups[tag] = []
      for (let menu of help)
        if (menu.tags && menu.tags.includes(tag))
          if (menu.help) groups[tag].push(menu)
    }
    conn.menu = conn.menu ? conn.menu : {}
    var before = conn.menu.before || ` ┌──「 ${conn.user.name} 」
│============================
├  ${ucapan()}, %name!
├ Nama : %name!
├ Hari: *%week %weton*
├ Tanggal: *%date*
├ Waktu: *%time*
├ Uptime: *%uptime*
├ Database: *%totalreg*
│============================`
    let header = conn.menu.header || '┌◪「 %category ッ」◪'
    let body   = conn.menu.body   || '├❏  %cmd%islimit'
    let footer = conn.menu.footer || '└────\n'
    let after  = conn.menu.after  || '\n'
    let _text  = before + '\n'
    for (let tag in groups) {
      _text += header.replace(/%category/g, tags[tag]) + '\n'
      for (let menu of groups[tag]) {
        for (let help of menu.help)
          _text += body.replace(/%cmd/g, menu.prefix ? help : '%p' + help).replace(/%islimit/g, menu.limit ? ' (Limit)' : '')  + '\n'
      }
      _text += footer + '\n'
    }
    _text += after
    text =  typeof conn.menu == 'string' ? conn.menu : typeof conn.menu == 'object' ? _text : ''
    var replace = {
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
    text = text.replace(new RegExp(`%(${Object.keys(replace).join`|`})`, 'g'), (_, name) => replace[name])
    //conn.reply(m.chat, text.trim(), m)
    await conn.send2Button(m.chat, text.trim(), '𝚈𝚊𝚖𝚊𝚒𝙱𝚘𝚝𝚣ッ々 - ``` Since August 2021 ```\nCMD : Menu', '♦️INFO BOT♦️', '#info', '🔱OWNER🔱', '#creator')
  } catch (e) {
    conn.reply(m.chat, 'Maaf, menu sedang error', m)
    throw e
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
