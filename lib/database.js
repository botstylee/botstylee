import Helper from './helper.js'
import {
	Low,
	JSONFile
} from 'lowdb'
import {
	cloudDBAdapter,
	mongoDB,
	mongoDBV2
} from './DB_Adapters/index.js'
import lodash from 'lodash'

var databaseUrl = Helper.opts['db'] || ''
var databaseAdapter = /https?:\/\//.test(databaseUrl) ?
	new cloudDBAdapter(databaseUrl) : /mongodb(\+srv)?:\/\//i.test(databaseUrl) ?
	(Helper.opts['mongodbv2'] ? new mongoDBV2(databaseUrl) :
		new mongoDB(databaseUrl)) :
	new JSONFile(`${Helper.opts._[0] ? Helper.opts._[0] + '_' : ''}database.json`)
/** @typedef {{ [Key: string]: {[Key: string]: any } }} DatabaseData */
var database = /** @type {Low<DatabaseData> & { chain: import('lodash').ObjectChain<DatabaseData>, _read: Promise<void> | void }} */
	(new Low(databaseAdapter))

loadDatabase()

async function loadDatabase() {
	// If database is processed to be loaded from cloud, wait for it to be done
	if (database._read) await database._read
	if (database.data !== null) return database.data
	database._read = database.read().catch(console.error)
	await database._read
	console.log('- Database loaded -')
	database.data = {
		settings: {},
		users: {},
		chats: {},
		stats: {},
		sticker: {},
		game: {},
		...(database.data || {})
	}
	database.chain = lodash.chain(database.data)

	return database.data
}


export {
	databaseUrl,
	databaseAdapter,
	database,
	loadDatabase
}

export default database