// @ts-check
import path from 'path'
import storeSystem from './store.js'
import Helper from './helper.js'
import { HelperConnection } from './simple.js'
import importFile from './import.js'
import db, { loadDatabase } from './database.js'
import single2multi from './single2multi.js'
import P from 'pino'
import pretty from 'pino-pretty'
import inquery from 'inquirer'
import QRCode from 'qrcode'
import {
	DisconnectReason,
	makeWASocket,
	fetchLatestBaileysVersion as versi,
	useMultiFileAuthState
} from '@whiskeysockets/baileys'

var stream = pretty({ colorize: true })

var authFolder = storeSystem.fixFileName(`${Helper.opts._[0] || ''}sessions`)
var authFile = `${Helper.opts._[0] || 'session'}.data.json`

var [isCredsExist, isAuthSingleFileExist, authState] = await Promise.all([
	Helper.checkFileExists(authFolder + '/creds.json'),
	Helper.checkFileExists(authFile),
	storeSystem.useMultiFileAuthState(authFolder)
])

var msgCache = new Map()

if (Helper.opts['singleauth'] || Helper.opts['singleauthstate']) {
	if (!isCredsExist && isAuthSingleFileExist) {
		console.debug('- singleauth -', 'creds.json not found', 'compiling singleauth to multiauth...')
		await single2multi(authFile, authFolder, authState)
		console.debug('- singleauth -', 'compiled successfully')
		authState = await storeSystem.useMultiFileAuthState(authFolder)
	} else if (!isAuthSingleFileExist) console.error('- singleauth -', 'singleauth file not found')
}

var storeFile = `${Helper.opts._[0] || 'data'}.store.json`

var logger = P({
	timestamp: () => `,"time":"${new Date().toJSON()}"`,
	level: Helper.opts['use_number'] || Helper.opts['use_code'] || Helper.opts['use_phone'] ? 'silent' : 'info'
}, stream).child({ class: 'baileys' })

var connectionOptions = {
	auth: authState.state,
	logger
}

var askForNumber = {
	type: 'input',
	name: 'number',
	message: 'Please enter your mobile phone number: ',
	validate: value => {
		let regex = /^[-+\d\s]+$/
		let pass = regex.test(value)
		if (pass) return true
		return 'Please enter a valid phone number...\nexample: +62 811-1111-1111 or 6281111111111'
	}
}

var conns = new Map()
var qrDisplayed = false

async function start(oldSocket = null, opts = {}) {
	var { version } = await versi()

	var conn = makeWASocket({
		...connectionOptions,
		...opts.connectionOptions,
		shouldSyncHistoryMessage: () => false,
		getMessage: async (key) => msgCache.get(key.id) || undefined,
		browser: ['BOTSTYLEE', 'safari', '4.0.0'],
		version,
		patchMessageBeforeSending: (message) => {
			var requiresPatch = !!(message.buttonsMessage || message.templateMessage || message.listMessage)
			if (requiresPatch) {
				message = {
					viewOnceMessage: {
						message: {
							messageContextInfo: {
								deviceListMetadataVersion: 2,
								deviceListMetadata: {}
							},
							...message
						}
					}
				}
			}
			return message
		}
	})

	console.clear()

	if ((Helper.opts['use_number'] || Helper.opts['use_code'] || Helper.opts['use_phone']) && !conn.authState.creds.me) {
		var inq = await inquery.prompt(askForNumber)
		console.log('use this code in your whatsapp: ' + await conn.requestPairingCode(inq.number.replace(/[^0-9]/g, '')))
	}

	HelperConnection(conn, { logger })

	if (oldSocket) {
		conn.isInit = oldSocket.isInit
		conn.isReloadInit = oldSocket.isReloadInit
	}
	if (conn.isInit == null) {
		conn.isInit = false
		conn.isReloadInit = true
	}

	conn.ev.on('messages.upsert', ({ messages }) => {
		for (const m of messages) {
			if (m.key?.id) msgCache.set(m.key.id, m)
		}
	})

	await reload(conn, false, opts).then((success) => console.log('- bind handler event -', success))

	return conn
}

