var fs = require('fs')
var path = require('path')
var {
	exec
} = require('child_process')
var {
	promisify
} = require('util')

var execAsync = promisify(exec)

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
		var isVn = /vn/.test(args[0] || '')

		// ✅ Pastikan folder tmp ada
		var tmpDir = path.join(__dirname, '../tmp')
		if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true })

		var ran = Date.now() + '_' + Math.random().toString(36).slice(2, 8)
		var media, filename, set, buff

		if (/tomp3/.test(command)) {
			if (!/audio|video/.test(mime)) {
				return conn.reply(m.chat, `Balas video/audio yang ingin diubah dengan caption *${usedPrefix + command}*`, m)
			}

			var audio = await q.download()
			if (!audio) return conn.reply(m.chat, 'Gagal mengunduh audio.', m)

			set = '-vn -c:a libopus -b:a 128k -vbr on -compression_level 10'
			media = path.join(tmpDir, ran + '.mp3')
			filename = media + '.opus'

			await fs.promises.writeFile(media, audio)

			try {
				await execAsync(`ffmpeg -i "${media}" ${set} "${filename}"`)
			} catch (e) {
				console.error('[audio] ffmpeg error:', e.stderr || e.message)
				await fs.promises.unlink(media).catch(() => {})
				return conn.reply(m.chat, '_*Error!*_ Gagal mengonversi audio.', m)
			}

			buff = await fs.promises.readFile(filename)
			await fs.promises.unlink(media).catch(() => {})
			await fs.promises.unlink(filename).catch(() => {})

			await conn.sendMessage(m.chat, {
				audio: buff,
				mimetype: 'audio/mp4',
				ptt: isVn
			}, { quoted: m })

		} else {
			if (!/audio/.test(mime)) {
				return conn.reply(m.chat, `Balas vn/audio yang ingin diubah dengan caption *${usedPrefix + command}*`, m)
			}

			var audio = await q.download()
			if (!audio) return conn.reply(m.chat, 'Gagal mengunduh audio.', m)

			if (/bass/.test(command)) set = '-af "firequalizer=gain_entry=\'entry(0,-8);entry(250,4);entry(1000,-8);entry(4000,0);entry(16000,-8)\'"'
			else if (/blown/.test(command)) set = '-af acrusher=.1:1:64:0:log'
			else if (/deep/.test(command)) set = '-af atempo=4/4,asetrate=44500*2/3'
			else if (/test/.test(command)) set = text
			else if (/earrape/.test(command)) set = '-af volume=4.5 -vcodec copy'
			else if (/fast/.test(command)) set = '-filter:a "atempo=1.63,asetrate=44100"'
			else if (/fat/.test(command)) set = '-filter:a "atempo=1.6,asetrate=22100"'
			else if (/nightcore/.test(command)) set = '-filter:a atempo=1.06,asetrate=44100*1.25'
			else if (/reverse/.test(command)) set = '-filter_complex "areverse"'
			else if (/robot/.test(command)) set = '-filter_complex "afftfilt=real=\'hypot(re,im)*sin(0)\':imag=\'hypot(re,im)*cos(0)\':win_size=512:overlap=0.75"'
			else if (/slow/.test(command)) set = '-filter:a "atempo=0.7,asetrate=44100"'
			else if (/smooth/.test(command)) set = '-filter:v "minterpolate=\'mi_mode=mci:mc_mode=aobmc:vsbmc=1:fps=120\'"'
			else if (/tupai|squirrel|chipmunk/.test(command)) set = '-filter:a "atempo=0.5,asetrate=65100"'
			else if (/vibra/.test(command)) set = '-filter_complex "vibrato=f=15"'
			else if (/audio8d/.test(command)) set = '-af apulsator=hz=0.125'

			if (!set) {
				return conn.reply(m.chat, 'Command tidak dikenali.', m)
			}

			media = path.join(tmpDir, ran + '.mp3')
			filename = media + '.out.mp3'

			await fs.promises.writeFile(media, audio)

			try {
				await execAsync(`ffmpeg -i "${media}" ${set} "${filename}"`)
			} catch (e) {
				console.error('[audio] ffmpeg error:', e.stderr || e.message)
				await fs.promises.unlink(media).catch(() => {})
				return conn.reply(m.chat, '_*Error!*_ Gagal memproses audio.', m)
			}

			buff = await fs.promises.readFile(filename)
			await fs.promises.unlink(media).catch(() => {})
			await fs.promises.unlink(filename).catch(() => {})

			await conn.sendMessage(m.chat, {
				audio: buff,
				mimetype: 'audio/mp4',
				ptt: isVn
			}, { quoted: m })
		}

	} catch (e) {
		console.error('[audio] Error:', e)
		await conn.reply(m.chat, 'Terjadi kesalahan: ' + (e.message || e), m)
	}
}

handler.help = ['tomp3', 'bass', 'blown', 'deep', 'earrape', 'fast', 'fat', 'nightcore', 'reverse', 'robot', 'slow', 'smooth', 'tupai', 'vibra', 'audio8d'].map(v => v + ' [vn]')
handler.tags = ['audio']
handler.command = /^(tomp3|bass|blown|deep|earrape|fas?t|nightcore|reverse|robot|slow|smooth|tupai|squirrel|chipmunk|vibra|audio8d|test)$/i

module.exports = handler
