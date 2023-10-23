// @ts-check
import * as ws from 'ws';
import path from 'path';
import storeSystem from './store.js';
import Helper from './helper.js';
import {
	HelperConnection
} from './simple.js';
import importFile from './import.js';
import db, {
	loadDatabase
} from './database.js';
import single2multi from './single2multi.js';
import P from 'pino';
import pretty from 'pino-pretty';
import inquery from 'inquirer';
var stream = pretty({
	colorize: true
})
/** @type {import('@adiwajshing/baileys')} */
// @ts-ignore
var {
	DisconnectReason,
	default: makeWASocket,
	fetchLatestWaWebVersion: versi
	// useSingleFileAuthState
} = (await import('@adiwajshing/baileys')).default

var authFolder = storeSystem.fixFileName(`${Helper.opts._[0] || ''}sessions`)
var authFile = `${Helper.opts._[0] || 'session'}.data.json`

var [
	isCredsExist,
	isAuthSingleFileExist,
	authState
] = await Promise.all([
	Helper.checkFileExists(authFolder + '/creds.json'),
	Helper.checkFileExists(authFile),
	storeSystem.useMultiFileAuthState(authFolder)
])

var store = storeSystem.makeInMemoryStore()

// Convert single auth to multi auth
if (Helper.opts['singleauth'] || Helper.opts['singleauthstate']) {
	if (!isCredsExist && isAuthSingleFileExist) {
		console.debug('- singleauth -', 'creds.json not found', 'compiling singleauth to multiauth...')
		await single2multi(authFile, authFolder, authState)
		console.debug('- singleauth -', 'compiled successfully')
		authState = await storeSystem.useMultiFileAuthState(authFolder)
	} else if (!isAuthSingleFileExist) console.error('- singleauth -', 'singleauth file not found')
}

var storeFile = `${Helper.opts._[0] || 'data'}.store.json`
store.readFromFile(storeFile)

// from: https://github.com/adiwajshing/Baileys/blob/master/src/Utils/logger.ts
var logger = P({
	timestamp: () => `,"time":"${new Date().toJSON()}"`,
	level: Helper.opts['use_number'] || Helper.opts['use_code'] || Helper.opts['use_phone'] ? 'silent' : 'info'
}, stream).child({
	class: 'baileys'
})

/** @type {import('@adiwajshing/baileys').UserFacingSocketConfig} */
var connectionOptions = {
	printQRInTerminal: Helper.opts['use_number'] || Helper.opts['use_code'] || Helper.opts['use_phone'] ? false : true,
	auth: authState.state,
	logger
}

/** 
 * @typedef {{ 
 *  handler?: typeof import('../handler').handler; 
 *  participantsUpdate?: typeof import('../handler').participantsUpdate; 
 *  groupsUpdate?: typeof import('../handler').groupsUpdate; 
 *  onDelete?:typeof import('../handler').deleteUpdate; 
 *  connectionUpdate?: typeof connectionUpdate; 
 *  credsUpdate?: () => void 
 * }} EventHandlers
 * @typedef {Required<import('@adiwajshing/baileys').UserFacingSocketConfig>['logger']} Logger
 * @typedef {ReturnType<typeof makeWASocket> & EventHandlers & { 
 *  isInit?: boolean; 
 *  isReloadInit?: boolean; 
 *  msgqueque?: import('./queque').default;
 *  logger?: Logger
 * }} Socket 
 */

var askForNumber = {
	type: 'input',
	name: 'number',
	message: 'Please enter your mobile phone number: ',
	validate: value => {
		let regex = /^[-+\d\s]+$/
		let pass = regex.test(value);
		if (pass) {
			return true;
		}
		return 'Please enter a valid phone number...\nexample: +62 811-1111-1111 or 6281111111111';
	}
}
/** @type {Map<string, Socket>} */
var conns = new Map();
/** 
 * @param {Socket?} oldSocket 
 * @param {{ 
 *  handler?: typeof import('../handler'); 
 *  isChild?: boolean; 
 *  connectionOptions?: Partial<import('@adiwajshing/baileys').UserFacingSocketConfig>; 
 *  store: typeof store 
 * }} opts
 */
