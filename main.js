// TODO: reduce global variabel usage

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
process.on('uncaughtException', console.error)

import './config.js'

import {
	spawn
} from 'child_process'
import {
	protoType,
	serialize
} from './lib/simple.js'
import {
	plugins,
	filesInit,
	reload,
	pluginFolder,
	pluginFilter
} from './lib/plugins.js'
import Connection from './lib/connection.js'
import Helper from './lib/helper.js'
import db, {
	loadDatabase
} from './lib/database.js'
import clearTmp from './lib/clearTmp.js';
import axios from 'axios';
import former from 'form-data';
import cheri from 'cheerio';
import fetch from 'node-fetch';
import cron from 'node-cron';
import fs from 'fs';
global.fetch = fetch
global.fs = fs
global.axios = axios
global.former = former
global.cheerio = cheri
global.db = db
global.loadDatabase = await loadDatabase()
global.delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
global.plugins = plugins
var PORT = process.env.PORT || process.env.SERVER_PORT || 3000

protoType()
serialize()
if (db.data == null) loadDatabase

Object.assign(global, Helper)
// global.Fn = function functionCallBack(fn, ...args) { return fn.call(Connection.conn, ...args) }
global.timestamp = {
	start: new Date
}

// global.opts['db'] = process.env['db']

global.conn = Object.defineProperty(Connection, 'conn', {
	value: await Connection.conn,
	enumerable: true,
	configurable: true,
	writable: true
}).conn
global.store = Connection.store
// load plugins
filesInit(pluginFolder, pluginFilter, conn).then(_ => console.log(Object.keys(plugins))).catch(console.error)

Object.freeze(reload)

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
	if (s.ffmpeg && !s.ffmpegWebp)(conn?.logger || console).warn('Stickers may not animated without libwebp on ffmpeg (--enable-ibwebp while compiling ffmpeg)')
	if (!s.convert && !s.magick && !s.gm)(conn?.logger || console).warn('Stickers may not work without imagemagick if libwebp on ffmpeg doesnt isntalled (pkg install imagemagick)')
}
async function expired() {
	return new Promise(async (resolve, reject) => {
		var user = Object.keys(db.data.users)
		var chat = Object.keys(db.data.chats)
		for (var jid of user) {
			var users = db.data.users[jid]
			var {
				name,
				premium,
				expired
			} = users
			if (users.premium) {
				if (Date.now() >= users.expired) {
					users.premium = false
					users.expired = 0
					users.limitjoinprem = 0
					users.limitjoinfree = 0
					conn.reply(jid, 'hai\nmasa premium kamu sekarang sudah habis.\njika ingin memperpanjang lagi silahkan chat owner.\nterima kasih telah menggunakan bot :)\n' + `owner: @${nomorown}`, null, {
						mentions: [nomorown + '@s.whatsapp.net']
					})
					resolve(console.log(`masa premium ${name} sudah habis`))
				}
			}
			if (users.sewa) {
				if (users.limitjoinprem == 0) {
					users.sewa = false
					users.limitjoinfree = 1
				}
			}
		}
		for (var id of chat) {
			if (id.endsWith('g.us')) {
				var chats = db.data.chats[id]
				if (chats.grouprental) {
					if (Date.now() >= chats.expired) {
						chats.grouprental = false
						chats.expired = 0
						await conn.reply(id, `masa menetap di ${await conn.getName(id)} sudah habis.\nBot sebentar lagi akan keluar.\nterima kasih telah menggunakan bot kami.\nChat owner kami jika ingin menyewa lagi :)\nowner: @${nomorown}`, null, {
							mentions: [nomorown + '@s.whatsapp.net']
						})
						await delay(3000)
						await conn.groupLeave(id)
						resolve(console.log(`masa menetap di ${await conn.getName(id)} sudah habis`))
					}
				}
			}
		}
	})
}
setInterval(async () => {
	var b = await expired()
}, 1000)
setInterval(async () => {
	var a = await clearTmp()
	console.log(`successfully clear tmp`)
}, 180000)
_quickTest()
	.then(() => (conn?.logger.info || console.log)('Quick Test Done'))
	.catch(console.error)
