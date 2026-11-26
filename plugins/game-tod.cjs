var fetch = require('node-fetch')

var handler = async (m, {
	conn,
	command,
	usedPrefix
}) => {
	if (/^tod$/i.test(command)) {
		var randomChoice = pickRandom([`${usedPrefix}truth`, `${usedPrefix}dare`])
		await conn.reply(m.chat, `乂  *TRUTH OR DARE*\n\nPilih salah satu:\n\n• ${usedPrefix}truth — dapat pertanyaan Truth\n• ${usedPrefix}dare — dapat tantangan Dare\n\nAtau ketik *${randomChoice}* untuk pilihan acak.`, m)
	}

	if (/^truth$/i.test(command)) {
		try {
			var res = await fetch(global.API('botstyle', '/api/truth', {}, 'apikey'))
			var json = await res.json()
			if (!json.result) throw new Error('Respons kosong dari API truth')
			await conn.reply(m.chat, `乂  *TRUTH*\n\n${json.result}\n\n_ketik ${usedPrefix}dare untuk tantangan_`, m)
		} catch (e) {
			console.error('[tod] truth error:', e)
			await conn.reply(m.chat, 'Gagal mengambil Truth, coba lagi nanti.', m)
		}
	}

	if (/^dare$/i.test(command)) {
		try {
			var res = await fetch(global.API('botstyle', '/api/dare', {}, 'apikey'))
			var json = await res.json()
			if (!json.result) throw new Error('Respons kosong dari API dare')
			await conn.reply(m.chat, `乂  *DARE*\n\n${json.result}\n\n_ketik ${usedPrefix}truth untuk pertanyaan_`, m)
		} catch (e) {
			console.error('[tod] dare error:', e)
			await conn.reply(m.chat, 'Gagal mengambil Dare, coba lagi nanti.', m)
		}
	}
}

handler.help = ['tod']
handler.tags = ['game']
handler.command = /^(tod|truth|dare)$/i

module.exports = handler

function pickRandom(list) {
	return list[Math.floor(list.length * Math.random())]
}
