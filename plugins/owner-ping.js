var handler = async(m, {
}) => {
	var startTime = moment(Date.now());
	await m.reply('*p i n g . . .*')
	var _muptime
	if (process.send) {
		process.send('uptime')
		_muptime = await new Promise(resolve => {
			process.once('message', resolve)
			setTimeout(resolve, 1000)
		}) * 1000
	}
	var endTime = moment(Date.now());
	var speedResponse = endTime.diff(startTime);
	await delay(500)
	await m.reply('*pong, ' + speedResponse +' ms.*' + `\n\n*[ s t a t u s ]*\n*[ public mode ]* ${db.data.settings[conn.user.jid].self ? '❌' : '☑'}\n*[ ram usage ]* ${process.memoryUsage.rss().getSize().formatted}\n*[ runtime ]* ${_muptime.toTimeString()}\n\n*[ c h a t s ]*\n*[ isBanned ]*  ${db.data.chats[m.chat].isBanned ? '☑' : '❌'}`)
}
handler.command = ['ping']
export default handler