async function start(oldSocket = null, opts = {
	store
}) {
	/** @type {Socket} */
	var conn = makeWASocket({
		...connectionOptions,
		...opts.connectionOptions,
		getMessage: async (key) => (
			{}
		).message,
		browser: ['@findme-19 / milkita-bot', 'safari', '4.0.0'],
		// To see the latest version : https://web.whatsapp.com/check-update?version=1&platform=web
		version: (await versi()).version,
		patchMessageBeforeSending: (message) => {
			var requiresPatch = !!(
				message.buttonsMessage ||
				message.templateMessage ||
				message.listMessage
			);
			if (requiresPatch) {
				message = {
					viewOnceMessage: {
						message: {
							messageContextInfo: {
								deviceListMetadataVersion: 2,
								deviceListMetadata: {},
							},
							...message,
						},
					},
				};
			}

			return message;
		},
	})
	console.clear()
	if (Helper.opts['use_number'] || Helper.opts['use_code'] || Helper.opts['use_phone'] && !conn.authState.creds.me) {
		var inq = await inquery.prompt(askForNumber)
		console.log('use this code in your whatsapp: ' + await conn.requestPairingCode(inq.number.replace(/[^0-9]/g, "")))
	}
	HelperConnection(conn, {
		store: opts.store,
		logger
	})

	if (oldSocket) {
		conn.isInit = oldSocket.isInit
		conn.isReloadInit = oldSocket.isReloadInit
	}
	if (conn.isInit == null) {
		conn.isInit = false
		conn.isReloadInit = true
	}

	store.bind(conn.ev, {
		groupMetadata: conn.groupMetadata
	})
	await reload(conn, false, opts).then((success) => console.log('- bind handler event -', success))

	return conn
}


var OldHandler = null
/** 
 * @param {Socket} conn 
 * @param {boolean} restartConnection
 * @param {{ 
 *  handler?: Promise<typeof import('../handler')> | typeof import('../handler'); 
 *  isChild?: boolean 
 * }} opts
 */
async function reload(conn, restartConnection, opts = {}) {
	if (!opts.handler) opts.handler = importFile(Helper.__filename(path.resolve('./handler.js'))).catch(console.error)
	if (opts.handler instanceof Promise) opts.handler = await opts.handler;
	if (!opts.handler && OldHandler) opts.handler = OldHandler
	OldHandler = opts.handler
	// var isInit = !!conn.isInit
	var isReloadInit = !!conn.isReloadInit
	if (restartConnection) {
		try {
			conn.ws.close()
		} catch {}
		// @ts-ignore
		conn.ev.removeAllListeners()
		Object.assign(conn, await start(conn) || {})
	}

	// Assign message like welcome, bye, etc.. to the connection
	Object.assign(conn, getMessageConfig())

	if (!isReloadInit) {
		if (conn.handler) conn.ev.off('messages.upsert', conn.handler)
		if (conn.connectionUpdate) conn.ev.off('connection.update', conn.connectionUpdate)
		if (conn.credsUpdate) conn.ev.off('creds.update', conn.credsUpdate)
		if (conn.participantsUpdate) conn.ev.off('group-participants.update', conn.participantsUpdate)
	}
	if (opts.handler) {
		conn.handler = /** @type {typeof import('../handler')} */ (opts.handler).handler.bind(conn)
		conn.participantsUpdate = /** @type {typeof import('../handler')} */ (opts.handler).participantsUpdate.bind(conn)
	}
	if (!opts.isChild) conn.connectionUpdate = connectionUpdate.bind(conn)
	conn.credsUpdate = authState.saveCreds.bind(conn)
	// conn.credsUpdate = authState.saveState.bind(conn)

	/** @typedef {Required<EventHandlers>} Event */
	conn.ev.on('messages.upsert', /** @type {Event} */ (conn).handler)
	if (!opts.isChild) conn.ev.on('connection.update', /** @type {Event} */ (conn).connectionUpdate)
	conn.ev.on('creds.update', /** @type {Event} */ (conn).credsUpdate)
	conn.ev.on('group-participants.update', /** @type {Event} */ (conn).participantsUpdate)

	conn.isReloadInit = false
	return true

}

/**
 * @this {Socket}
 * @param {import('@adiwajshing/baileys').BaileysEventMap<unknown>['connection.update']} update
 */
async function connectionUpdate(update) {
	console.log(JSON.stringify(update, null, 2))
	var {
		connection,
		lastDisconnect,
		isNewLogin
	} = update
	if (isNewLogin) this.isInit = true
	// @ts-ignore
	var code = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode
	if (code && code !== DisconnectReason.loggedOut) {
		console.log(await reload(this, true).catch(console.error))
		global.timestamp.connect = new Date
	}
	if (connection == 'open') console.log('- opened connection -')

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

	return {
		welcome,
		bye,
		spromote,
		sdemote,
		sDesc,
		sSubject,
		sIcon,
		sRevoke
	}
}

var conn = start(null, {
	store
}).catch(console.error)


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
	store,

	getMessageConfig
}