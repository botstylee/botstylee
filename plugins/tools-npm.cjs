var fetch = require('node-fetch')
var handler = async (m, {
	text
}) => {
	if (!text) throw 'Input Query'
	var res = await fetch(`http://registry.npmjs.com/-/v1/search?text=${text}`)
	var {
		objects
	} = await res.json()
	if (!objects.length) throw `Query "${text}" not found :/`
	var txt = objects.map(({
		package: pkg
	}) => {
		return `*${pkg.name}* (v${pkg.version})\n_${pkg.links.npm}_\n_${pkg.description}_`
	}).join`\n\n`
	m.reply(txt)
}
handler.help = ['npmsearch']
handler.tags = ['tools']
handler.command = /^npm(js|search)?$/i

module.exports = handler