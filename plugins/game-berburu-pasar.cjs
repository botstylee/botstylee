const Skepiting = 3000
const Slobster = 3000
const Sudang = 3000
const Scumi = 3000
const Sgurita = 3000
const Sbuntal = 3000
const Sdory = 3000
const Sorca = 3000
const Slumba = 3000
const Spaus = 3000
const Shiu = 3000
const Sbanteng = 4000
const Sharimau = 4000
const Sgajah = 4000
const Skambing = 4000
const Spanda = 4000
const Sbuaya = 4000
const Skerbau = 4000
const Ssapi = 4000
const Smonyet = 4000
const Sbabihutan = 4000
const Sbabi = 4000
const Sayam = 4000
let handler = async (m, {
	conn,
	command,
	args,
	usedPrefix,
	DevMode
}) => {
	const _armor = db.data.users[m.sender].armor
	const armor = (_armor == 0 ? 20000 : '' || _armor == 1 ? 49999 : '' || _armor == 2 ? 99999 : '' || _armor == 3 ? 149999 : '' || _armor == 4 ? 299999 : '')
	let type = (args[0] || '').toLowerCase()
	let _type = (args[1] || '').toLowerCase()
	let jualbeli = (args[0] || '').toLowerCase()
	const Kchat = `━━━━━━━━━━━━━━━━━
*Barang   | Harga Jual*\n━━━━━━━━━━━━━━━━━\n*Contoh penggunaan .pasar sell Kepiting* \n\n*NOTE : JIKA KETIKA MENJUAL MUNCUL PESAN INI LAGI, ITU TANDANYA ITEM YANG ANDA JUAL TIDAK CUKUP*\n\n
Kepiting:     ${Skepiting}
Lobster:     ${Slobster}
Udang:     ${Sudang}
Cumi:     ${Scumi}
Gurita:     ${Sgurita}
Buntal:     ${Sbuntal}
Dory:     ${Sdory}
Orca:     ${Sorca}
Lumba:     ${Slumba}
Paus:     ${Spaus}
Hiu:     ${Spaus}
Banteng:     ${Sbanteng}
Harimau:     ${Sharimau}
Gajah:     ${Sgajah}
Kambing:     ${Skambing}
Panda:      ${Spanda}
Kerbau:     ${Skerbau}
Buaya:     ${Sbuaya}
Sapi:     ${Ssapi}
Monyet:     ${Smonyet}
Babi Hutan:     ${Sbabihutan}
Babi:     ${Sbabi}
Ayam:     ${Sayam}
`.trim()
	try {
		if (/pasar|toko/i.test(command)) {
			const count = args[2] && args[2].length > 0 ? Math.min(99999999, Math.max(parseInt(args[2]), 1)) : !args[2] || args.length < 4 ? 1 : Math.min(1, count)
			const sampah = db.data.users[m.sender].sampah
			switch (jualbeli) {
				case 'sell':
					switch (_type) {
						case 'kepiting':
							if (db.data.users[m.sender].kepiting >= count * 1) {
								db.data.users[m.sender].money += Skepiting * count
								db.data.users[m.sender].kepiting -= count * 1
								conn.reply(m.chat, `Sukses Menjual ${count} Kepiting Dengan Harga ${Spaus * count} Money `.trim(), m)
							} else conn.reply(m.chat, `Kepiting Kamu Tidak Cukup`.trim(), m)
							break
						case 'paus':
							if (db.data.users[m.sender].paus >= count * 1) {
								db.data.users[m.sender].money += Spaus * count
								db.data.users[m.sender].paus -= count * 1
								conn.reply(m.chat, `Sukses Menjual ${count} Paus Dengan Harga ${Spaus * count} Money `.trim(), m)
							} else conn.reply(m.chat, `Paus Kamu Tidak Cukup`.trim(), m)
							break
						case 'banteng':
							if (db.data.users[m.sender].banteng >= count * 1) {
								db.data.users[m.sender].money += Spaus * count
								db.data.users[m.sender].banteng -= count * 1
								conn.reply(m.chat, `Sukses Menjual ${count} Banteng Dengan Harga ${Spaus * count} Money `.trim(), m)
							} else conn.reply(m.chat, `Banteng Kamu Tidak Cukup`.trim(), m)
							break
						case 'lobster':
							if (db.data.users[m.sender].lobster >= count * 1) {
								db.data.users[m.sender].money += Slobster * count
								db.data.users[m.sender].lobster -= count * 1
								conn.reply(m.chat, `Sukses Menjual ${count} Lobster Dengan Harga ${Slobster * count} Money `.trim(), m)
							} else conn.reply(m.chat, `Lobster Kamu Tidak Cukup`.trim(), m)
							break
						case 'udang':
							if (db.data.users[m.sender].udang >= count * 1) {
								db.data.users[m.sender].money += Sudang * count
								db.data.users[m.sender].udang -= count * 1
								conn.reply(m.chat, `Sukses Menjual ${count} Udang Dengan Harga ${Sudang * count} Money `.trim(), m)
							} else conn.reply(m.chat, `Udang Kamu Tidak Cukup`.trim(), m)
							break
						case 'cumi':
							if (db.data.users[m.sender].cumi >= count * 1) {
								db.data.users[m.sender].money += Scumi * count
								db.data.users[m.sender].cumi -= count * 1
								conn.reply(m.chat, `Sukses Menjual ${count} Cumi Dengan Harga ${Scumi * count} Money `.trim(), m)
							} else conn.reply(m.chat, `Cumi Kamu Tidak Cukup`.trim(), m)
							break
						case 'diamond':
							if (db.data.users[m.sender].diamond >= count * 1) {
								db.data.users[m.sender].diamond -= count * 1
								db.data.users[m.sender].money += Sdiamond * count
								conn.reply(m.chat, `Sukses Menjual ${count} Diamond, Dan Anda Mendapatkan ${Sdiamond * count} Money `, m)
							} else conn.reply(m.chat, `Diamond Anda Tidak Cukup `, m)
							break
						default:
							return conn.reply(m.chat, Kchat, m)
					}
					break
				default:
					return conn.reply(m.chat, Kchat, m)
			}
		} else if (/sell|jual|/i.test(command)) {
			const count = args[1] && args[1].length > 0 ? Math.min(99999999, Math.max(parseInt(args[1]), 1)) : !args[1] || args.length < 3 ? 1 : Math.min(1, count)
			switch (type) {
				case 'banteng':
					if (db.data.users[m.sender].banteng >= count * 1) {
						db.data.users[m.sender].money += Spaus * count
						db.data.users[m.sender].banteng -= count * 1
						conn.reply(m.chat, `Sukses Menjual ${count} Banteng Dengan Harga ${Spaus * count} Money `.trim(), m)
					} else conn.reply(m.chat, `Banteng Kamu Tidak Cukup`.trim(), m)
					break
				case 'kepiting':
					if (db.data.users[m.sender].kepiting >= count * 1) {
						db.data.users[m.sender].money += Skepiting * count
						db.data.users[m.sender].kepiting -= count * 1
						conn.reply(m.chat, `Sukses Menjual ${count} Kepiting Dengan Harga ${Spaus * count} Money `.trim(), m)
					} else conn.reply(m.chat, `Kepiting Kamu Tidak Cukup`.trim(), m)
					break
				case 'paus':
					if (db.data.users[m.sender].paus >= count * 1) {
						db.data.users[m.sender].money += Spaus * count
						db.data.users[m.sender].paus -= count * 1
						conn.reply(m.chat, `Sukses Menjual ${count} Paus Dengan Harga ${Spaus * count} Money `.trim(), m)
					} else conn.reply(m.chat, `Paus Kamu Tidak Cukup`.trim(), m)
					break
				case 'lobster':
					if (db.data.users[m.sender].lobster >= count * 1) {
						db.data.users[m.sender].money += Slobster * count
						db.data.users[m.sender].lobster -= count * 1
						conn.reply(m.chat, `Sukses Menjual ${count} Lobster Dengan Harga ${Slobster * count} Money `.trim(), m)
					} else conn.reply(m.chat, `Lobster Kamu Tidak Cukup`.trim(), m)
					break
				case 'udang':
					if (db.data.users[m.sender].udang >= count * 1) {
						db.data.users[m.sender].money += Sudang * count
						db.data.users[m.sender].udang -= count * 1
						conn.reply(m.chat, `Sukses Menjual ${count} Udang Dengan Harga ${Sudang * count} Money `.trim(), m)
					} else conn.reply(m.chat, `Udang Kamu Tidak Cukup`.trim(), m)
					break
				case 'gurita':
					if (db.data.users[m.sender].gurita >= count * 1) {
						db.data.users[m.sender].money += Sgurita * count
						db.data.users[m.sender].gurita -= count * 1
						conn.reply(m.chat, `Sukses Menjual ${count} Gurita Dengan Harga ${Sgurita * count} Money `.trim(), m)
					} else conn.reply(m.chat, `Gurita Kamu Tidak Cukup`.trim(), m)
					break
				case 'cumi':
					if (db.data.users[m.sender].cumi >= count * 1) {
						db.data.users[m.sender].money += Scumi * count
						db.data.users[m.sender].cumi -= count * 1
						conn.reply(m.chat, `Sukses Menjual ${count} Cumi Dengan Harga ${Scumi * count} Money `.trim(), m)
					} else conn.reply(m.chat, `Cumi Kamu Tidak Cukup`.trim(), m)
					break
				case 'diamond':
					if (db.data.users[m.sender].diamond >= count * 1) {
						db.data.users[m.sender].diamond -= count * 1
						db.data.users[m.sender].money += Sdiamond * count
						conn.reply(m.chat, `Sukses Menjual ${count} Diamond, Dan Anda Mendapatkan ${Sdiamond * count} Money`, m)
					} else conn.reply(m.chat, `Diamond Anda Tidak Cukup `, m)
					break
				default:
					return conn.reply(m.chat, Kchat, m)
			}
		}
	} catch (e) {
		conn.reply(m.chat, Kchat, m)
		console.log(e)
	}
}

handler.help = ['pasar *sell args*']
handler.tags = ['berburu']

handler.command = /^(pasar)$/i
module.exports = handler