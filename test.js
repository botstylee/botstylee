import fs from 'fs'
import path, {
	dirname
} from 'path'
import assert from 'assert'
import {
	spawn
} from 'child_process'
import syntaxError from 'syntax-error'
import {
	fileURLToPath
} from 'url'
import {
	createRequire
} from 'module'

var __filename = fileURLToPath(
	import.meta.url)
var __dirname = dirname(__filename)
var require = createRequire(__dirname)

var folders = ['.', ...Object.keys(require(path.join(__dirname, './package.json')).directories)]
var files = []
for (var folder of folders)
	for (var file of fs.readdirSync(folder).filter(v => v.endsWith('.js')))
		files.push(path.resolve(path.join(folder, file)))
for (var file of files) {
	if (file == __filename) continue
	console.error('Checking', file)
	var error = syntaxError(fs.readFileSync(file, 'utf8'), file, {
		sourceType: 'module',
		allowReturnOutsideFunction: true,
		allowAwaitOutsideFunction: true
	})
	if (error) assert.ok(error.length < 1, file + '\n\n' + error)
	assert.ok(file)
	console.log('Done', file)
}