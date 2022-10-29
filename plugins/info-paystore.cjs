var handler = async (m, {
	conn
}) => {
	//-----PRICE
	//sewa
	var sh = '8'
	var sn = '15'
	var ss = '25'
	var sp = '35'
	var sv = '45'
	//premium
	var ph = '5'
	var pn = '20'
	var pp = '40'
	var pv = '50'
	var ppm = '70'
	var info = `
╭━━━━「 *POINT* 」
┊⫹⫺ *1 point:* _${sh}k_
┊⫹⫺ *2 point:* _${sn}k_
┊⫹⫺ *3 point:* _${ss}k_
┊⫹⫺ *4 point:* _${sp}k_
┊⫹⫺ *5 point:* = _${sv}k_
╰═┅═━––––––๑

╭━━━━「 *PREMIUM* 」
┊⫹⫺ *Hemat:* _${ph}k (1 minggu)_
┊⫹⫺ *Normal:* _${pn}k (1 bulan)_
┊⫹⫺ *Pro:* _${pp}k (4 bulan)_
┊⫹⫺ *Vip:* _${pv}k (8 bulan)_
┊⫹⫺ *Vip_v2:* = _${ppm}k (1 tahun)_
╰═┅═━––––––๑

*⫹⫺ PAYMENT:*
• *Pulsa:* [082114499086]
• *Dana:* [082114499086]
• *OVO:* [082114499086]
• *Gopay:* [082114499086]

–––––– *🐾 Kebijakan* ––––––
🗣️: Kak, point buat apa?
💬: point bisa kamu gunakan untuk mengundang bot ke dalam grup kamu selama 1 bulan, setiap join 1 grup mengurangi 1 point

🗣️: Kak, kalau pointnya sudah habis apakah masih bisa mengundang bot?
💬: tidak bisa kak, maaf yah :)

🗣️: Kak, Kok harganya mahal banget?
💬: Mau tawar menawar? boleh, silahkan chat owner aja

🗣️: Scam ga nih kak?
💬: Enggalah, Owner 100% Tepati janji #STAYHALAL

▌│█║▌║▌║║▌║▌║█│▌
`
	var sections = [{
		title: `-------✦ SEWA ✦-------`,
		rows: [{
				title: "🔖 𝗛𝗘𝗠𝗔𝗧",
				rowId: '.order *Paket:* HEMAT • Sewa',
				description: '𝗣𝗿𝗶𝗰𝗲: ' + sh + 'k'
			},
			{
				title: "🔖 𝗡𝗢𝗥𝗠𝗔𝗟",
				rowId: '.order *Paket:* NORMAL • Sewa',
				description: '𝗣𝗿𝗶𝗰𝗲: ' + sn + 'k'
			},
			{
				title: "🔖 𝗦𝗧𝗔𝗡𝗗𝗔𝗥",
				rowId: '.order *Paket:* STANDAR • Sewa',
				description: '𝗣𝗿𝗶𝗰𝗲: ' + ss + 'k'
			},
			{
				title: "🔖 𝗣𝗥𝗢",
				rowId: '.order *Paket:* PRO • Sewa',
				description: '𝗣𝗿𝗶𝗰𝗲: ' + sp + 'k'
			},
			{
				title: "🔖 𝗩𝗜𝗣",
				rowId: '.order *Paket:* VIP • Sewa',
				description: '𝗣𝗿𝗶𝗰𝗲: ' + sv + 'k'
			},
		]
	}, {
		title: `-------✦ PREMIUM ✦-------`,
		rows: [{
				title: "🌟 𝗛𝗘𝗠𝗔𝗧",
				rowId: '.order *Paket:* HEMAT • Premium',
				description: '𝗣𝗿𝗶𝗰𝗲: ' + ph + 'k (1 minggu)'
			},
			{
				title: "🌟 𝗡𝗢𝗥𝗠𝗔𝗟",
				rowId: '.order *Paket:* NORMAL • Premium',
				description: '𝗣𝗿𝗶𝗰𝗲: ' + pn + 'k (1 bulan)'
			},
			{
				title: "🌟 𝗣𝗥𝗢",
				rowId: '.order *Paket:* PRO • Premium',
				description: '𝗣𝗿𝗶𝗰𝗲: ' + pp + 'k (4 bulan)'
			},
			{
				title: "🌟 𝗩𝗜𝗣",
				rowId: '.order *Paket:* VIP • Premium',
				description: '𝗣𝗿𝗶𝗰𝗲: ' + pv + 'k (8 bulan)'
			},
			{
				title: "🌟 𝗩𝗜𝗣_𝗩2",
				rowId: '.order *Paket:* VIP_V2 • Premium',
				description: '𝗣𝗿𝗶𝗰𝗲: ' + ppm + 'k (1 TAHUN)'
			},
		]
	}, ]
	var d = new Date(new Date + 3600000)
	var locale = 'id'
	var time = d.toLocaleTimeString(locale, {
		hour: 'numeric',
		minute: 'numeric',
		second: 'numeric'
	})
	var listMessage = {
		text: info,
		footer: `𝗧 𝗜 𝗠 𝗘 : ${time}`,
		title: "BOTSTYLEE",
		buttonText: "Click Here!",
		sections
	}
	await conn.sendMessage(m.chat, listMessage)
	//conn.sendHydrated(m.chat, info, wm, null, sgc, "🌎 Group Official", null,null, [['Owner','.owner']], m)
}

handler.help = ['sewa', 'premium']
handler.tags = ['main']
handler.command = /^(sewa(bot)?|premium)$/i

module.exports = handler
