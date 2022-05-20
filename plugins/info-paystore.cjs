let handler = async (m, {
	conn
}) => {
	//-----PRICE
	//sewa
	let sh = '5'
	let sn = '15'
	let ss = '30'
	let sp = '35'
	let sv = '65'
	//premium
	let ph = '5'
	let pn = '20'
	let pp = '40'
	let pv = '50'
	let ppm = '70'
	let info = `
╭━━━━「 *SEWA* 」
┊⫹⫺ *Hemat:* _${sh}k/grup (1 minggu)_
┊⫹⫺ *Normal:* _${sn}k/grup (1 bulan)_
┊⫹⫺ *Standar:* _${ss}k/grup (2 bulan)_
┊⫹⫺ *Pro:* _${sp}k/grup (4 bulan)_                                                      
┊⫹⫺ *Vip:* = _${sv}k/grup (12 bulan)_
╰═┅═━––––––๑

╭━━━━「 *PREMIUM* 」
┊⫹⫺ *Hemat:* _${ph}k (1 minggu)_
┊⫹⫺ *Normal:* _${pn}k (1 bulan)_
┊⫹⫺ *Pro:* _${pp}k (4 bulan)_
┊⫹⫺ *Vip:* _${pv}k (8 bulan)_                                               
┊⫹⫺ *Vip_v2:* = _${ppm}k (1 tahun)_
╰═┅═━––––––๑

*⫹⫺ PAYMENT:*
• *Pulsa:* [082331033919]
• *Dana:* [082331033919]
✦• *OVO:* [082331033919]
• *Gopay:* [082331033919]

–––––– *🐾 Kebijakan* ––––––
🗣️: Kak, Kok harganya mahal banget?
💬: Mau tawar menawar? boleh, silahkan chat owner aja

🗣️: Scam ga nih kak?
💬: Enggalah, Owner 100% Tepati janji #STAYHALAL

▌│█║▌║▌║║▌║▌║█│▌
`
	const sections = [{
		title: `-------✦ SEWA ✦-------`,
		rows: [{
				title: "🔖 𝗛𝗘𝗠𝗔𝗧",
				rowId: '.order *Paket:* HEMAT • Sewa',
				description: '𝗣𝗿𝗶𝗰𝗲: ' + sh + 'k (1 minggu)'
			},
			{
				title: "🔖 𝗡𝗢𝗥𝗠𝗔𝗟",
				rowId: '.order *Paket:* NORMAL • Sewa',
				description: '𝗣𝗿𝗶𝗰𝗲: ' + sn + 'k (1 bulan)'
			},
			{
				title: "🔖 𝗦𝗧𝗔𝗡𝗗𝗔𝗥",
				rowId: '.order *Paket:* STANDAR • Sewa',
				description: '𝗣𝗿𝗶𝗰𝗲: ' + ss + 'k (2 bulan)'
			},
			{
				title: "🔖 𝗣𝗥𝗢",
				rowId: '.order *Paket:* PRO • Sewa',
				description: '𝗣𝗿𝗶𝗰𝗲: ' + sp + 'k (4 bulan)'
			},
			{
				title: "🔖 𝗩𝗜𝗣",
				rowId: '.order *Paket:* VIP • Sewa',
				description: '𝗣𝗿𝗶𝗰𝗲: ' + sv + 'k (12 bulan)'
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
	let d = new Date(new Date + 3600000)
	let locale = 'id'
	let time = d.toLocaleTimeString(locale, {
		hour: 'numeric',
		minute: 'numeric',
		second: 'numeric'
	})
	const listMessage = {
		text: info,
		footer: `𝗧 𝗜 𝗠 𝗘 : ${time}`,
		title: "ANTI BOT",
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