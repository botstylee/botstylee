var handler = async (m, {
	command,
	args,
	usedPrefix
}) => {
	var er = `contoh:\n\n${usedPrefix + command} cinta
Opsi Tersedia:
• cinta
• rindu
• mimpi
• sendiri
• sabar
• kesedihan
• pernikahan
• kemerdekaan
by Ariffb, thanks to Wildan Izzudin
https://neoxr-api.herokuapp.com/docs`
	if (!args[0]) throw er
	switch (args[0].toLowerCase()) {
		case 'cinta':
		case 'rindu':
		case 'mimpi':
		case 'sendiri':
		case 'sabar':
		case 'kesedihan':
		case 'pernikahan':
		case 'kemerdekaan':
			quotes(args[0].toLowerCase()).then(res => {
				var data = JSON.stringify(res)
				var json = JSON.parse(data)
				var random = Math.floor(Math.random() * json.data.length)
				var hasil = json.data[random]
				var {
					author,
					bio,
					quote
				} = hasil
				m.reply(`“${quote}”\n\n${author} - ${bio}`)
			})
			break
		default:
			throw er
	}
}
handler.help = ['katabijak'].map(v => v + ' <opsi>')
handler.tags = ['tools']
handler.command = /^(katabijak|jagokata)$/i

module.exports = handler

function quotes(input) {
	return new Promise((resolve, reject) => {
		fetch('https://jagokata.com/kata-bijak/kata-' + input.replace(/\s/g, '_') + '.html?page=1')
			.then(res => res.text())
			.then(res => {
				var $ = cheerio.load(res)
				data = []
				$('div[id="main"]').find('ul[id="citatenrijen"] > li').each(function(index, element) {
					x = $(this).find('div[class="citatenlijst-auteur"] > a').text().trim()
					y = $(this).find('span[class="auteur-beschrijving"]').text().trim()
					z = $(element).find('q[class="fbquote"]').text().trim()
					data.push({
						author: x,
						bio: y,
						quote: z
					})
				})
				data.splice(2, 1)
				if (data.length == 0) return resolve({
					creator: 'BOTSTYLE',
					status: false
				})
				resolve({
					creator: 'BOTSTYLE',
					status: true,
					data
				})
			}).catch(reject)
	})
}
