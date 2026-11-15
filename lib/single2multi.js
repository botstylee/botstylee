import fs from 'fs'
import path from 'path'
import store from './store.js'

/** @type {typeof import('@whiskeysockets/baileys')} */
var {
	BufferJSON
} = await import('@whiskeysockets/baileys')

/**
 * Convert legacy single-file auth data to the multi-file auth format.
 *
 * @param {string} fileSingle
 * @param {string} folderMulti
 * @param {Awaited<ReturnType<import('./store.js').MultiFileAuthStateStore>>} authState
 */
export default async function single2multi(fileSingle, folderMulti, authState) {
	var authSingleResult = JSON.parse(
		await fs.promises.readFile(fileSingle, 'utf8'),
		BufferJSON.reviver
	)

	var authSingleCreds = authSingleResult.creds || {}
	var authSingleKeys = authSingleResult.keys || {}

	var writeData = (data, file) => {
		return fs.promises.writeFile(
			path.join(folderMulti, store.fixFileName(file)),
			JSON.stringify(data, store.JSONreplacer)
		)
	}

	// Convert the legacy key-category names to Baileys multi-file key names.
	var keys = {}

	for (var [legacyName, value] of Object.entries(authSingleKeys)) {
		if (!value) continue

		var category = Object.entries(store.KEY_MAP)
			.find(([, legacyKey]) => legacyKey === legacyName)?.[0]

		if (category) keys[category] = value
	}

	await Promise.all([
		writeData(authSingleCreds, 'creds.json'),
		authState.state.keys.set(keys)
	])
}
