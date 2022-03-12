let fetch = require("node-fetch");

let handler = async (m, {
	conn,
	args,
	command, 
        usedPrefix, 
	text
}) => {
if (!text) throw `*masukan namanya...*\n*example*\n*${usedPrefix+command} benny*`
var a = await fetch("https://rest-beni.herokuapp.com/api/artinama?nama="+text) 
var b = await a.json() 
m.reply(`arti namamu adalah\n\n${b.result}`)
}

handler.help = ['artinama [nama]']
handler.tags = ['primbon']
handler.command = /^artinama/i

module.exports = handler
