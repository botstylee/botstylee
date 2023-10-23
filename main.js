process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
process.on('uncaughtException', console.error)

import './config.js';
import Connection from './lib/connection.js';
import Helper from './lib/helper.js';
import db, {
	loadDatabase
} from './lib/database.js';
import clearTmp from './lib/clearTmp.js';
import {
	spawn
} from 'child_process';
import {
	protoType,
	serialize
} from './lib/simple.js';
import {
	plugins,
	loadPluginFiles,
	reload,
	pluginFolder,
	pluginFilter
} from './lib/plugins.js';
import axios from 'axios';
import fetch from 'node-fetch';
import former from 'form-data';
import fs from 'fs';
import cron from 'node-cron';
import toMs from 'ms';
global.former = former
global.fetch = fetch
global.fs = fs
global.axios = axios
global.db = db
global.delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
global.plugins = plugins
var PORT = process.env.PORT || process.env.SERVER_PORT || 3000
protoType()
serialize()

// Assign all the value in the Helper to global
Object.assign(global, {
	...Helper,
	timestamp: {
		start: Date.now()
	}
})


// global.opts['db'] = process.env['db']
/** @type {import('./lib/connection.js').Socket} */
global.conn = Object.defineProperty(Connection, 'conn', {
	value: await Connection.conn,
	enumerable: true,
	configurable: true,
	writable: true
}).conn
global.store = Connection.store
loadPluginFiles(pluginFolder, pluginFilter, {
		logger: conn.logger,
		recursiveRead: true
	}).then(_ => console.log(Object.keys(plugins)))
	.catch(console.error)
// load plugins
if (db.data == null) {
	await loadDatabase()
}
async function expired() {
	return new Promise(async (resolve, reject) => {
		var user = Object.keys(db.data.users)
		var chat = Object.keys(db.data.chats)
		for (var jid of user) {
			var users = db.data.users[jid]
			if (users.banned) {
				if (Date.now() >= users.banexpired && users.banexpired !== 0) {
					users.banned = false
					users.banexpired = 0
				}
			}
			if (users.premium) {
				if (Date.now() >= users.expired) {
					conn.reply(jid, 'hai\nmasa premium kamu sekarang sudah habis.\njika ingin memperpanjang lagi silahkan chat owner.\nterima kasih telah menggunakan bot :)\n' + `owner: @${nomorown}`, null, {
						mentions: [nomorown + '@s.whatsapp.net']
					})
					users.premium = false
					users.expired = 0
					users.tokenpremium = 0
					users.tokenfree = 0
					resolve(console.log(`masa premium ${name} sudah habis`))
				}
			}
		}
	})
}
async function petproduction() {
	return new Promise(async (resolve, reject) => {
		var user = Object.keys(db.data.users)
		for (var jid of user) {
			var users = db.data.users[jid]
			if (!users.pet) users.pet = [{
				petname: 'ayam',
				level: 0,
				production: 0,
				hasproduction: 0,
				active: false
			}, {
				petname: 'kucing',
				level: 0,
				production: 0,
				hasproduction: 0,
				active: false
			}, {
				petname: 'kambing',
				level: 0,
				production: 0,
				hasproduction: 0,
				active: false
			}, {
				petname: 'sapi',
				level: 0,
				production: 0,
				hasproduction: 0,
				active: false
			}, {
				petname: 'kuda',
				level: 0,
				production: 0,
				hasproduction: 0,
				active: false
			}]
			if (users.pet.find(v => v.active == true)) {
				users.mp += users.pet.find(v => v.active == true).production
				users.pet.find(v => v.active == true).hasproduction += users.pet.find(v => v.active == true).production
			}
		}
	})
}
cron.schedule('0 0 */12 * * *', () => {
	var useres = Object.keys(db.data.users)
	for (var jid of useres) {
		db.data.users[jid].limit = 50
	}
	console.log('Add Limit')
}, {
	scheduled: true,
	timezone: "Asia/Jakarta"
});
cron.schedule('0 */2 * * * *', async () => {
	await expired()
}, {
	scheduled: true,
	timezone: "Asia/Jakarta"
});
// Auto restart if ram usage has reached the limit, if you want to use enter the ram size in bytes
var ramCheck = setInterval(() => {
	var ramUsage = process.memoryUsage().rss
	if (ramUsage >= global.ram_usage) {
		clearInterval(ramCheck)
		process.send('reset')
	}
}, 60 * 1000) // Checking every 1 minutes
if (!opts['test']) {
	setInterval(async () => {
		await Promise.allSettled([
			db.data ? db.write() : Promise.reject('db.data is null'),
			(opts['autocleartmp'] || opts['cleartmp']) ? clearTmp() : Promise.resolve()
		])
		Connection.store.writeToFile(Connection.storeFile)
	}, 60 * 1000)
}
if (opts['server'])(await import('./server.js')).default(conn, PORT)

// Quick Test
async function _quickTest() {
	var test = await Promise.all([
		spawn('ffmpeg'),
		spawn('ffprobe'),
		spawn('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-filter_complex', 'color', '-frames:v', '1', '-f', 'webp', '-']),
		spawn('convert'),
		spawn('magick'),
		spawn('gm'),
		spawn('find', ['--version'])
	].map(p => {
		return Promise.race([
			new Promise(resolve => {
				p.on('close', code => {
					resolve(code !== 127)
				})
			}),
			new Promise(resolve => {
				p.on('error', _ => resolve(false))
			})
		])
	}))
	var [ffmpeg, ffprobe, ffmpegWebp, convert, magick, gm, find] = test
	console.log(test)
	var s = global.support = {
		ffmpeg,
		ffprobe,
		ffmpegWebp,
		convert,
		magick,
		gm,
		find
	}
	// require('./lib/sticker').support = s
	Object.freeze(global.support)

	if (!s.ffmpeg)(conn?.logger || console).warn('Please install ffmpeg for sending videos (pkg install ffmpeg)')
	if (s.ffmpeg && !s.ffmpegWebp)(conn?.logger || console).warn('Stickers may not animated without libwebp on ffmpeg (--enable-libwebp while compiling ffmpeg)')
	if (!s.convert && !s.magick && !s.gm)(conn?.logger || console).warn('Stickers may not work without imagemagick if libwebp on ffmpeg doesnt isntalled (pkg install imagemagick)')
}
setInterval(async () => {
	var a = await clearTmp()
	console.log(a)
}, 180000)
_quickTest()
	.then(() => (conn?.logger?.info || console.log)('Quick Test Done'))
	.catch(console.error)