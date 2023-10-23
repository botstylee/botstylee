var handler = async (m, {
	text,
	usedPrefix,
	command
}) => {

	if (!text) throw `where is the path?\n\nexample:\n${usedPrefix + command} plugins/menu.js`
	if (!m.quoted.text) throw `reply code`
	var path = `${text}`
	await fs.writeFileSync(path, m.quoted.text)

	m.reply(`Saved ${path} to file!`)
}

handler.command = ['savefile', 'sf']

handler.owner = true
module.exports = handler