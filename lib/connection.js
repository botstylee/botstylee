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

import makeWASocket, {
	DisconnectReason,
	fetchLatestWaWebVersion
} from '@whiskeysockets/baileys'

const stream = pretty({
	colorize: true
})

const authFolder = storeSystem.fixFileName(`${Helper.opts._[0] || ''}sessions`)
const authFile = `${Helper.opts._[0] || 'session'}.data.json`

const [
	isCredsExist,
	isAuthSingleFileExist
] = await Promise.all([
	Helper.checkFileExists(`${authFolder}/creds.json`),
	Helper.checkFileExists(authFile)
])

let authState = await storeSystem.useMultiFileAuthState(authFolder)
const store = storeSystem.makeInMemoryStore()

// Convert single-file auth to multi-file auth when requested.
if (Helper.opts['singleauth'] || Helper.opts['singleauthstate']) {
	if (!isCredsExist && isAuthSingleFileExist) {
		console.debug(
			'- singleauth -',
			'creds.json not found',
			'compiling singleauth to multiauth...'
		)

		await single2multi(authFile, authFolder, authState)
		console.debug('- singleauth -', 'compiled successfully')

		authState = await storeSystem.useMultiFileAuthState(authFolder)
	} else if (!isAuthSingleFileExist) {
		console.error('- singleauth -', 'singleauth file not found')
	}
}

const storeFile = `${Helper.opts._[0] || 'data'}.store.json`
store.readFromFile(storeFile)

const logger = P({
	timestamp: () => `,"time":"${new Date().toJSON()}"`,
	level:
		Helper.opts['use_number'] ||
		Helper.opts['use_code'] ||
		Helper.opts['use_phone']
			? 'silent'
			: 'info'
}, stream).child({
	class: 'baileys'
})

/** @type {import('@whiskeysockets/baileys').UserFacingSocketConfig} */
const connectionOptions = {
	printQRInTerminal:
		!Helper.opts['use_number'] &&
		!Helper.opts['use_code'] &&
		!Helper.opts['use_phone'],
	auth: authState.state,
	logger
}

/**
 * @typedef {{
 *   handler?: typeof import('../handler').handler;
 *   participantsUpdate?: typeof import('../handler').participantsUpdate;
 *   groupsUpdate?: typeof import('../handler').groupsUpdate;
 *   onDelete?: typeof import('../handler').deleteUpdate;
 *   connectionUpdate?: typeof connectionUpdate;
 *   credsUpdate?: () => void;
 * }} EventHandlers
 *
 * @typedef {Required<import('@whiskeysockets/baileys').UserFacingSocketConfig>['logger']} Logger
 *
 * @typedef {ReturnType<typeof makeWASocket> & EventHandlers & {
 *   isInit?: boolean;
 *   isReloadInit?: boolean;
 *   msgqueque?: import('./queque').default;
 *   logger?: Logger;
 * }} Socket
 */

const askForNumber = {
	type: 'input',
	name: 'number',
	message: 'Please enter your mobile phone number: ',
	validate(value) {
		const regex = /^[-+\d\s]+$/

		if (regex.test(value)) {
			return true
		}

		return 'Please enter a valid phone number...\nexample: +62 811-1111-1111 or 6281111111111'
	}
}

/** @type {Map<string, Socket>} */
const conns = new Map()

/**
 * @param {Socket | null} oldSocket
 * @param {{
 *   handler?: typeof import('../handler');
 *   isChild?: boolean;
 *   connectionOptions?: Partial<import('@whiskeysockets/baileys').UserFacingSocketConfig>;
 *   store?: typeof store;
 * }} opts
 */
