var fs = require('fs')
var path = require('path')
var {
	exec
} = require('child_process')

var handler = async (m, {
	conn,
	args,
	usedPrefix,
	text,
	command
}) => {
	try {
		var q = m.quoted ? m.quoted : m
		var mime = (q.msg || q).mimetype || ''
		if(/tomp3/.test(command)) {
			if (!/audio|video/.test(mime)) throw `Balas video/audio yang ingin diubah dengan caption *${usedPrefix + command}*`
			var audio = await q.download()
			if (!audio) throw 'Can\'t download audio!'
			var set = '-vn -c:a libopus -b:a 128k -vbr on -compression_level 10'
			var ran = (new Date * 1) + '.mp3'
			var media = path.join(__dirname, '../../tmp/' + ran)
			var filename = media + '.opus'
			await fs.promises.writeFile(media, audio)
			exec(`ffmpeg -i ${media} ${set} ${filename}`, async (err) => {
				await fs.promises.unlink(media)
				if (err) return Promise.reject(`_*Error!*_`)
				var buff = await fs.promises.readFile(filename)
				conn.sendFile(m.chat, buff, ran, null, m, /vn/.test(args[0]), {
					quoted: m,
					mimetype: 'audio/mp4'
				})
				await fs.promises.unlink(filename)
			})
		} else {
			if (!/audio/.test(mime)) throw `Balas vn/audio yang ingin diubah dengan caption *${usedPrefix + command}*`
			var audio = await q.download()
			if (!audio) throw 'Can\'t download audio!'
			var set
			if(/bass/.test(command)) set = '-af "firequalizer=gain_entry=\'entry(0,-8);entry(250,4);entry(1000,-8);entry(4000,0);entry(16000,-8)\'"'
			if (/blown/.test(command)) set = '-af acrusher=.1:1:64:0:log'
			if (/deep/.test(command)) set = '-af atempo=4/4,asetrate=44500*2/3'
			if (/test/.test(command)) set = text
			if (/earrape/.test(command)) set = '-af volume=4.5 -vcodec copy'
			if (/fast/.test(command)) set = '-filter:a "atempo=1.63,asetrate=44100"'
			if (/fat/.test(command)) set = '-filter:a "atempo=1.6,asetrate=22100"'
			if (/nightcore/.test(command)) set = '-filter:a atempo=1.06,asetrate=44100*1.25'
			if (/reverse/.test(command)) set = '-filter_complex "areverse"'
			if (/robot/.test(command)) set = '-filter_complex "afftfilt=real=\'hypot(re,im)*sin(0)\':imag=\'hypot(re,im)*cos(0)\':win_size=512:overlap=0.75"'
			if (/slow/.test(command)) set = '-filter:a "atempo=0.7,asetrate=44100"'
			if (/smooth/.test(command)) set = '-filter:v "minterpolate=\'mi_mode=mci:mc_mode=aobmc:vsbmc=1:fps=120\'"'
			if (/tupai|squirrel|chipmunk/.test(command)) set = '-filter:a "atempo=0.5,asetrate=65100"'
			if (/vibra/.test(command)) set = '-filter_complex "vibrato=f=15"'
			if (/audio8d/.test(command)) set = '-af apulsator=hz=0.125'
			var ran = (new Date * 1) + '.mp3'
			var media = path.join(__dirname, '../../tmp/' + ran)
			var filename = media + '.mp3'
			await fs.promises.writeFile(media, audio)
			exec(`ffmpeg -i ${media} ${set} ${filename}`, async (err) => {
				await fs.promises.unlink(media)
				if (err) return Promise.reject(`_*Error!*_`)
				var buff = await fs.promises.readFile(filename)
				conn.sendFile(m.chat, buff, ran, null, m, /vn/.test(args[0]), {
					quoted: m,
					mimetype: 'audio/mp4'
				})
				await fs.promises.unlink(filename)
			})
		}
	} catch (e) {
		throw e
	}
}

handler.help = ['tomp3', 'bass', 'blown', 'deep', 'earrape', 'fast', 'fat', 'nightcore', 'reverse', 'robot', 'slow', 'smooth', 'tupai', 'vibra', 'audio8d'].map(v => v + ' [vn]')
handler.tags = ['audio']
handler.command = /^(tomp3|bass|blown|deep|earrape|fas?t|nightcore|reverse|robot|slow|smooth|tupai|squirrel|chipmunk|vibra|audio8d|test)$/i

module.exports = handler