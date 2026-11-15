const fs = require('fs')
const path = require('path')
const moment = require('moment-timezone')

const DEFAULT_MENU = {
	before: [
		'│============================',
		'├ %greeting, %name!',
		'├ Nama: %name',
		'├ Hari: *%week %weton*',
		'├ Tanggal: *%date*',
		'├ Waktu: *%time*',
		'├ Uptime: *%uptime*',
		'│============================'
	].join('\n'),
	header: '┌◪「*%category*ッ」◪',
	body: '├❏ %cmd %islimit %isPremium',
	footer: '└────',
	after: ''
}

const TAGS = {
	main: 'Main', game: 'Games', rpg: 'RPG Games', xp: 'Exp & Limit',
	sticker: 'Sticker', kerang: 'Kerang Ajaib', primbon: 'Primbon Jawa',
	admin: 'Admin', group: 'Group', premium: 'Premium', textpro: 'Textpro',
	ephoto: 'Ephoto', photooxy: 'Photooxy', photofunia: 'Photofunia',
	internet: 'Internet', anonymous: 'Anonymous Chat', downloader: 'Downloader',
	tools: 'Tools', wattpadz: 'Wattpadz', anime: 'Anime', audio: 'Audio',
	fun: 'Fun', database: 'Database', vote: 'Voting', absen: 'Absen',
	owner: 'Owner', user: 'User', advanced: 'Advanced', info: 'Info'
}

const greeting = () => {
	const hour = Number(moment().tz('Asia/Jakarta').format('H'))
	if (hour >= 18) return 'Selamat malam'
	if (hour >= 15) return 'Selamat sore'
	if (hour >= 10) return 'Selamat siang'
	return 'Selamat pagi'
}

const clockString = milliseconds => {
	const ms = Number(milliseconds)
	if (!Number.isFinite(ms) || ms < 0) return '--:--:--'
	const hours = Math.floor(ms / 3600000)
	const minutes = Math.floor(ms / 60000) % 60
	const seconds = Math.floor(ms / 1000) % 60
	return [hours, minutes, seconds].map(value => String(value).padStart(2, '0')).join(':')
}

const handler = async (m, { conn, usedPrefix = '.', __dirname } = {}) => {
	try {
		const database = global.db?.data
		const user = database?.users?.[m.sender] || {}
		const name = await conn.getName(m.sender).catch(() => m.pushName || 'Teman')
		const now = moment().tz('Asia/Jakarta')
		const packagePath = path.join(__dirname || path.join(__dirname, '..', 'plugins'), '../package.json')
		let packageInfo = {}
		try {
			packageInfo = JSON.parse(await fs.promises.readFile(packagePath, 'utf8'))
		} catch {
			// Package metadata is optional; menu should still be available.
		}

		const module = await import('../lib/plugins.js')
		const plugins = Object.values(module.plugins || {}).filter(plugin =>
			plugin && typeof plugin === 'function' && !plugin.disabled
		)
		const entries = plugins.map(plugin => ({
			help: (Array.isArray(plugin.help) ? plugin.help : [plugin.help]).filter(Boolean),
			tags: (Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags]).filter(Boolean),
			customPrefix: Object.prototype.hasOwnProperty.call(plugin, 'customPrefix'),
			limit: plugin.limit,
			premium: plugin.premium
		}))

		const menuConfig = conn.menu && typeof conn.menu === 'object' ? conn.menu : {}
		const before = menuConfig.before || DEFAULT_MENU.before
		const header = menuConfig.header || DEFAULT_MENU.header
		const body = menuConfig.body || DEFAULT_MENU.body
		const footer = menuConfig.footer || DEFAULT_MENU.footer
		const after = menuConfig.after || DEFAULT_MENU.after
		const weton = ['Pahing', 'Pon', 'Wage', 'Kliwon', 'Legi'][Math.floor(now.valueOf() / 86400000 + 3) % 5]
		const sections = Object.entries(TAGS).map(([tag, category]) => {
			const commands = entries
				.filter(entry => entry.tags.includes(tag))
				.flatMap(entry => entry.help.map(command =>
					body
						.replace(/%cmd/g, entry.customPrefix ? command : `${usedPrefix}${command}`)
						.replace(/%islimit/g, entry.limit ? '🄻' : '')
						.replace(/%isPremium/g, entry.premium ? '🄿' : '')
						.trim()
				))

			if (!commands.length) return ''
			return `${header.replace(/%category/g, category)}\n${commands.join('\n')}\n${footer}`
		}).filter(Boolean)

		let text = [before, ...sections, after].filter(Boolean).join('\n')
		const replacements = {
			p: usedPrefix,
			name,
			role: user.role || 'Beginner',
			me: await conn.getName(conn.user?.jid || conn.user?.id || '').catch(() => 'Bot'),
			npmname: packageInfo.name || 'Botstylee',
			npmdesc: packageInfo.description || '',
			version: packageInfo.version || '',
			github: packageInfo.homepage?.url || packageInfo.homepage || 'https://github.com/benniismael1/botstylee',
			greeting: greeting(),
			week: now.format('dddd'),
			weton,
			date: now.format('dddd, D MMMM YYYY'),
			dateIslamic: new Intl.DateTimeFormat('id-TN-u-ca-islamic', { day: 'numeric', month: 'long', year: 'numeric' }).format(now.toDate()),
			time: now.format('HH:mm:ss'),
			uptime: clockString(process.uptime() * 1000),
			muptime: clockString(process.uptime() * 1000)
		}
		text = text.replace(/%([a-zA-Z]+)/g, (match, key) =>
			Object.prototype.hasOwnProperty.call(replacements, key) ? String(replacements[key]) : match
		)

		await conn.sendMessage(m.chat, { text: text.trim() }, { quoted: m })
	} catch (error) {
		console.error('[menu plugin]', error)
		await conn.sendMessage(m.chat, { text: 'Maaf, menu sedang error. Cek log bot untuk detailnya.' }, { quoted: m }).catch(() => {})
	}
}

handler.help = ['menu', 'help', '?']
handler.tags = ['main']
handler.command = /^(menu|help|\?)$/i

module.exports = handler
