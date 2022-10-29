// @ts-check
import yargs from 'yargs'
import os from 'os'
import path from 'path'
import {
	fileURLToPath,
	pathToFileURL
} from 'url'
import {
	createRequire
} from 'module'
import fs from 'fs'

/** @param {ImportMeta | string} pathURL */
var __filename = function filename(pathURL =
	import.meta, rmPrefix = os.platform() !== 'win32') {
	var path = /** @type {ImportMeta} */ (pathURL).url || /** @type {String} */ (pathURL)
	return rmPrefix ?
		/file:\/\/\//.test(path) ?
		fileURLToPath(path) :
		path : /file:\/\/\//.test(path) ?
		path : pathToFileURL(path).href
}

/** @param {ImportMeta | string} pathURL */
var __dirname = function dirname(pathURL) {
	return path.dirname(__filename(pathURL, true))
}

/** @param {ImportMeta | string} dir */
var __require = function require(dir =
	import.meta) {
	var path = /** @type {ImportMeta} */ (dir).url || /** @type {String} */ (dir)
	return createRequire(path)
}
/** @param {string} file */
var checkFileExists = (file) => fs.promises.access(file, fs.constants.F_OK).then(() => true).catch(() => false)

/** @type {(name: string, path: string, query: { [Key: string]: any }, apikeyqueryname: string) => string} */
var API = (name, path = '/', query = {}, apikeyqueryname) => (name in global.APIs ? global.APIs[name] : name) + path + (query || apikeyqueryname ? '?' + new URLSearchParams(Object.entries({
	...query,
	...(apikeyqueryname ? {
		[apikeyqueryname]: global.APIKeys[name in global.APIs ? global.APIs[name] : name]
	} : {})
})) : '')
/** @type {ReturnType<yargs.Argv['parse']>} */
var opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())
var prefix = new RegExp('^[' + (opts['prefix'] || '‎xzXZ/i!#$%+£¢€¥^°=¶∆×÷π√✓©®:;?&.\\-').replace(/[|\\{}()[\]^$+*?.\-\^]/g, '\\$&') + ']')



export default {
	__filename,
	__dirname,
	__require,
	checkFileExists,
	API,
	opts,
	prefix
}