var handler = async (m, {
	command,
	usedPrefix,
	args
}) => {
	var user = db.data.users[m.sender]
	var _armor = user.armor
	var armor = (_armor == 0 ? 20 : '' || _armor == 1 ? 49999 : '' || _armor == 2 ? 99999 : '' || _armor == 3 ? 149999 : '' || _armor == 4 ? 299999 : '')
	var uparmor = (_armor == 0 ? 'You don\'t have Armor ' : '' || _armor == 1 ? 30 : '' || _armor == 2 ? 60 : '' || _armor == 3 ? 90 : '' || _armor == 4 ? 120 : '')

	var _pickaxe = user.pickaxe
	var pickaxe = (_pickaxe == 0 ? 20 : '' || _pickaxe == 1 ? 56000 : '' || _pickaxe == 2 ? 120 : '' || _pickaxe == 3 ? 160000 : '' || _pickaxe == 4 ? 200 : '')
	var uppickaxe = (_pickaxe == 0 ? 0 : '' || _pickaxe == 1 ? 25 : '' || _pickaxe == 2 ? 55 : '' || _pickaxe == 3 ? 75 : '' || _pickaxe == 4 ? 120 : '')
	var durpickaxe = (_pickaxe == 0 ? 0 : '' || _pickaxe == 1 ? 40 : '' || _pickaxe == 2 ? 60 : '' || _pickaxe == 3 ? 80 : '' || _pikaxe == 4 ? 100 : '')
	var repickaxe = (_pickaxe == 0 ? 0 : '' || _pickaxe == 1 ? 20 : '' || _pickaxe == 2 ? 20 : '' || _pickaxe == 3 ? 20 : '' || _pikaxe == 4 ? 20 : '')
	var drepickaxe = (_pickaxe == 0 ? 0 : '' || _pickaxe == 1 ? 10 : '' || _pickaxe == 2 ? 25 : '' || _pickaxe == 3 ? 40 : '' || _pikaxe == 4 ? 60 : '')

	var _fishingrod = user.fishingrod
	var fishingrod = (_fishingrod == 0 ? 15000 : '' || _fishingrod == 1 ? 49000 : '' || _fishingrod == 2 ? 90000 : '' || _fishingrod == 3 ? 120 : '' || _fishingrod == 4 ? 150000 : '')
	var upfishingrod = (_fishingrod == 0 ? 0 : '' || _fishingrod == 1 ? 25 : '' || _fishingrod == 2 ? 55 : '' || _fishingrod == 3 ? 75 : '' || _fishingrod == 4 ? 120 : '')
	var durfishingrod = (_fishingrod == 0 ? 0 : '' || _fishingrod == 1 ? 40 : '' || _fishingrod == 2 ? 60 : '' || _fishingrod == 3 ? 80 : '' || _pikaxe == 4 ? 100 : '')
	var refishingrod = (_fishingrod == 0 ? 0 : '' || _fishingrod == 1 ? 20 : '' || _fishingrod == 2 ? 20 : '' || _fishingrod == 3 ? 20 : '' || _pikaxe == 4 ? 20 : '')
	var drefishingrod = (_fishingrod == 0 ? 0 : '' || _fishingrod == 1 ? 10 : '' || _fishingrod == 2 ? 25 : '' || _fishingrod == 3 ? 40 : '' || _pikaxe == 4 ? 60 : '')

	var _axe = user.axe
	var axe = (_axe == 0 ? 10000 : '' || _axe == 1 ? 50000 : '' || _axe == 2 ? 90000 : '' || _axe == 3 ? 140000 : '' || _axe == 4 ? 200 : '')
	var upaxe = (_axe == 0 ? 0 : '' || _axe == 1 ? 25 : '' || _axe == 2 ? 55 : '' || _axe == 3 ? 75 : '' || _axe == 4 ? 120 : '')
	var duraxe = (_axe == 0 ? 0 : '' || _axe == 1 ? 40 : '' || _axe == 2 ? 60 : '' || _axe == 3 ? 80 : '' || _pikaxe == 4 ? 100 : '')
	var reaxe = (_axe == 0 ? 0 : '' || _axe == 1 ? 20 : '' || _axe == 2 ? 20 : '' || _axe == 3 ? 20 : '' || _pikaxe == 4 ? 20 : '')
	var dreaxe = (_axe == 0 ? 0 : '' || _axe == 1 ? 10 : '' || _axe == 2 ? 25 : '' || _axe == 3 ? 40 : '' || _pikaxe == 4 ? 60 : '')

	var _sword = user.sword
	var sword = (_sword == 0 ? 25000 : '' || _sword == 1 ? 60000 : '' || _sword == 2 ? 150000 : '' || _sword == 3 ? 200 : '' || _sword == 4 ? 270000 : '')
	var upsword = (_sword == 0 ? 0 : '' || _sword == 1 ? 15 : '' || _sword == 2 ? 40 : '' || _sword == 3 ? 65 : '' || _sword == 4 ? 100 : '')
	var dursword = (_sword == 0 ? 0 : '' || _sword == 1 ? 40 : '' || _sword == 2 ? 60 : '' || _sword == 3 ? 80 : '' || _sword == 4 ? 100 : '')
	var resword = (_sword == 0 ? 0 : '' || _sword == 1 ? 20 : '' || _sword == 2 ? 20 : '' || _sword == 3 ? 20 : '' || _sword == 4 ? 20 : '')
	var dresword = (_sword == 0 ? 0 : '' || _sword == 1 ? 10 : '' || _sword == 2 ? 25 : '' || _sword == 3 ? 40 : '' || _sword == 4 ? 60 : '')

	var _bow = user.bow
	var bow = (_bow == 0 ? 20 : '' || _bow == 1 ? 60000 : '' || _bow == 2 ? 130000 : '' || _bow == 3 ? 190000 : '' || _bow == 4 ? 240000 : '')
	var upbow = (_bow == 0 ? 0 : '' || _bow == 1 ? 15 : '' || _bow == 2 ? 40 : '' || _bow == 3 ? 65 : '' || _bow == 4 ? 100 : '')
	var durbow = (_bow == 0 ? 0 : '' || _bow == 1 ? 40 : '' || _bow == 2 ? 60 : '' || _bow == 3 ? 80 : '' || _bow == 4 ? 100 : '')
	var rebow = (_bow == 0 ? 0 : '' || _bow == 1 ? 20 : '' || _bow == 2 ? 20 : '' || _bow == 3 ? 20 : '' || _bow == 4 ? 20 : '')
	var drebow = (_bow == 0 ? 0 : '' || _bow == 1 ? 10 : '' || _bow == 2 ? 25 : '' || _bow == 3 ? 40 : '' || _bow == 4 ? 60 : '')

	var upgrd = (args[0] || '').toLowerCase()
	var type = (args[0] || '').toLowerCase()
	var _type = (args[1] || '').toLowerCase()
	var jualbeli = (args[0] || '').toLowerCase()
	var sections = [{
		title: "List Featured",
		rows: [{
			title: "UPGRADE PICKAXE ⛏️",
			rowId: ".upgrade pickaxe",
			description: "Upgrade Pickaxe"
		}, {
			title: "UPGRADE AXE 🪓",
			rowId: ".upgrade axe",
			description: "Upgrade Axe"
		}, {
			title: "UPGRADE SWORD ⚔️",
			rowId: ".upgrade sword",
			description: "Upgrade Sword"
		}, {
			title: "UPGRADE BOW ⚔️",
			rowId: ".upgrade bow",
			description: "Upgrade Bow"
		}, {
			title: "UPGRADE FISHING ROD 🎣",
			rowId: ".upgrade fishingrod",
			description: "Upgrade Fishing Rod"
		}, {
			title: "UPGRADE ARMOR 🥼",
			rowId: ".upgrade stick",
			description: "Craft Stick"
		}]
	}, {
		title: `-------✦ REPAIR ✦-------`,
		rows: [{
			title: "REPAIR PICKAXE ⛏️",
			rowId: ".repair pickaxe",
			description: "Repair Pickaxe"
		}, {
			title: "REPAIR AXE 🪓",
			rowId: ".repair axe",
			description: "Repair Axe"
		}, {
			title: "REPAIR SWORD ⚔️",
			rowId: ".repair sword",
			description: "Repair Sword"
		}, {
			title: "REPAIR BOW ⚔️",
			rowId: ".repair bow",
			description: "Repair Bow"
		}, {
			title: "REPAIR FISHING ROD 🎣",
			rowId: ".repair fishingrod",
			description: "Repair Fishing Rod"
		}]
	}]
	var list = `
▧ *🥼 Armor:* ${uparmor} 💎 ${_armor == 0 ? '(Belum memiliki)' : _armor == 12 ? '( *Level max* )' : ''}
▧ *🎣 Fishingrod:* ${upfishingrod} 💎
〉  *Durability:* ${durfishingrod} ${_fishingrod == 0 ? '(Belum memiliki)' : _fishingrod == 12 ? '( *Level max* )' : ''}
▧ *⛏️ Pickaxe:* ${uppickaxe} 💎
〉  *Durability:* ${durpickaxe} ${_pickaxe == 0 ? '(Belum memiliki)' : _pickaxe == 12 ? '( *Level max* )' : ''}
▧ *🪓Axe:* ${upaxe} 💎
〉  *Durability:* ${duraxe} ${_axe == 0 ? '(Belum memiliki)' : _axe == 12 ? '( *Level max* )' : ''}
▧ *🗡️ Sword:* ${upsword} 💎
〉  *Durability:* ${dursword} ${_sword == 0 ? '(Belum memiliki)' : _sword == 12 ? '( *Level max* )' : ''}
▧ *🏹 Bow:* ${upbow} 💎
〉  *Durability:* ${durbow} ${_bow == 0 ? '(Belum memiliki)' : _bow == 12 ? '( *Level max* )' : ''}


「 *R E P A I R* 」

▧ *🎣 Fishingrod:* ${refishingrod} 💹 ${_fishingrod == 0 ? '(Belum memiliki)' : _fishingrod == 12 ? '( *Level max* )' : ''}
〉  + ${drefishingrod} Durability 
▧ *⛏️ Pickaxe:* ${repickaxe} 💹 ${_pickaxe == 0 ? '(Belum memiliki)' : _pickaxe == 12 ? '( *Level max* )' : ''}
〉  + ${drepickaxe} Durability
▧ *🪓 axe:* ${reaxe} 💹 ${_axe == 0 ? '(Belum memiliki)' : _axe == 12 ? '( *Level max* )' : ''}
〉  + ${dreaxe} Durability
▧ *🗡️ Sword:* ${resword} 💹 ${_sword == 0 ? '(Belum memiliki)' : _sword == 12 ? '( *Level max* )' : ''}
〉  + ${dresword} Durability
▧ *🏹 bow:* ${rebow} 💹 ${_bow == 0 ? '(Belum memiliki)' : _bow == 12 ? '( *Level max* )' : ''}
〉  + ${drebow} Durability
`.trim()
	try {
		if (/repair/i.test(command)) {
			var count = args[1] && args[1].length > 0 ? Math.min(99999999, Math.max(parseInt(args[1]), 1)) : !args[1] || args.length < 3 ? 1 : Math.min(1, count)
			switch (type) {
				case 'fishingrod':
					if (user.fishingroddurability == 80) return conn.reply(m.chat, 'fishingrodan mu belum ada kerusakan', m)
					if (user.fishingrod == 0) return conn.reply(m.chat, 'Kamu belum mempunyai fishingrodan', m)
					if (user.diamond > refishingrod) {
						user.fishingrod += 1
						user.diamond -= refishingrod * 1
						user.fishingroddurability += drefishingrod
						conn.reply(m.chat, `✔️ Sukses Mengrepair Fishingrod 🎣  Seharga ${refishingrod} Diamond 💎\n➕ ${drefishingrod} Durability`, m)
					} else conn.reply(m.chat, `Diamond Mu Tidak Cukup Untuk Merepair Fishingrod 🎣  Seharga ${refishingrod} Diamond 💎`, m)
					break
				case 'bow':
					if (user.bowdurability == 80) return conn.reply(m.chat, 'bowan mu belum ada kerusakan', m)
					if (user.bow == 0) return conn.reply(m.chat, 'Kamu belum mempunyai bowan', m)
					if (user.diamond > rebow) {
						user.bow += 1
						user.diamond -= rebow * 1
						user.bowdurability += drebow
						conn.reply(m.chat, `✔️ Sukses Mengrepair bow 🏹  Seharga ${rebow} Diamond 💎\n➕ ${drebow} Durability`, m)
					} else conn.reply(m.chat, `Diamond Mu Tidak Cukup Untuk Merepair bow 🏹  Seharga ${rebow} Diamond 💎`, m)
					break
				case 'armor':
					if (user.armordurability == 80) return conn.reply(m.chat, 'armoran mu belum ada kerusakan', m)
					if (user.armor == 0) return conn.reply(m.chat, 'Kamu belum mempunyai armoran', m)
					if (user.diamond > rearmor) {
						user.armor += 1
						user.diamond -= rearmor * 1
						user.armordurability += drearmor
						conn.reply(m.chat, `✔️ Sukses Mengrepair armor 🥼  Seharga ${rearmor} Diamond 💎\n➕ ${drearmor} Durability`, m)
					} else conn.reply(m.chat, `Diamond Mu Tidak Cukup Untuk Merepair armor 🥼  Seharga ${rearmor} Diamond 💎`, m)
					break
				case 'pickaxe':
					if (user.pickaxedurability == 80) return conn.reply(m.chat, 'Pickaxe mu belum ada kerusakan', m)
					if (user.pickaxe == 0) return conn.reply(m.chat, 'Kamu belum mempunyai Pickaxe', m)
					if (user.diamond > repickaxe) {
						user.pickaxe += 1
						user.diamond -= repickaxe * 1
						user.pickaxedurability += drepickaxe
						conn.reply(m.chat, `✔️ Sukses Mengrepair Pickaxe ⛏️ Seharga ${repickaxe} Diamond 💎\n➕ ${drepickaxe} Durability`, m)
					} else conn.reply(m.chat, `Diamond Mu Tidak Cukup Untuk Merepair Pickaxe ⛏️  Seharga ${repickaxe} Diamond 💎`, m)
					break
				case 'axe':
					if (user.axedurability == 80) return conn.reply(m.chat, 'axe mu belum ada kerusakan', m)
					if (user.axe == 0) return conn.reply(m.chat, 'Kamu belum mempunyai axe', m)
					if (user.diamond > reaxe) {
						user.axe += 1
						user.diamond -= reaxe * 1
						user.axedurability += dreaxe
						conn.reply(m.chat, `✔️ Sukses Mengrepair axe 🪓 Seharga ${reaxe} Diamond 💎\n➕ ${dreaxe} Durability`, m)
					} else conn.reply(m.chat, `Diamond Mu Tidak Cukup Untuk Merepair axe 🪓  Seharga ${reaxe} Diamond 💎`, m)
					break
				case 'sword':
					if (user.sworddurability == 80) return conn.reply(m.chat, 'Sword mu belum ada kerusakan', m)
					if (user.sword == 0) return conn.reply(m.chat, 'Kamu belum mempunyai Sword', m)
					if (user.diamond > resword) {
						user.sword += 1
						user.diamond -= resword * 1
						user.sworddurability += dresword
						conn.reply(m.chat, `✔️ Sukses Mengrepair Sword 🗡️ Seharga ${resword} Diamond 💎\n➕ ${dresword} Durability`, m)
					} else conn.reply(m.chat, `Diamond Mu Tidak Cukup Untuk Merepair Sword 🗡️  Seharga ${resword} Diamond 💎`, m)
					break
				default:
					await conn.sendMessage(m.chat, {
						text: list,
						footer: author,
						title: '「 *U P G R A D E* 」',
						buttonText: "R E P A I R",
						sections
					})
			}
		} else if (/upgrade/i.test(command)) {
			var count = args[2] && args[2].length > 0 ? Math.min(99999999, Math.max(parseInt(args[2]), 1)) : !args[2] || args.length < 4 ? 1 : Math.min(1, count)
			switch (_type) {
				case 'armor':
					if (user.armor == 5) return conn.reply(m.chat, 'Armormu sudah *Level Max*', m)
					if (user.armor == 0) return conn.reply(m.chat, 'Kamu belum mempunyai Armor', m)
					if (user.diamond > uparmor) {
						user.armor += 1
						user.diamond -= uparmor * 1
						conn.reply(m.chat, `✔️ Sukses Mengupgrade Armor 🥼 Seharga ${uparmor} Money`, m)
					} else conn.reply(m.chat, `Diamond Mu Tidak Cukup Untuk Mengupgrade Armor 🥼 Seharga ${uparmor} Diamond 💎`, m)
					break
				case 'fishingrod':
					if (user.fishingrod == 4) return conn.reply(m.chat, 'fishingrodan mu udah *Level Max*', m)
					if (user.fishingrod == 0) return conn.reply(m.chat, 'Kamu belum mempunyai fishingrodan', m)
					if (user.diamond > upfishingrod) {
						user.fishingrod += 1
						user.diamond -= upfishingrod * 1
						user.fishingroddurability = durfishingrod
						conn.reply(m.chat, `✔️ Sukses Mengupgrade Fishingrod 🎣  Seharga ${upfishingrod} Diamond 💎`, m)
					} else conn.reply(m.chat, `Diamond Mu Tidak Cukup Untuk Mengupgrade Fishingrod 🎣  Seharga ${upfishingrod} Diamond 💎`, m)
					break
				case 'armor':
					if (user.armor == 4) return conn.reply(m.chat, 'armoran mu udah *Level Max*', m)
					if (user.armor == 0) return conn.reply(m.chat, 'Kamu belum mempunyai armoran', m)
					if (user.diamond > uparmor) {
						user.armor += 1
						user.diamond -= uparmor * 1
						user.armordurability = durarmor
						conn.reply(m.chat, `✔️ Sukses Mengupgrade armor 🥼  Seharga ${uparmor} Diamond 💎`, m)
					} else conn.reply(m.chat, `Diamond Mu Tidak Cukup Untuk Mengupgrade armor 🥼  Seharga ${uparmor} Diamond 💎`, m)
					break
				case 'bow':
					if (user.bow == 4) return conn.reply(m.chat, 'bowan mu udah *Level Max*', m)
					if (user.bow == 0) return conn.reply(m.chat, 'Kamu belum mempunyai bowan', m)
					if (user.diamond > upbow) {
						user.bow += 1
						user.diamond -= upbow * 1
						user.bowdurability = durbow
						conn.reply(m.chat, `✔️ Sukses Mengupgrade bow 🏹  Seharga ${upbow} Diamond 💎`, m)
					} else conn.reply(m.chat, `Diamond Mu Tidak Cukup Untuk Mengupgrade bow 🏹  Seharga ${upbow} Diamond 💎`, m)
					break
				case 'sword':
					if (user.sword == 5) return conn.reply(m.chat, 'Sword mu udah *Level Max*', m)
					if (user.sword == 0) return conn.reply(m.chat, 'Kamu belum mempunyai Sword', m)
					if (user.diamond > upsword) {
						user.sword += 1
						user.diamond -= upsword * 1
						user.sworddurability = dursword
						conn.reply(m.chat, `✔️ Sukses Mengupgrade Sword 🗡️ Seharga ${upsword} Diamond 💎`, m)
					} else conn.reply(m.chat, `Diamond Mu Tidak Cukup Untuk Mengupgrade Sword 🗡️ Seharga ${upsword} Diamond 💎`, m)
					break
				case 'pickaxe':
					if (user.pickaxe == 5) return conn.reply(m.chat, 'Pickaxe mu udah *Level Max*', m)
					if (user.pickaxe == 0) return conn.reply(m.chat, 'Kamu belum mempunyai Pickaxe', m)
					if (user.diamond > uppickaxe) {
						user.pickaxe += 1
						user.diamond -= uppickaxe * 1
						user.pickaxedurability = durpickaxe
						conn.reply(m.chat, `✔️ Sukses Mengupgrade Pickaxe ⛏️ Seharga ${uppickaxe} Diamond 💎`, m)
					} else conn.reply(m.chat, `Diamond Mu Tidak Cukup Untuk Mengupgrade Pickaxe ⛏️  Seharga ${uppickaxe} Diamond 💎`, m)
					break
				case 'axe':
					if (user.axe == 5) return conn.reply(m.chat, 'axe mu udah *Level Max*', m)
					if (user.axe == 0) return conn.reply(m.chat, 'Kamu belum mempunyai axe', m)
					if (user.diamond > upaxe) {
						user.axe += 1
						user.diamond -= upaxe * 1
						user.axedurability = duraxe
						conn.reply(m.chat, `✔️ Sukses Mengupgrade axe 🪓 Seharga ${upaxe} Diamond 💎`, m)
					} else conn.reply(m.chat, `Diamond Mu Tidak Cukup Untuk Mengupgrade axe 🪓  Seharga ${upaxe} Diamond 💎`, m)
					break
				default:
					await conn.sendMessage(m.chat, {
						text: list,
						footer: author,
						title: '「 *U P G R A D E* 」',
						buttonText: "R E P A I R",
						sections
					})
			}

			console.log(e)
			if (DevMode) {
				for (var jid of global.owner.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').filter(v => v != conn.user.jid)) {
					conn.sendMessage(jid, 'shop.js error\nNo: *' + m.sender.split`@` [0] + '*\nCommand: *' + m.text + '*\n\n*' + e + '*', MessageType.text)
				}
			}
		}
	} catch (e) {
		throw e
	}
}
handler.help = ['repair', 'upgrade']
handler.tags = ['rpg']
handler.register = true
handler.command = /^(up|upgrade|repair)$/i
module.exports = handler

var wm = global.botwm