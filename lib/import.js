// inspired from https://github.com/nodejs/modules/issues/307#issuecomment-858729422

// import { resolve } from 'path'
// import { Worker, isMainThread, parentPort, workerData } from 'worker_threads'
import Helper from './helper.js'

var WORKER_DIR = Helper.__dirname(
	import.meta.url, false)
// var WORKER_FILE = Helper.__filename(resolve(WORKER_DIR, './import.js'), false)

// if (!isMainThread) importModule(workerData)

// async function importModule(file) {
//     file = Helper.__filename(file)
//     var module = await import(file).catch(console.error)
//     var result = module && 'default' in module ? module.default : module
//     parentPort.postMessage(JSON.stringify(result), result)
// }

/**
 * @template T
 * @param {string} module 
 * @returns {Promise<T>}
 */
export default async function importLoader(module) {
	// return new Promise((resolve, reject) => {
	//     var worker = new Worker(new URL(WORKER_FILE), {
	//         workerData: module
	//     })
	//     var killWorker = () => worker.terminate().catch(() => { })
	//     worker.once('message', (msg) => (killWorker(), console.log(msg.data), resolve(msg)))
	//     worker.once('error', (error) => (killWorker(), reject(error)))
	// })
	module = Helper.__filename(module)
	var module_ = await import(`${module}?id=${Date.now()}`)
	var result = module_ && 'default' in module_ ? module_.default : module_
	return result
}