var handler = async (m, {
	conn,
	text,
	command,
	usedPrefix
}) => {
	if (!text) return m.reply("gunakan command seperti ini\ncomtoh:\n" + usedPrefix + command + " benny&by")
	var [p1, p2] = text.split(/[&|.]/i)
	if (!(p1, p2)) throw "masukan namamu&nama pasanganmu"
	try {
		var a = await axios.request("https://rest-beni.herokuapp.com/api/kecocokanpasangan?nama=" + p1 + "&pasangan=" + p2, {
			method: "GET"
		})
		if (!a.data.status) throw a.data.message
		conn.sendFile(m.chat, a.data.message.gambar, "", `\n\t\t\t\tKECOCOKAN PASANGAN\t\t\t\n\nNama_anda: ${a.data.message.nama_anda}\nPasangan_anda: ${a.data.message.nama_pasangan}\nSisi_positif: ${a.data.message.sisi_positif}\nSisi_negatif: ${a.data.message.sisi_negatif}`, m)
	} catch (e) {
		if (e.response) {
			return m.reply("Rest Api down")
		}
	}
}
handler.help = ['kecocokanpasangan *namamu&namapasanganmu*']
handler.tags = ['primbon']

handler.command = /^kecocokanpasangan$/i

module.exports = handler