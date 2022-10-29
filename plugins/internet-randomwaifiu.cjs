async function handler(m, {
	conn,
	command
}) {
	await delay(4000)
	var a
	if (/waifu/i.test(command)) {
		try {
			a = await axios.request('https://api.waifu.im/random/?is_nsfw=false', {
				method: 'GET'
			})
			conn.sendButton(m.chat, '🧐', wm, a.data.images[0].url, [
				['Get Again😁', '.waifu']
			], m)
		} catch (e) {
			throw 'error'
		}
	} else {
		var ran = ['oppai', 'uniform', 'waifu', 'marin-kitagawa', 'mori-calliope', 'raiden-shogun', 'selfies']
		var ranw = ran[Math.floor(Math.random() * ran.length)]
		try {
			a = await axios.request('https://api.waifu.im/random/?selected_tags=' + ranw + '&is_nsfw=false', {
				method: 'GET'
			})
			conn.sendButton(m.chat, '🧐', wm, a.data.images[0].url, [
				['Get Again😁', '.rwaifu']
			], m)
		} catch (e) {
			throw 'error'
		}
	}
}
handler.help = ['waifu', 'rwaifu']
handler.tags = ['internet']
handler.command = ['waifu', 'rwaifu']
module.exports = handler
