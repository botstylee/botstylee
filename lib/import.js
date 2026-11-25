// inspired from https://github.com/nodejs/modules/issues/307#issuecomment-858729422

import Helper from './helper.js'

var WORKER_DIR = Helper.__dirname(import.meta.url, false)

/**
 * Import module dengan cache busting (agar plugin bisa di-reload)
 * @template T
 * @param {string} module 
 * @returns {Promise<T>}
 */
export default async function importLoader(module) {
    try {
        module = Helper.__filename(module)
        var module_ = await import(`${module}?id=${Date.now()}`)
        var result = module_ && 'default' in module_ ? module_.default : module_
        return result
    } catch (e) {
        console.error(`[import] Gagal import '${module}':`, e.message)
        throw e
    }
}
