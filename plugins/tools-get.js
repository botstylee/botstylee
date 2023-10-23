var handler = async (m, {
	text
}) => {
	try {
		var res = await axios.get(text)
		if (!/text|json/.test(res.headers['content-type'])) return conn.sendFile(m.chat, text, '', text, m)
		var txt = res.data
		m.reply(txt)
	} catch (e) {
		m.reply(e.response?.data || e)
	}
}
handler.help = ['fetch', 'get'].map(v => v + ' <url>')
handler.tags = ['tools']
handler.command = /^(fetch|get)$/i

export default handler