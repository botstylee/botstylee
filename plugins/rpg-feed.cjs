var handler = async (m, {
	conn,
	args,
	usedPrefix,
	command
}) => {
	var type = (args[0] || '').toLowerCase()
	var wm = global.wm
	var linkgc = global.gc
	var pp = global.thumb
	var timebah = 600000
	var timeda = 600000
	var timela = 600000
	var timega = 600000
	var timebi = 600000
	var timeur = 600000
	var timenix = 600000
	var timefin = 600000
	var timecing = 600000
	var fox = db.data.users[m.sender].fox
	var horse = db.data.users[m.sender].horse
	var wolf = db.data.users[m.sender].wolf
	var dragon = db.data.users[m.sender].dragon
	var cat = db.data.users[m.sender].cat
	var phonix = db.data.users[m.sender].phonix
	var kyubi = db.data.users[m.sender].kyubi
	var centaur = db.data.users[m.sender].centaur
	var griffin = db.data.users[m.sender].griffin
	var rhinoceros = db.data.users[m.sender].rhinoceros
	var lion = db.data.users[m.sender].lion
	var baba = `Contoh penggunaan: *${usedPrefix + command} cat*
List Pet
▧ cat 
▧ fox 
▧ horse 
▧ lion 
▧ rhinoceros 
▧ dragon 
▧ centaur 
▧ kyubi 
▧ griffin 
▧ phonix 
▧ wolf 
`
	switch (type) {
		case 'fox':
			if (fox == 0) return m.reply('*You not have a pet fox*')
			if (fox == 5) return m.reply('*Your pet is already level max *')
			var __waktur = (new Date - db.data.users[m.sender].foxlastclaim)
			var _waktur = (600000 - __waktur)
			var waktur = clockString(_waktur)
			if (new Date - db.data.users[m.sender].foxlastclaim > 600000) {
				if (db.data.users[m.sender].makananpet > 0) {
					db.data.users[m.sender].makananpet -= 1
					db.data.users[m.sender].foxexp += 20
					db.data.users[m.sender].foxlastclaim = new Date * 1
					conn.reply(m.chat, `Feeding ${type} success`, m)
					setTimeout(() => {
						conn.reply(m.chat, 'Time to feeding *fox*\nI hungry sir..', m)
					}, timebah)
					if (fox > 0) {
						var naiklvl = ((fox * 1000) - 1)
						if (db.data.users[m.sender].foxexp > naiklvl) {
							db.data.users[m.sender].fox += 1
							db.data.users[m.sender].foxexp -= (fox * 1000)
							conn.reply(m.chat, `*Congratulations your pet fox level up*`, m)
						}
					}
				} else m.reply(`Makanan pet kamu tidak cukup`)
			} else m.reply(`Pet kamu sudah kenyang, coba kasih makan *${waktur}* lagi`)
			break
		case 'rhinoceros':
			if (rhinoceros == 0) return m.reply('*You not have a pet rhinoceros*')
			if (rhinoceros == 5) return m.reply('*Pet Kamu Telah Level Maximum*')
			var __waktua = (new Date - db.data.users[m.sender].rhinoceroslastclaim)
			var _waktua = (600000 - __waktur)
			var waktua = clockString(_waktur)
			if (new Date - db.data.users[m.sender].rhinoceroslastclaim > 600000) {
				if (db.data.users[m.sender].makananpet > 0) {
					db.data.users[m.sender].makananpet -= 1
					db.data.users[m.sender].rhinocerosexp += 15
					db.data.users[m.sender].rhinoceroslastclaim = new Date * 1
					conn.reply(m.chat, `Feeding ${type} success`, m)
					if (rhinoceros > 0) {
						var naiklvl = ((rhinoceros * 1000) - 1)
						if (db.data.users[m.sender].rhinocerosexp > naiklvl) {
							db.data.users[m.sender].rhinoceros += 1
							db.data.users[m.sender].rhinocerosexp -= (rhinoceros * 100)
							conn.reply(m.chat, `*Congratulations your pet rhinoceros level up*`, m)
						}
					}
				} else m.reply(`Makanan Pet Kamu Tidak Cukup`)
			} else m.reply(`Pet Kamu Sudah Kenyang, Cobalah Untuk Memberi Dia Makan *${waktur}* Lagi`)
			break
		case 'lion':
			if (lion == 0) return m.reply('*You not have a pet*')
			if (lion == 5) return m.reply('*Pet Kamu Telah Level Maximum*')
			var __waktub = (new Date - db.data.users[m.sender].lionlastclaim)
			var _waktub = (600000 - __waktur)
			var waktub = clockString(_waktur)
			if (new Date - db.data.users[m.sender].lionlastclaim > 600000) {
				if (db.data.users[m.sender].makananpet > 0) {
					db.data.users[m.sender].makananpet -= 1
					db.data.users[m.sender].lionexp += 15
					db.data.users[m.sender].lionlastclaim = new Date * 1
					conn.reply(m.chat, `Feeding ${type} success`, m)
					if (lion > 0) {
						var naiklvl = ((lion * 1000) - 1)
						if (db.data.users[m.sender].lionexp > naiklvl) {
							db.data.users[m.sender].lion += 1
							db.data.users[m.sender].lionexp -= (lion * 100)
							conn.reply(m.chat, `*Congratulations your pet lion level up*`, m)
						}
					}
				} else m.reply(`Makanan Pet Kamu Tidak Cukup`)
			} else m.reply(`Pet Kamu Sudah Kenyang, Cobalah Untuk Memberi Dia Makan *${waktur}* Lagi`)
			break
		case 'horse':
			if (horse == 0) return m.reply('*You not have a pet horse*')
			if (horse == 5) return m.reply('*Your pet is already level max *')
			var __waktuk = (new Date - db.data.users[m.sender].horselastclaim)
			var _waktuk = (600000 - __waktuk)
			var waktuk = clockString(_waktuk)
			if (new Date - db.data.users[m.sender].horselastclaim > 600000) {
				if (db.data.users[m.sender].makananpet > 0) {
					db.data.users[m.sender].makananpet -= 1
					db.data.users[m.sender].horseexp += 20
					db.data.users[m.sender].horselastclaim = new Date * 1
					conn.reply(m.chat, `Feeding ${type} success`, m)
					setTimeout(() => {
						conn.reply(m.chat, 'Time to feeding *horse*\nI hungry sir..', m)
					}, timeda)
					if (horse > 0) {
						var naiklvl = ((horse * 1000) - 1)
						if (db.data.users[m.sender].horseexp > naiklvl) {
							db.data.users[m.sender].horse += 1
							db.data.users[m.sender].horseexp -= (horse * 1000)
							conn.reply(m.chat, `*Congratulations your pet horse level up*`, m)
						}
					}
				} else m.reply(`Makanan pet kamu tidak cukup`)
			} else m.reply(`Pet kamu sudah kenyang, coba kasih makan *${waktuk}* lagi`)
			break
		case 'wolf':
			if (wolf == 0) return m.reply('*You not have a pet wolf*')
			if (wolf == 5) return m.reply('*Your pet is already level max *')
			var __waktus = (new Date - db.data.users[m.sender].wolflastclaim)
			var _waktus = (600000 - __waktus)
			var waktus = clockString(_waktus)
			if (new Date - db.data.users[m.sender].wolflastclaim > 600000) {
				if (db.data.users[m.sender].makananpet > 0) {
					db.data.users[m.sender].makananpet -= 1
					db.data.users[m.sender].wolfexp += 15
					db.data.users[m.sender].wolflastclaim = new Date * 1
					conn.reply(m.chat, `Feeding ${type} success`, m)
					setTimeout(() => {
						conn.reply(m.chat, 'Time to feeding *wolf*\nI hungry sir..', m)
					}, timela)
					if (wolf > 0) {
						var naiklvl = ((wolf * 10000) - 1)
						if (db.data.users[m.sender].wolfexp > naiklvl) {
							db.data.users[m.sender].wolf += 1
							db.data.users[m.sender].wolfexp -= (wolf * 10000)
							conn.reply(m.chat, `*Congratulations your pet wolf level up*`, m)
						}
					}
				} else m.reply(`Makanan pet kamu tidak cukup`)
			} else m.reply(`Pet kamu sudah kenyang, coba kasih makan *${waktus}* lagi`)
			break
		case 'dragon':
			if (dragon == 0) return m.reply('*You not have a pet dragon*')
			if (dragon == 5) return m.reply('*Your pet is already level max *')
			var __waktug = (new Date - db.data.users[m.sender].dragonlastclaim)
			var _waktug = (600000 - __waktug)
			var waktug = clockString(_waktug)
			if (new Date - db.data.users[m.sender].dragonlastclaim > 600000) {
				if (db.data.users[m.sender].makanandragon > 0) {
					db.data.users[m.sender].makanandragon -= 1
					db.data.users[m.sender].dragonexp += 10
					db.data.users[m.sender].dragonlastclaim = new Date * 1
					conn.reply(m.chat, `Feeding ${type} success`, m)
					setTimeout(() => {
						conn.reply(m.chat, 'Time to feeding *dragon*\nI hungry sir..', m)
					}, timega)
					if (dragon > 0) {
						var naiklvl = ((dragon * 10000) - 1)
						if (db.data.users[m.sender].dragonexp > naiklvl) {
							db.data.users[m.sender].dragon += 1
							db.data.users[m.sender].dragonexp -= (dragon * 10000)
							conn.reply(m.chat, `*Congratulations your pet dragon level up*`, m)
						}
					}
				} else m.reply(`Makanan pet kamu tidak cukup`)
			} else m.reply(`Pet kamu sudah kenyang, coba kasih makan *${waktug}* lagi`)
			break
		case 'kyubi':
			if (kyubi == 0) return m.reply('*You not have a pet kyubi*')
			if (kyubi == 5) return m.reply('*Your pet is already level max *')
			var __waktuyu = (new Date - db.data.users[m.sender].kyubilastclaim)
			var _waktuyu = (600000 - __waktuyu)
			var waktuyu = clockString(_waktuyu)
			if (new Date - db.data.users[m.sender].kyubilastclaim > 600000) {
				if (db.data.users[m.sender].makanankyubi > 0) {
					db.data.users[m.sender].makanankyubi -= 1
					db.data.users[m.sender].kyubiexp += 10
					db.data.users[m.sender].kyubilastclaim = new Date * 1
					conn.reply(m.chat, `Feeding ${type} success`, m)
					setTimeout(() => {
						conn.reply(m.chat, 'Time to feeding *Kyubi*\nI hungry sir..', m)
					}, timebi)
					if (kyubi > 0) {
						var naiklvl = ((kyubi * 10000) - 1)
						if (db.data.users[m.sender].kyubiexp > naiklvl) {
							db.data.users[m.sender].kyubi += 1
							db.data.users[m.sender].kyubiexp -= (kyubi * 10000)
							conn.reply(m.chat, `*Congratulations your pet Kyubi level up*`, m)
						}
					}
				} else m.reply(`Makanan pet kamu tidak cukup`)
			} else m.reply(`Pet kamu sudah kenyang, coba kasih makan *${waktuyu}* lagi`)
			break
		case 'centaur':
			if (centaur == 0) return m.reply('*You not have a pet centaur*')
			if (centaur == 5) return m.reply('*Your pet is already level max *')
			var __waktuur = (new Date - db.data.users[m.sender].centaurlastclaim)
			var _waktuur = (600000 - __waktuur)
			var waktuur = clockString(_waktuur)
			if (new Date - db.data.users[m.sender].centaurlastclaim > 600000) {
				if (db.data.users[m.sender].makanancentaur > 0) {
					db.data.users[m.sender].makanancentaur -= 1
					db.data.users[m.sender].centaurexp += 10
					db.data.users[m.sender].centaurlastclaim = new Date * 1
					conn.reply(m.chat, `Feeding ${type} success`, m)
					setTimeout(() => {
						conn.reply(m.chat, 'Time to feeding *Centaur*\nI hungry sir..', m)
					}, timeur)
					if (centaur > 0) {
						var naiklvl = ((centaur * 10000) - 1)
						if (db.data.users[m.sender].centaurexp > naiklvl) {
							db.data.users[m.sender].centaur += 1
							db.data.users[m.sender].centaurexp -= (centaur * 10000)
							conn.reply(m.chat, `*Congratulations your pet Centaur level up*`, m)
						}
					}
				} else m.reply(`Makanan pet kamu tidak cukup`)
			} else m.reply(`Pet kamu sudah kenyang, coba kasih makan *${waktuur}* lagi`)
			break
		case 'phonix':
			if (phonix == 0) return m.reply('*You not have a pet Phonix*')
			if (phonix == 5) return m.reply('*Your pet is already level max *')
			var __waktux = (new Date - db.data.users[m.sender].phonixlastclaim)
			var _waktux = (600000 - __waktux)
			var waktux = clockString(_waktux)
			if (new Date - db.data.users[m.sender].phonixlastclaim > 600000) {
				if (db.data.users[m.sender].makananphonix > 0) {
					db.data.users[m.sender].makananphonix -= 1
					db.data.users[m.sender].phonixexp += 10
					db.data.users[m.sender].phonixlastclaim = new Date * 1
					conn.reply(m.chat, `Feeding ${type} success`, m)
					setTimeout(() => {
						conn.reply(m.chat, 'Time to feeding *Phonix*\nI hungry sir..', m)
					}, timenix)
					if (phonix > 0) {
						var naiklvl = ((phonix * 10000) - 1)
						if (db.data.users[m.sender].phonixexp > naiklvl) {
							db.data.users[m.sender].phonix += 1
							db.data.users[m.sender].phonixexp -= (phonix * 10000)
							conn.reply(m.chat, `*Congratulations your pet Phonix level up*`, m)
						}
					}
				} else m.reply(`Makanan pet kamu tidak cukup`)
			} else m.reply(`Pet kamu sudah kenyang, coba kasih makan *${waktux}* lagi`)
			break
		case 'griffin':
			if (griffin == 0) return m.reply('*You not have a pet Griffin*')
			if (griffin == 5) return m.reply('*Your pet is already level max *')
			var __waktufin = (new Date - db.data.users[m.sender].griffinastclaim)
			var _waktufin = (600000 - __waktufin)
			var waktufin = clockString(_waktufin)
			if (new Date - db.data.users[m.sender].griffinlastclaim > 600000) {
				if (db.data.users[m.sender].makanangriffin > 0) {
					db.data.users[m.sender].makanangriffin -= 1
					db.data.users[m.sender].griffinexp += 10
					db.data.users[m.sender].griffinlastclaim = new Date * 1
					conn.reply(m.chat, `Feeding ${type} success`, m)
					setTimeout(() => {
						conn.reply(m.chat, 'Time to feeding *Griffin*\nI hungry sir..', m)
					}, timefin)
					if (griffin > 0) {
						var naiklvl = ((griffin * 10000) - 1)
						if (db.data.users[m.sender].griffinexp > naiklvl) {
							db.data.users[m.sender].griffin += 1
							db.data.users[m.sender].griffinexp -= (griffin * 10000)
							conn.reply(m.chat, `*Congratulations your pet Greffin level up*`, m)
						}
					}
				} else m.reply(`Makanan pet kamu tidak cukup`)
			} else m.reply(`Pet kamu sudah kenyang, coba kasih makan *${waktufin}* lagi`)
			break
		case 'cat':
			if (cat == 0) return m.reply('*You not have a pet cat*')
			if (cat == 5) return m.reply('*Your pet is already level max *')
			var __waktu = (new Date - db.data.users[m.sender].catlastclaim)
			var _waktu = (600000 - __waktu)
			var waktu = clockString(_waktu)
			if (new Date - db.data.users[m.sender].catlastclaim > 600000) {
				if (db.data.users[m.sender].makananpet > 0) {
					db.data.users[m.sender].makananpet -= 1
					db.data.users[m.sender].catexp += 20
					db.data.users[m.sender].catlastclaim = new Date * 1
					conn.reply(m.chat, `Feeding ${type} success`, m)
					setTimeout(() => {
						conn.reply(m.chat, 'Time to feeding *cat*\nI hungry sir..', m)
					}, timecing)
					if (cat > 0) {
						var naiklvl = ((cat * 1000) - 1)
						if (db.data.users[m.sender].catexp > naiklvl) {
							db.data.users[m.sender].cat += 1
							db.data.users[m.sender].catexp -= (cat * 1000)
							conn.reply(m.chat, `*Congratulations your pet cat level up*`, m)
						}
					}
				} else m.reply(`Makanan pet kamu tidak cukup`)
			} else m.reply(`Pet kamu sudah kenyang, coba kasih makan *${waktu}* lagi`)
			break
		default:
			await conn.sendMessage(m.chat, {
				text: baba,
				footer: author,
				title: '「 *F E E D   PET* 」',
				buttonText: "F E E D",
				sections: [{
					title: "List Featured",
					rows: [{
						title: "Feed Fox",
						rowId: ".eat fox",
						description: "Memberi makan Fox"
					}, {
						title: "Feed rhinoceros",
						rowId: ".eat rhinoceros",
						description: "Memberi makan Rhinoceros"
					}, {
						title: "Feed Lion",
						rowId: ".eat lion",
						description: "Memberi makan Lion"
					}, {
						title: "Feed Horse",
						rowId: ".eat horse",
						description: "Memberi makan Horse"
					}, {
						title: "Feed Wolf",
						rowId: ".eat wolf",
						description: "Memberi makan Wolf"
					}, {
						title: "Feed Dragon",
						rowId: ".eat dragon",
						description: "Memberi makan Dragon"
					}, {
						title: "Feed Kyubi",
						rowId: ".eat kyubi",
						description: "Memberi makan Kyubi"
					}, {
						title: "Feed Centaur",
						rowId: ".eat centaur",
						description: "Memberi makan Centaur"
					}, {
						title: "Feed Griffin",
						rowId: ".eat griffin",
						description: "Memberi makan Griffin"
					}, {
						title: "Feed Phoenix",
						rowId: ".eat phoenix",
						description: "Memberi makan Phoenix"
					}, {
						title: "Feed Cat",
						rowId: ".eat cat",
						description: "Memberi makan Cat"
					}]
				}]
			})
	}
}
handler.help = ['feed [pet type]']
handler.tags = ['rpg']
handler.command = /^(feed(ing)?)$/i
handler.register = true
module.exports = handler

function clockString(ms) {
	var h = Math.floor(ms / 3600000)
	var m = Math.floor(ms / 60000) % 60
	var s = Math.floor(ms / 1000) % 60
	console.log({
		ms,
		h,
		m,
		s
	})
	return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}