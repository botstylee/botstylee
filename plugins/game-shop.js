var handler = async (m, {
	conn,
	command,
	args,
	usedPrefix
}) => {
	var type = (args[0] || '').toLowerCase()
	var _type = (args[0] || '').toLowerCase()
	var user = db.data.users[m.sender]

	//----------HARGA
	var ayam = 10
	var kucing = 20
	var kambing = 30
	var sapi = 40
	var kuda = 50

	var caption = `— *P E T   S T O R E* —
▮▧▧▧▧▧▧▧▧▧▧▧▧▮`
	caption += `\n\n
🐓 *ayam:* ${ayam} coin
*Production:* 100 MP / 30 menit
*Max level production:* 600 MP / 30 menit

🐈 *kucing:* ${kucing} coin
*Production:* 200 MP / 30 menit
*Max level production:* 700 MP / 30 menit

🐐 *kambing:* ${kambing} coin
*Production:* 300 MP / 30 menit
*Max level production:* 800 MP / 30 menit

🐂 *sapi:* ${sapi} coin
*Production:* 400 MP / 30 menit
*Max level production:* 900 MP / 30 menit

🐎 *kuda:* ${kuda} coin
*Production:* 500 MP / 30 menit
*Max level production:* 1000 MP / 30 menit

gunakan command *#petshop nama_hewan* yang tersedia untuk membelinya
ex: *#petshop kuda*

!NOTE
aktifkan pet kamu jika sudah membeli dengan ketik *#setpet nama_hewanmu*
ex: *#setpet kuda*
mengaktifkan salah satu pet yang kamu miliki akan membantumu mengumpulkan MP setiap 30 menit

upgrade pet kamu untuk meningkatkan produktifitas nya untuk mengumpulkan MP lebih banyak lagi.
maximum level: 5
ketik *#petup nama_hewanmu*
ex: *#petup kuda*
`

	try {
		if (/petshop/i.test(command)) {
			switch (type) {
				case 'ayam':
					if (user.pet.some(v => v.petname == 'ayam' && v.level > 0)) return m.reply('Kamu sudah memilik ini')
					if (user.coin < ayam) return m.reply(`kamu membutuhkan ${ayam - user.coin} coin lagi untuk membeli ayam itu\nSilahkan melakukan pembelian coin dengan menggunakan perintah *#buy coin ${ayam - user.coin}*`)
					user.coin -= ayam
					user.pet.find(v => v.petname == 'ayam').level += 1
					user.pet.find(v => v.petname == 'ayam').production += 100
					m.reply("Selamat anda telah memiliki pet Baru ! 🎉")
					break
				case 'kucing':
					if (user.pet.some(v => v.petname == 'kucing' && v.level > 0)) return m.reply('Kamu sudah memilik ini')
					if (user.coin < kucing) return m.reply(`kamu membutuhkan ${kucing - user.coin} coin lagi untuk membeli kucing itu\nSilahkan melakukan pembelian coin dengan menggunakan perintah *#buy coin ${kucing - user.coin}*`)
					user.coin -= kucing
					user.pet.find(v => v.petname == 'kucing').level += 1
					user.pet.find(v => v.petname == 'kucing').production += 200
					m.reply("Selamat anda telah memiliki pet Baru ! 🎉")
					break
				case 'kambing':
					if (user.pet.some(v => v.petname == 'kambing' && v.level > 0)) return m.reply('Kamu sudah memilik ini')
					if (user.coin < kambing) return m.reply(`kamu membutuhkan ${kambing - user.coin} coin lagi untuk membeli kambing itu\nSilahkan melakukan pembelian coin dengan menggunakan perintah *#buy coin ${kambing - user.coin}*`)
					user.coin -= kambing
					user.pet.find(v => v.petname == 'kambing').level += 1
					user.pet.find(v => v.petname == 'kambing').production += 300
					m.reply("Selamat anda telah memiliki pet Baru ! 🎉")
					break
				case 'sapi':
					if (user.pet.some(v => v.petname == 'sapi' && v.level > 0)) return m.reply('Kamu sudah memilik ini')
					if (user.coin < sapi) return m.reply(`kamu membutuhkan ${sapi - user.coin} coin lagi untuk membeli sapi itu\nSilahkan melakukan pembelian coin dengan menggunakan perintah *#buy coin ${sapi - user.coin}*`)
					user.coin -= sapi
					user.pet.find(v => v.petname == 'sapi').level += 1
					user.pet.find(v => v.petname == 'sapi').production += 400
					m.reply("Selamat anda telah memiliki pet Baru ! 🎉")
					break
				case 'kuda':
					if (user.pet.some(v => v.petname == 'kuda' && v.level > 0)) return m.reply('Kamu sudah memilik ini')
					if (user.coin < kuda) return m.reply(`kamu membutuhkan ${kuda - user.coin} coin lagi untuk membeli kuda itu\nSilahkan melakukan pembelian coin dengan menggunakan perintah *#buy coin ${kuda - user.coin}*`)
					user.coin -= kuda
					user.pet.find(v => v.petname == 'kuda').level += 1
					user.pet.find(v => v.petname == 'kuda').production += 500
					m.reply("Selamat anda telah memiliki pet Baru ! 🎉")
					break

				default:
					m.reply(caption)
			}
		} else if (/setpet/i.test(command)) {
			var data = user.pet
			var alreadyActive = false;

			function setActivePet(petname) {
				data.forEach((pet) => {
					if (pet.petname === petname) {
						if (pet.active) {
							alreadyActive = true;
						} else {
							pet.active = true
						}
					} else {
						pet.active = false;
					}
				});
			}
			switch (_type) {
				case 'ayam':
					if (!user.pet.some(v => v.petname == 'ayam' && v.level > 0)) return m.reply('Kamu belum memilik hewan ini\nsilahkan beli dengan menggunakan perintah *#petshop ayam*')
					setActivePet('ayam')
					if (alreadyActive) return m.reply('pet tersebut sudah di aktifkan')
					m.reply(`pet *ayam* berhasil di aktifkan\n\n*production:* ${user.pet.find(v=> v.petname == 'ayam').production} MP / 30 menit`)
					break
				case 'kucing':
					if (!user.pet.some(v => v.petname == 'kucing' && v.level > 0)) return m.reply('Kamu belum memilik hewan ini\nsilahkan beli dengan menggunakan perintah *#petshop kucing*')
					setActivePet('kucing')
					if (alreadyActive) return m.reply('pet tersebut sudah di aktifkan')
					m.reply(`pet *kucing* berhasil di aktifkan\n\n*production:* ${user.pet.find(v=> v.petname == 'kucing').production} MP / 30 menit`)
					break
				case 'kambing':
					if (!user.pet.some(v => v.petname == 'kambing' && v.level > 0)) return m.reply('Kamu belum memilik hewan ini\nsilahkan beli dengan menggunakan perintah *#petshop kambing*')
					setActivePet('kambing')
					if (alreadyActive) return m.reply('pet tersebut sudah di aktifkan')
					m.reply(`pet *kambing* berhasil di aktifkan\n\n*production:* ${user.pet.find(v=> v.petname == 'kambing').production} MP / 30 menit`)
					break
				case 'sapi':
					if (!user.pet.some(v => v.petname == 'sapi' && v.level > 0)) return m.reply('Kamu belum memilik hewan ini\nsilahkan beli dengan menggunakan perintah *#petshop sapi*')
					setActivePet('sapi')
					if (alreadyActive) return m.reply('pet tersebut sudah di aktifkan')
					m.reply(`pet *sapi* berhasil di aktifkan\n\n*production:* ${user.pet.find(v=> v.petname == 'sapi').production} MP / 30 menit`)
					break
				case 'kuda':
					if (!user.pet.some(v => v.petname == 'kuda' && v.level > 0)) return m.reply('Kamu belum memilik hewan ini\nsilahkan beli dengan menggunakan perintah *#petshop kuda*')
					setActivePet('kuda')
					if (alreadyActive) return m.reply('pet tersebut sudah di aktifkan')
					m.reply(`pet *kuda* berhasil di aktifkan\n\n*production:* ${user.pet.find(v=> v.petname == 'kuda').production} MP / 30 menit`)
					break
				default:
					m.reply(caption)
			}
		} else if (/uppet|petup/i.test(command)) {
			var datas = {
				ayam: [{
					price: 15,
					level: 2,
					production: 250
				}, {
					price: 20,
					level: 3,
					production: 350
				}, {
					price: 25,
					level: 4,
					production: 450
				}, {
					price: 30,
					level: 5,
					production: 600
				}],
				kucing: [{
					price: 20,
					level: 2,
					production: 350
				}, {
					price: 25,
					level: 3,
					production: 450
				}, {
					price: 30,
					level: 4,
					production: 500
				}, {
					price: 35,
					level: 5,
					production: 700
				}],
				kambing: [{
					price: 30,
					level: 2,
					production: 450
				}, {
					price: 35,
					level: 3,
					production: 550
				}, {
					price: 40,
					level: 4,
					production: 600
				}, {
					price: 45,
					level: 5,
					production: 800
				}],
				sapi: [{
					price: 40,
					level: 2,
					production: 550
				}, {
					price: 45,
					level: 3,
					production: 650
				}, {
					price: 50,
					level: 4,
					production: 700
				}, {
					price: 55,
					level: 5,
					production: 900
				}],
				kuda: [{
					price: 50,
					level: 2,
					production: 650
				}, {
					price: 55,
					level: 3,
					production: 750
				}, {
					price: 60,
					level: 4,
					production: 800
				}, {
					price: 65,
					level: 5,
					production: 1000
				}],
			}
			switch (_type) {
				case 'ayam':
					if (!user.pet.some(v => v.petname == 'ayam' && v.level > 0)) return m.reply('Kamu belum memilik hewan ini\nsilahkan beli dengan menggunakan perintah *#petshop ayam*')
					if (user.pet.find(v => v.petname == 'ayam').level >= 5) return m.reply('level *ayam* kamu sudah mencapai maksimal\ntidak dapat di upgrade lagi')
					if (user.coin < datas.ayam.find(v => v.level == user.pet.find(v => v.petname == 'ayam').level + 1).price) return m.reply(`kamu membutuhkan ${datas.ayam.find(v=> v.level == user.pet.find(v=> v.petname == 'ayam').level + 1).price - user.coin} coin lagi untuk upgrade ayam kamu ke level selanjutnya\nSilahkan melakukan pembelian coin dengan menggunakan perintah *#buy coin ${datas.ayam.find(v=> v.level == user.pet.find(v=> v.petname == 'ayam').level + 1).price - user.coin}*`)
					user.coin -= datas.ayam.find(v => v.level == user.pet.find(v => v.petname == 'ayam').level + 1).price
					user.pet.find(v => v.petname == 'ayam').production = datas.ayam.find(v => v.level == user.pet.find(v => v.petname == 'ayam').level + 1).production
					user.pet.find(v => v.petname == 'ayam').level = datas.ayam.find(v => v.level == user.pet.find(v => v.petname == 'ayam').level + 1).level
					m.reply(`pet *ayam* berhasil di upgrade ke level ${user.pet.find(v=> v.petname == 'ayam').level}\n\n*production:* ${user.pet.find(v=> v.petname == 'ayam').production} MP / 30 menit`)
					break
				case 'kucing':
					if (!user.pet.some(v => v.petname == 'kucing' && v.level > 0)) return m.reply('Kamu belum memilik hewan ini\nsilahkan beli dengan menggunakan perintah *#petshop kucing*')
					if (user.pet.find(v => v.petname == 'kucing').level >= 5) return m.reply('level *kucing* kamu sudah mencapai maksimal\ntidak dapat di upgrade lagi')
					if (user.coin < datas.kucing.find(v => v.level == user.pet.find(v => v.petname == 'kucing').level + 1).price) return m.reply(`kamu membutuhkan ${datas.kucing.find(v=> v.level == user.pet.find(v=> v.petname == 'kucing').level + 1).price - user.coin} coin lagi untuk upgrade kucing kamu ke level selanjutnya\nSilahkan melakukan pembelian coin dengan menggunakan perintah *#buy coin ${datas.kucing.find(v=> v.level == user.pet.find(v=> v.petname == 'kucing').level + 1).price - user.coin}*`)
					user.coin -= datas.kucing.find(v => v.level == user.pet.find(v => v.petname == 'kucing').level + 1).price
					user.pet.find(v => v.petname == 'kucing').production = datas.kucing.find(v => v.level == user.pet.find(v => v.petname == 'kucing').level + 1).production
					user.pet.find(v => v.petname == 'kucing').level = datas.kucing.find(v => v.level == user.pet.find(v => v.petname == 'kucing').level + 1).level
					m.reply(`pet *kucing* berhasil di upgrade ke level ${user.pet.find(v=> v.petname == 'kucing').level}\n\n*production:* ${user.pet.find(v=> v.petname == 'kucing').production} MP / 30 menit`)
					break
				case 'kambing':
					if (!user.pet.some(v => v.petname == 'kambing' && v.level > 0)) return m.reply('Kamu belum memilik hewan ini\nsilahkan beli dengan menggunakan perintah *#petshop kambing*')
					if (user.pet.find(v => v.petname == 'kambing').level >= 5) return m.reply('level *kambing* kamu sudah mencapai maksimal\ntidak dapat di upgrade lagi')
					if (user.coin < datas.kambing.find(v => v.level == user.pet.find(v => v.petname == 'kambing').level + 1).price) return m.reply(`kamu membutuhkan ${datas.kambing.find(v=> v.level == user.pet.find(v=> v.petname == 'kambing').level + 1).price - user.coin} coin lagi untuk upgrade kambing kamu ke level selanjutnya\nSilahkan melakukan pembelian coin dengan menggunakan perintah *#buy coin ${datas.kambing.find(v=> v.level == user.pet.find(v=> v.petname == 'kambing').level + 1).price - user.coin}*`)
					user.coin -= datas.kambing.find(v => v.level == user.pet.find(v => v.petname == 'kambing').level + 1).price
					user.pet.find(v => v.petname == 'kambing').production = datas.kambing.find(v => v.level == user.pet.find(v => v.petname == 'kambing').level + 1).production
					user.pet.find(v => v.petname == 'kambing').level = datas.kambing.find(v => v.level == user.pet.find(v => v.petname == 'kambing').level + 1).level
					m.reply(`pet *kambing* berhasil di upgrade ke level ${user.pet.find(v=> v.petname == 'kambing').level}\n\n*production:* ${user.pet.find(v=> v.petname == 'kambing').production} MP / 30 menit`)
					break
				case 'sapi':
					if (!user.pet.some(v => v.petname == 'sapi' && v.level > 0)) return m.reply('Kamu belum memilik hewan ini\nsilahkan beli dengan menggunakan perintah *#petshop sapi*')
					if (user.pet.find(v => v.petname == 'sapi').level >= 5) return m.reply('level *sapi* kamu sudah mencapai maksimal\ntidak dapat di upgrade lagi')
					if (user.coin < datas.sapi.find(v => v.level == user.pet.find(v => v.petname == 'sapi').level + 1).price) return m.reply(`kamu membutuhkan ${datas.sapi.find(v=> v.level == user.pet.find(v=> v.petname == 'sapi').level + 1).price - user.coin} coin lagi untuk upgrade sapi kamu ke level selanjutnya\nSilahkan melakukan pembelian coin dengan menggunakan perintah *#buy coin ${datas.sapi.find(v=> v.level == user.pet.find(v=> v.petname == 'sapi').level + 1).price - user.coin}*`)
					user.coin -= datas.sapi.find(v => v.level == user.pet.find(v => v.petname == 'sapi').level + 1).price
					user.pet.find(v => v.petname == 'sapi').production = datas.sapi.find(v => v.level == user.pet.find(v => v.petname == 'sapi').level + 1).production
					user.pet.find(v => v.petname == 'sapi').level = datas.sapi.find(v => v.level == user.pet.find(v => v.petname == 'sapi').level + 1).level
					m.reply(`pet *sapi* berhasil di upgrade ke level ${user.pet.find(v=> v.petname == 'sapi').level}\n\n*production:* ${user.pet.find(v=> v.petname == 'sapi').production} MP / 30 menit`)
					break
				case 'kuda':
					if (!user.pet.some(v => v.petname == 'kuda' && v.level > 0)) return m.reply('Kamu belum memilik hewan ini\nsilahkan beli dengan menggunakan perintah *#petshop kuda*')
					if (user.pet.find(v => v.petname == 'kuda').level >= 5) return m.reply('level *kuda* kamu sudah mencapai maksimal\ntidak dapat di upgrade lagi')
					if (user.coin < datas.kuda.find(v => v.level == user.pet.find(v => v.petname == 'kuda').level + 1).price) return m.reply(`kamu membutuhkan ${datas.kuda.find(v=> v.level == user.pet.find(v=> v.petname == 'kuda').level + 1).price - user.coin} coin lagi untuk upgrade kuda kamu ke level selanjutnya\nSilahkan melakukan pembelian coin dengan menggunakan perintah *#buy coin ${datas.kuda.find(v=> v.level == user.pet.find(v=> v.petname == 'kuda').level + 1).price - user.coin}*`)
					user.coin -= datas.kuda.find(v => v.level == user.pet.find(v => v.petname == 'kuda').level + 1).price
					user.pet.find(v => v.petname == 'kuda').production = datas.kuda.find(v => v.level == user.pet.find(v => v.petname == 'kuda').level + 1).production
					user.pet.find(v => v.petname == 'kuda').level = datas.kuda.find(v => v.level == user.pet.find(v => v.petname == 'kuda').level + 1).level
					m.reply(`pet *kuda* berhasil di upgrade ke level ${user.pet.find(v=> v.petname == 'kuda').level}\n\n*production:* ${user.pet.find(v=> v.petname == 'kuda').production} MP / 30 menit`)
					break
				default:
					m.reply(caption)
			}
		}
	} catch (err) {
		m.reply("Error\n\n\n" + err.stack)
	}
}

handler.help = ['petshop', 'setpet', 'petup', 'uppet']
handler.tags = ['game']
handler.command = ['petshop', 'setpet', 'petup', 'uppet']
handler.level = 25
export default handler