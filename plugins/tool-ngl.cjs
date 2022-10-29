var handler = async (m, {
	conn,
	args,
	text,
	usedPrefix: _p,
	command: _c
}) => {
	if (!text) throw 'ulangi command tadi, lalu coba seperti ini\n' + _p + _c + ' linkngl|message\natau\n' + _p + _c + ' username ngl|message\n\ncontoh: \n#ngl https://ngl.link/adit&woi adit\n#ngl adit&woi adit'

	var [t1, t2] = text.split(/[&|,]/i)
	if (!t2) return m.reply('ketik ulang kayak tadi lalu tambah pesannya\ncontoh\n#ngl https://ngl.link/adit&woi adit')
	var regex = /^(http|https):\/\/ngl.link/gi;
	var regexngl = /ngl.link/gi;
	link = regex.test(t1) ?
		t1 :
		regexngl.test(t1) ?
		"https://" + t1 :
		"https://ngl.link/" + t1;
	var a = await cekuser(link)
	if (a) {
		var b = await send(link, t2)
		return m.reply("pesan berhasil terkirim")
	} else {
		return m.reply("user tidak dapat di temukan atau link invalid")
	}
}
handler.help = ['ngl [link|message]', 'ngl [username|message]']
handler.tags = ['tools']
handler.command = /^ngl$/i


module.exports = handler

async function cekuser(url) {
	try {
		var a = await axios.request(url)
		//log(a)
		return true
	} catch (e) {
		return false
	}
}
async function send(url, text) {
	try {
		var a = await axios.request(url, {
			method: "POST",
			data: new URLSearchParams({
				question: text
			})
		})
		//log(a)
		return true
	} catch (e) {
		log(e)
		return false
	}
}
