let fetch = require("node-fetch");

let handler = async (m, {
	conn,
	args,
	command, 
        usedPrefix, 
	text
}) => {
var a = await fetch("https://bsbt-api-rest.herokuapp.com/api/artinama?nama="+text) 
var b = await a.json() 
m.reply(`arti namamu adalah\n\n${b.result}`)
}

handler.help = ['artinama [nama]']
handler.tags = ['primbon']
handler.command = /^artinama/i

module.exports = handler
