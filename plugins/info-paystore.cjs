var handler = async (m, { conn }) => {
	var time = new Date().toLocaleTimeString('id-ID', { timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit', second: '2-digit' })
	var info = `╭━━━━「 *POINT* 」\n├ 1 point: 8k\n├ 2 point: 15k\n├ 3 point: 25k\n├ 4 point: 35k\n├ 5 point: 45k\n╰────────────\n\n╭━━━━「 *PREMIUM* 」\n├ Hemat: 5k (1 minggu)\n├ Normal: 20k (1 bulan)\n├ Pro: 40k (4 bulan)\n├ VIP: 50k (8 bulan)\n├ VIP V2: 70k (1 tahun)\n╰────────────\n\n*Pembayaran:* Pulsa/Dana/OVO/Gopay: 082114499086\n\n*Pemesanan sewa:* ketik .order Paket: HEMAT • Sewa\n*Pemesanan premium:* ketik .order Paket: NORMAL • Premium\n\nWaktu: ${time}\n\nUntuk paket lain, hubungi owner.`
	return conn.reply(m.chat, info, m)
}
handler.help = ['sewa', 'premium']
handler.tags = ['main']
handler.command = /^(sewa(bot)?|premium)$/i
module.exports = handler
