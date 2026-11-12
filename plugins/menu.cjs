var fs = require('fs').promises
var path = require('path')
var moment = require('moment-timezone')

var tags = {
	main: 'Main', game: 'Games', rpg: 'RPG Games', xp: 'Exp & Limit', sticker: 'Sticker',
	kerang: 'Kerang Ajaib', primbon: 'Primbon Jawa', admin: 'Admin', group: 'Group',
	premium: 'Premium', textpro: 'Textpro', ephoto: 'Ephoto', photooxy: 'Photooxy',
	photofunia: 'Photofunia', internet: 'Internet', anonymous: 'Anonymous Chat',
	downloader: 'Downloader', tools: 'Tools', wattpadz: 'Wattpadz', anime: 'Anime',
	audio: 'Audio', fun: 'Fun', database: 'Database', vote: 'Voting', absen: 'Absen',
	owner: 'Owner', user: 'User', advanced: 'Advanced', info: 'Info', canvas: 'Canvas'
}

var handler = async (m, { conn, usedPrefix = '.', __dirname }) => {
	try {
		var db = global.db?.data
		var user = db?.users?.[m.sender] || {}
		var packagePath = path.join(__dirname || process.cwd() + '/plugins', '../package.json')
		var packageInfo = {}
		try { packageInfo = JSON.parse(await fs.readFile(packagePath, 'utf8')) } catch {}

		var name = await conn.getName(m.sender).catch(() => m.pushName || 'Pengguna')
		var now = moment.tz('Asia/Jakarta')
		var plugins = global.plugins || {}
		var entries = Object.entries(plugins).filter(([, plugin]) => plugin && !plugin.disabled)
		var lines = []
		var prefixFor = plugin => plugin.customPrefix || conn.prefix || global.prefix || usedPrefix
		var getHelp = plugin => {
			if (Array.isArray(plugin.help)) return plugin.help
			if (typeof plugin.help === 'string') return [plugin.help]
			return []
		}

		lines.push(`╭─「 *BOTSTYLEE MENU* 」`)
		lines.push(`│ Halo, ${name}!`)
		lines.push(`│ Tanggal: ${now.locale('id').format('dddd, D MMMM YYYY')}`)
		lines.push(`│ Waktu: ${now.format('HH:mm:ss')} WIB`)
		lines.push(`│ Role: ${user.role || 'Beginner'} | Uptime: ${clockString(process.uptime() * 1000)}`)
		lines.push(`╰────────────────`)

		for (var [tag, label] of Object.entries(tags)) {
			var commands = []
			for (var [filename, plugin] of entries) {
				var pluginTags = Array.isArray(plugin.tags) ? plugin.tags : plugin.tags ? [plugin.tags] : []
				if (!pluginTags.includes(tag)) continue
				var help = getHelp(plugin)
				for (var item of help) {
					if (!item) continue
					var commandPrefix = 'customPrefix' in plugin ? '' : prefixFor(plugin)
					commands.push(`│ ${commandPrefix}${item}${plugin.limit ? ' 🄻' : ''}${plugin.premium ? ' 🄿' : ''}`)
				}
			}
			if (commands.length) {
				lines.push('', `┌─「 *${label}* 」`, ...commands, '└────────────')
			}
		}

		lines.push('', `Gunakan ${usedPrefix}menu untuk menampilkan menu ini.`)
		if (packageInfo.version) lines.push(`Versi: ${packageInfo.version}`)
		return await conn.reply(m.chat, lines.join('\n'), m)
	} catch (error) {
		console.error('Menu plugin error:', error)
		return conn.reply(m.chat, 'Maaf, menu gagal ditampilkan. Periksa log bot untuk detailnya.', m)
	}
}

handler.help = ['menu', 'help', '?']
handler.tags = ['main']
handler.command = /^(menu|help|\?)$/i
module.exports = handler

function clockString(ms) {
	var totalSeconds = Math.floor(Math.max(0, Number(ms) || 0) / 1000)
	var hours = Math.floor(totalSeconds / 3600)
	var minutes = Math.floor((totalSeconds % 3600) / 60)
	var seconds = totalSeconds % 60
	return [hours, minutes, seconds].map(value => String(value).padStart(2, '0')).join(':')
}
