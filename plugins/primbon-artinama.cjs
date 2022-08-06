var handler = async (m, {
	conn,
	command,
	usedPrefix,
	text
}) => {
	if (!text) throw `*masukan namanya...*\n*example*\n*${usedPrefix+command} benny*`
	var a = await axios.request("https://rest-beni.herokuapp.com/api/artinama?nama=" + text, {
		method: "GET"
	})
	m.reply(`${a.data.result}`)
}

handler.help = ['artinama [nama]']
handler.tags = ['primbon']
handler.command = /^artinama/i

module.exports = handler