async function start(oldSocket = null, opts = {}) {
	const activeStore = opts.store || store
	const { version } = await fetchLatestWaWebVersion()

	/** @type {Socket} */
	const conn = makeWASocket({
		...connectionOptions,
		...opts.connectionOptions,
		auth: authState.state,
		logger,
		version,
		getMessage: async (key) => {
			const message = activeStore.loadMessage(
				key.remoteJid || '',
				key.id || ''
			)

			return message?.message
		},
		browser: ['Botstylee', 'Chrome', '1.0.0']
	})

	console.clear()

	const shouldUsePairingCode =
		Helper.opts['use_number'] ||
		Helper.opts['use_code'] ||
		Helper.opts['use_phone']

	if (shouldUsePairingCode && !conn.authState.creds.registered) {
		const answer = await inquery.prompt(askForNumber)
		const phoneNumber = answer.number.replace(/[^0-9]/g, '')
		const pairingCode = await conn.requestPairingCode(phoneNumber)

		console.log(`Use this code in your WhatsApp: ${pairingCode}`)
	}

	HelperConnection(conn, {
		store: activeStore,
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

	activeStore.bind(conn.ev, {
		groupMetadata: conn.groupMetadata
	})

	await reload(conn, false, {
		...opts,
		store: activeStore
	})

	console.log('- bind handler event -', true)

	return conn
}

let OldHandler = null

/**
 * @param {Socket} conn
 * @param {boolean} restartConnection
 * @param {{
 *   handler?: Promise<typeof import('../handler')> | typeof import('../handler');
 *   isChild?: boolean;
 *   store?: typeof store;
 * }} opts
 */
async function reload(conn, restartConnection, opts = {}) {
	if (!opts.handler) {
		opts.handler = importFile(
			Helper.__filename(path.resolve('./handler.js'))
		).catch(console.error)
	}

	if (opts.handler instanceof Promise) {
		opts.handler = await opts.handler
	}

	if (!opts.handler && OldHandler) {
		opts.handler = OldHandler
	}

	if (opts.handler) {
		OldHandler = opts.handler
	}

	if (restartConnection) {
		try {
			conn.ws.close()
		} catch {
			// The socket may already be closed.
		}

		conn.ev.removeAllListeners()

		const replacement = await start(conn, {
			...opts,
			store: opts.store || store
		})

		Object.assign(conn, replacement)
		return true
	}

	Object.assign(conn, getMessageConfig())

	if (!conn.isReloadInit) {
		if (conn.handler) {
			conn.ev.off('messages.upsert', conn.handler)
		}

		if (conn.connectionUpdate) {
			conn.ev.off('connection.update', conn.connectionUpdate)
		}

		if (conn.credsUpdate) {
			conn.ev.off('creds.update', conn.credsUpdate)
		}

		if (conn.participantsUpdate) {
			conn.ev.off('group-participants.update', conn.participantsUpdate)
		}
	}

	if (opts.handler) {
		conn.handler = opts.handler.handler.bind(conn)
		conn.participantsUpdate = opts.handler.participantsUpdate.bind(conn)
	}

	if (!opts.isChild) {
		conn.connectionUpdate = connectionUpdate.bind(conn)
	}

	conn.credsUpdate = authState.saveCreds

	if (conn.handler) {
		conn.ev.on('messages.upsert', conn.handler)
	}

	if (!opts.isChild && conn.connectionUpdate) {
		conn.ev.on('connection.update', conn.connectionUpdate)
	}

	conn.ev.on('creds.update', conn.credsUpdate)

	if (conn.participantsUpdate) {
		conn.ev.on('group-participants.update', conn.participantsUpdate)
	}

	conn.isReloadInit = false
	return true
}

/**
 * @this {Socket}
 * @param {import('@whiskeysockets/baileys').BaileysEventMap['connection.update']} update
 */
async function connectionUpdate(update) {
	console.log(JSON.stringify(update, null, 2))

	const {
		connection,
		lastDisconnect,
		isNewLogin
	} = update

	if (isNewLogin) {
		this.isInit = true
	}

	if (connection === 'close') {
		const code = lastDisconnect?.error?.output?.statusCode

		if (code !== DisconnectReason.loggedOut) {
			console.log(await reload(this, true).catch(console.error))

			if (global.timestamp) {
				global.timestamp.connect = new Date()
			}
		}
	}

	if (connection === 'open') {
		console.log('- opened connection -')
	}

	if (db.data == null) {
		loadDatabase()
	}
}

function getMessageConfig() {
	return {
		welcome: 'Hai, @user!\nSelamat datang di grup @subject\n\n@desc',
		bye: 'Selamat tinggal @user!',
		spromote: '@user sekarang admin!',
		sdemote: '@user sekarang bukan admin!',
		sDesc: 'Deskripsi telah diubah ke \n@desc',
		sSubject: 'Judul grup telah diubah ke \n@subject',
		sIcon: 'Icon grup telah diubah!',
		sRevoke: 'Link group telah diubah ke \n@revoke'
	}
}

const conn = start(null, {
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