var OldHandler = null

async function reload(conn, restartConnection, opts = {}) {
	if (!opts.handler) opts.handler = importFile(Helper.__filename(path.resolve('./handler.js'))).catch(console.error)
	if (opts.handler instanceof Promise) opts.handler = await opts.handler
	if (!opts.handler && OldHandler) opts.handler = OldHandler
	OldHandler = opts.handler

	var isReloadInit = !!conn.isReloadInit

	if (restartConnection) {
		try { conn.ws.close() } catch {}
		conn.ev.removeAllListeners()
		var newConn = await start(conn, opts)
		return newConn
	}

	Object.assign(conn, getMessageConfig())

	if (!isReloadInit) {
		if (conn.handler) conn.ev.off('messages.upsert', conn.handler)
		if (conn.connectionUpdate) conn.ev.off('connection.update', conn.connectionUpdate)
		if (conn.credsUpdate) conn.ev.off('creds.update', conn.credsUpdate)
		if (conn.participantsUpdate) conn.ev.off('group-participants.update', conn.participantsUpdate)
	}
	if (opts.handler) {
		conn.handler = opts.handler.handler.bind(conn)
		conn.participantsUpdate = opts.handler.participantsUpdate.bind(conn)
	}
	if (!opts.isChild) conn.connectionUpdate = connectionUpdate.bind(conn)
	conn.credsUpdate = authState.saveCreds.bind(conn)

	conn.ev.on('messages.upsert', conn.handler)
	if (!opts.isChild) conn.ev.on('connection.update', conn.connectionUpdate)
	conn.ev.on('creds.update', conn.credsUpdate)
	conn.ev.on('group-participants.update', conn.participantsUpdate)

	conn.isReloadInit = false
	return true
}

function renderQR(text) {
	QRCode.toString(text, { type: 'terminal', small: true }, (err, str) => {
		if (err) {
			console.log('[QR] Gagal render:', err.message)
			console.log('[QR] String QR:', text)
			return
		}
		console.log(str)
	})
}

async function connectionUpdate(update) {
	var { connection, lastDisconnect, isNewLogin, qr } = update

	if (qr) {
		if (!qrDisplayed) {
			console.log('\n========================================')
			console.log('SCAN QR CODE INI (Hanya muncul sekali):')
			console.log('========================================\n')
			renderQR(qr)
			console.log('\n========================================')
			console.log('QR Code tidak akan berubah. Silakan screenshot sekarang.')
			console.log('Setelah di-scan, bot akan otomatis reconnect.')
			console.log('========================================\n')
			qrDisplayed = true
		} else {
			console.log('[QR] QR Code refresh diabaikan. Gunakan QR yang sudah di-screenshot.')
		}
	}

	if (isNewLogin) this.isInit = true

	var code = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode
	if (code && code !== DisconnectReason.loggedOut) {
		try {
			var newConn = await reload(this, true)
			if (newConn) {
				global.conn = newConn
				conns.set('default', newConn)
			}
		} catch (e) {
			console.error(e)
		}
		global.timestamp.connect = new Date()
	}

	if (connection == 'open') {
		console.log('- opened connection -')
		qrDisplayed = false
	}

	if (db.data == null) loadDatabase()
}

function getMessageConfig() {
	var welcome = 'Hai, @user!\nSelamat datang di grup @subject\n\n@desc'
	var bye = 'Selamat tinggal @user!'
	var spromote = '@user sekarang admin!'
	var sdemote = '@user sekarang bukan admin!'
	var sDesc = 'Deskripsi telah diubah ke \n@desc'
	var sSubject = 'Judul grup telah diubah ke \n@subject'
	var sIcon = 'Icon grup telah diubah!'
	var sRevoke = 'Link group telah diubah ke \n@revoke'

	return { welcome, bye, spromote, sdemote, sDesc, sSubject, sIcon, sRevoke }
}

var conn = start(null, {}).catch(console.error)

export default {
	start,
	reload,

	conn,
	conns,
	logger,
	connectionOptions,

	authFolder,
	storeFile,
	authState,

	getMessageConfig
}
