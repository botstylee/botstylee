let handler = async (m, {
	command,
	usedPrefix,
	args
}) => {
	let user = db.data.users[m.sender]
    const _armor = user.armor
    const armor = (_armor == 0 ? 20 : '' || _armor == 1 ? 49999 : '' || _armor == 2 ? 99999 : '' || _armor == 3 ? 149999 : '' || _armor == 4 ? 299999 : '')
    const uparmor = (_armor == 0 ? 'You don't have Armor' : '' || _armor == 1 ? 30 : '' || _armor == 2 ? 60 : '' || _armor== 3 ? 90 : '' || _armor == 4 ? 120 : '')

    const _pickaxe = user.pickaxe
    const pickaxe = (_pickaxe == 0 ? 20 : '' || _pickaxe == 1 ? 56000 : '' || _pickaxe == 2 ? 120 : '' || _pickaxe == 3 ? 160000 : '' || _pickaxe == 4 ? 200 : '')
    const uppickaxe = (_pickaxe == 0 ? 0 : '' || _pickaxe == 1 ? 25 : '' || _pickaxe == 2 ? 55 : '' || _pickaxe == 3 ? 75 : '' || _pickaxe == 4 ? 120 : '')
    const durpickaxe = (_pickaxe == 0 ? 0 : '' || _pickaxe == 1 ? 40 : '' || _pickaxe == 2 ? 60 : '' || _pickaxe == 3 ? 80 : '' || _pikaxe == 4 ? 100 : '')
    const repickaxe = (_pickaxe == 0 ? 0 : '' || _pickaxe == 1 ? 20 : '' || _pickaxe == 2 ? 20 : '' || _pickaxe == 3 ? 20 : '' || _pikaxe == 4 ? 20 : '')
    const drepickaxe = (_pickaxe == 0 ? 0 : '' || _pickaxe == 1 ? 10 : '' || _pickaxe == 2 ? 25 : '' || _pickaxe == 3 ? 40 : '' || _pikaxe == 4 ? 60 : '')
    
    const _fishingrod = user.fishingrod
    const fishingrod = (_fishingrod == 0 ? 15000 : '' || _fishingrod == 1 ? 49000 : '' || _fishingrod == 2 ? 90000 : '' || _fishingrod == 3 ? 120 : '' || _fishingrod == 4 ? 150000 : '')
    const upfishingrod = (_fishingrod == 0 ? 0 : '' || _fishingrod == 1 ? 25 : '' || _fishingrod == 2 ? 55 : '' || _fishingrod == 3 ? 75 : '' || _fishingrod == 4 ? 120 : '')
    const durfishingrod = (_fishingrod == 0 ? 0 : '' || _fishingrod == 1 ? 40 : '' || _fishingrod == 2 ? 60 : '' || _fishingrod == 3 ? 80 : '' || _pikaxe == 4 ? 100 : '')
    const refishingrod = (_fishingrod == 0 ? 0 : '' || _fishingrod == 1 ? 20 : '' || _fishingrod == 2 ? 20 : '' || _fishingrod == 3 ? 20 : '' || _pikaxe == 4 ? 20 : '')
    const drefishingrod = (_fishingrod == 0 ? 0 : '' || _fishingrod == 1 ? 10 : '' || _fishingrod == 2 ? 25 : '' || _fishingrod == 3 ? 40 : '' || _pikaxe == 4 ? 60 : '')
    
    const _axe = user.axe
    const axe = (_axe == 0 ? 10000 : '' || _axe == 1 ? 50000 : '' || _axe == 2 ? 90000 : '' || _axe == 3 ? 140000 : '' || _axe == 4 ? 200 : '')
    const upaxe = (_axe == 0 ? 0 : '' || _axe == 1 ? 25 : '' || _axe == 2 ? 55 : '' || _axe == 3 ? 75 : '' || _axe == 4 ? 120 : '')
    const duraxe = (_axe == 0 ? 0 : '' || _axe == 1 ? 40 : '' || _axe == 2 ? 60 : '' || _axe == 3 ? 80 : '' || _pikaxe == 4 ? 100 : '')
    const reaxe = (_axe == 0 ? 0 : '' || _axe == 1 ? 20 : '' || _axe == 2 ? 20 : '' || _axe == 3 ? 20 : '' || _pikaxe == 4 ? 20 : '')
    const dreaxe = (_axe == 0 ? 0 : '' || _axe == 1 ? 10 : '' || _axe == 2 ? 25 : '' || _axe == 3 ? 40 : '' || _pikaxe == 4 ? 60 : '')
    
    const _sword = user.sword
    const sword = (_sword == 0 ? 25000 : '' || _sword == 1 ? 60000 : '' || _sword == 2 ? 150000 : '' || _sword == 3 ? 200 : '' || _sword == 4 ? 270000 : '')
    const upsword = (_sword == 0 ? 0 : '' || _sword == 1 ? 15 : '' || _sword == 2 ? 40 : '' || _sword== 3 ? 65 : '' || _sword == 4 ? 100 : '')
    const dursword = (_sword == 0 ? 0 : '' || _sword == 1 ? 40 : '' || _sword == 2 ? 60 : '' || _sword == 3 ? 80 : '' || _sword == 4 ? 100 : '')
    const resword = (_sword == 0 ? 0 : '' || _sword == 1 ? 20 : '' || _sword == 2 ? 20 : '' || _sword == 3 ? 20 : '' || _sword == 4 ? 20 : '')
    const dresword = (_sword == 0 ? 0 : '' || _sword == 1 ? 10 : '' || _sword == 2 ? 25 : '' || _sword == 3 ? 40 : '' || _sword == 4 ? 60 : '')
    
    const _bow = user.bow
    const bow = (_bow == 0 ? 20 : '' || _bow == 1 ? 60000 : '' || _bow == 2 ? 130000 : '' || _bow == 3 ? 190000 : '' || _bow == 4 ? 240000 : '')
    const upbow = (_bow == 0 ? 0 : '' || _bow == 1 ? 15 : '' || _bow == 2 ? 40 : '' || _bow== 3 ? 65 : '' || _bow == 4 ? 100 : '')
    const durbow = (_bow == 0 ? 0 : '' || _bow == 1 ? 40 : '' || _bow == 2 ? 60 : '' || _bow == 3 ? 80 : '' || _bow == 4 ? 100 : '')
    const rebow = (_bow == 0 ? 0 : '' || _bow == 1 ? 20 : '' || _bow == 2 ? 20 : '' || _bow == 3 ? 20 : '' || _bow == 4 ? 20 : '')
    const drebow = (_bow == 0 ? 0 : '' || _bow == 1 ? 10 : '' || _bow == 2 ? 25 : '' || _bow == 3 ? 40 : '' || _bow == 4 ? 60 : '')
    
    let upgrd = (args[0] || '').toLowerCase()
    let type = (args[0] || '').toLowerCase()
    let _type = (args[1] || '').toLowerCase()
    let jualbeli = (args[0] || '').toLowerCase()
    const list = `
*🎒 REPAIR*
╭───────────
│┏━━━━━━━━━━━━━━━━
│┃ *🔨 Upgrade & Repair | 💲 Harga*
│┗━━━━━━━━━━━━━━━━
│⬡ *◪ Upgrade ⏫*
│
│⬡ *🥼 Armor:* ${uparmor} 💎 ${_armor == 0 ? '(Belum memiliki)' : _armor == 5 ? '( *Level max* )' : ''}
│
│⬡ *🎣 Fishingrod:* ${upfishingrod} 💎
│⬡  *Durability:* ${durfishingrod} ${_fishingrod == 0 ? '(Belum memiliki)' : _fishingrod == 5 ? '( *Level max* )' : ''}
│
│⬡ *⛏️ Pickaxe:* ${uppickaxe} 💎
│⬡  *Durability:* ${durpickaxe} ${_pickaxe == 0 ? '(Belum memiliki)' : _pickaxe == 5 ? '( *Level max* )' : ''}
│
│⬡ *🗡️ Sword:* ${upsword} 💎
│⬡  *Durability:* ${dursword} ${_sword == 0 ? '(Belum memiliki)' : _sword == 5 ? '( *Level max* )' : ''}
│
│⬡ *🏹 Bow:* ${upbow} 💎
│⬡  *Durability:* ${durbow} ${_bow == 0 ? '(Belum memiliki)' : _bow == 5 ? '( *Level max* )' : ''}
╰───────────
╭───────────
│┏━━━━━━━━━━━━
│┃*◪ Repair 🔨*
│┗━━━━━━━━━━━━
│⬡ *🎣 Fishingrod:* ${refishingrod} 💹 ${_fishingrod == 0 ? '(Belum memiliki)' : _fishingrod == 5 ? '( *Level max* )' : ''}
│⬡  + ${drefishingrod} Durability 
│
│⬡ *⛏️ Pickaxe:* ${repickaxe} 💹 ${_pickaxe == 0 ? '(Belum memiliki)' : _pickaxe == 5 ? '( *Level max* )' : ''}
│⬡  + ${drepickaxe} Durability
│
│⬡ *🗡️ Sword:* ${resword} 💹 ${_sword == 0 ? '(Belum memiliki)' : _sword == 5 ? '( *Level max* )' : ''}
│⬡  + ${dresword} Durability
│
│⬡ *🗡️ bow:* ${rebow} 💹 ${_bow == 0 ? '(Belum memiliki)' : _bow == 5 ? '( *Level max* )' : ''}
│⬡  + ${drebow} Durability
╰───────────
`.trim()
    //try {
    if (/repair/i.test(command)) {
      const count = args[1] && args[1].length > 0 ? Math.min(99999999, Math.max(parseInt(args[1]), 1)) : !args[1] || args.length < 3 ? 1 : Math.min(1, count)
        switch (type) {
          case 'fishingrod':
                            if (user.fishingroddurability == 80) return conn.reply(m.chat, 'your fishingrod not have damage', m)
                            if (user.fishingrod == 0) return conn.reply(m.chat, 'You don't have fishingrod', m)
                            if (user.diamond > refishingrod) {
                                user.fishingrod += 1
                                user.diamond -= refishingrod * 1
                                user.fishingroddurability += drefishingrod
                                conn.reply(m.chat, `✔️ Success repair Fishingrod 🎣  worth ${refishingrod} Diamond 💎\n➕ ${drefishingrod} Durability` ,m)
                            } else conn.reply(m.chat, `Your Diamonds Are Not Enough To Repair Fishingrod 🎣  worth ${refishingrod} Diamond 💎`, m)
                        
                        break
                        case 'bow':
                            if (user.bowdurability == 80) return conn.reply(m.chat, 'Your bow mu not have damage', m)
                            if (user.bow == 0) return conn.reply(m.chat, 'You don't have bow', m)
                            if (user.diamond > rebow) {
                                user.bow += 1
                                user.diamond -= rebow * 1
                                user.bowdurability += drebow
                                conn.reply(m.chat, `✔️ Success repair bow 🏹  worth ${rebow} Diamond 💎\n➕ ${drebow} Durability` ,m)
                            } else conn.reply(m.chat, `Your Diamonds Are Not Enough To Repair bow 🏹  worth ${rebow} Diamond 💎`, m)
                        
                        break
                        case 'armor':
                            if (user.armordurability == 80) return conn.reply(m.chat, 'your armor not have damage', m)
                            if (user.armor == 0) return conn.reply(m.chat, 'You don't have armor', m)
                            if (user.diamond > rearmor) {
                                user.armor += 1
                                user.diamond -= rearmor * 1
                                user.armordurability += drearmor
                                conn.reply(m.chat, `✔️ Success repair armor 🥼  worth ${rearmor} Diamond 💎\n➕ ${drearmor} Durability` ,m)
                            } else conn.reply(m.chat, `Your Diamonds Are Not Enough To Repair armor 🥼  worth ${rearmor} Diamond 💎`, m)
                        
                        break
                        case 'pickaxe':
                            if (user.pickaxedurability == 80) return conn.reply(m.chat, 'Your pickaxe not have damage', m)
                            if (user.pickaxe == 0) return conn.reply(m.chat, 'You don't have Pickaxe', m)
                            if (user.diamond > repickaxe) {
                                user.pickaxe += 1
                                user.diamond -= repickaxe * 1
                                user.pickaxedurability += drepickaxe
                                conn.reply(m.chat, `✔️ Success repair Pickaxe ⛏️ worth ${repickaxe} Diamond 💎\n➕ ${drepickaxe} Durability` ,m)
                            } else conn.reply(m.chat, `Your Diamonds Are Not Enough To Repair Pickaxe ⛏️  worth ${repickaxe} Diamond 💎`, m)
                        
                        break
                            case 'sword':
                            if (user.sworddurability == 80) return conn.reply(m.chat, 'Your sword not have damage', m)
                            if (user.sword == 0) return conn.reply(m.chat, 'You don't have Sword', m)
                            if (user.diamond > resword) {
                                user.sword += 1
                                user.diamond -= resword * 1
                                user.sworddurability += dresword
                                conn.reply(m.chat, `✔️ Success repair Sword 🗡️ worth ${resword} Diamond 💎\n➕ ${dresword} Durability` ,m)
                            } else conn.reply(m.chat, `Your Diamonds Are Not Enough To Repair Sword 🗡️  worth ${resword} Diamond 💎`, m)
                        
                        break
          default:
          return conn.reply(m.chat, list,m)
        }
    } else if (/upgrade/i.test(command)) {
      const count = args[2] && args[2].length > 0 ? Math.min(99999999, Math.max(parseInt(args[2]), 1)) : !args[2] || args.length < 4 ? 1 :Math.min(1, count)
      switch (_type) {
        case 'armor':
                            if (user.armor == 5) return conn.reply(m.chat, 'Your armor already *Level Max*', m)
                            if (user.armor == 0) return conn.reply(m.chat, 'You don't have Armor', m)
                            if (user.diamond > uparmor) {
                                user.armor += 1
                                user.diamond -= uparmor * 1
                                conn.reply(m.chat, `✔️ Sukses upgrade Armor 🥼 worth ${uparmor} Money` ,m)
                            } else conn.reply(m.chat, `Uang Mu Tidak Cukup Untuk upgrade Armor 🥼 worth ${uparmor} Money 💹`, m)
                        
                        break
                        case 'fishingrod':
                            if (user.fishingrod == 4) return conn.reply(m.chat, 'Your fishingrod already *Level Max*', m)
                            if (user.fishingrod == 0) return conn.reply(m.chat, 'You don't have fishingrod', m)
                            if (user.diamond > upfishingrod) {
                                user.fishingrod += 1
                                user.diamond -= upfishingrod * 1
                                user.fishingroddurability = durfishingrod
                                conn.reply(m.chat, `✔️ Sukses upgrade Fishingrod 🎣  worth ${upfishingrod} Diamond 💎` ,m)
                            } else conn.reply(m.chat, `Your Diamonds Are Not Enough To Upgrade Fishingrod 🎣  worth ${upfishingrod} Diamond 💎`, m)
                        
                        break
                        case 'armor':
                            if (user.armor == 4) return conn.reply(m.chat, 'Your armor already *Level Max*', m)
                            if (user.armor == 0) return conn.reply(m.chat, 'You don't have armor', m)
                            if (user.diamond > uparmor) {
                                user.armor += 1
                                user.diamond -= uparmor * 1
                                user.armordurability = durarmor
                                conn.reply(m.chat, `✔️ Sukses upgrade armor 🥼  worth ${uparmor} Diamond 💎` ,m)
                            } else conn.reply(m.chat, `Your Diamonds Are Not Enough To Upgrade armor 🥼  worth ${uparmor} Diamond 💎`, m)
                        
                        break
                        case 'bow':
                            if (user.bow == 4) return conn.reply(m.chat, 'Your bow already *Level Max*', m)
                            if (user.bow == 0) return conn.reply(m.chat, 'You don't have bowan', m)
                            if (user.diamond > upbow) {
                                user.bow += 1
                                user.diamond -= upbow * 1
                                user.bowdurability = durbow
                                conn.reply(m.chat, `✔️ Sukses upgrade bow 🏹  worth ${upbow} Diamond 💎` ,m)
                            } else conn.reply(m.chat, `Your Diamonds Are Not Enough To Upgrade bow 🏹  worth ${upbow} Diamond 💎`, m)
                        
                        break
                        
                            case 'sword':
                            if (user.sword == 5) return conn.reply(m.chat, 'Your word already *Level Max*', m)
                            if (user.sword == 0) return conn.reply(m.chat, 'You don't have Sword', m)
                            if (user.diamond > upsword) {
                                user.sword += 1
                                user.diamond -= upsword * 1
                                user.sworddurability = dursword
                                conn.reply(m.chat, `✔️ Sukses upgrade Sword 🗡️ worth ${upsword} Diamond 💎` ,m)
                            } else conn.reply(m.chat, `Your Diamonds Are Not Enough To Upgrade Sword 🗡️ worth ${upsword} Diamond 💎`, m)
                            break
                            case 'pickaxe':
                            if (user.pickaxe == 5) return conn.reply(m.chat, 'Your pickaxe already *Level Max*', m)
                            if (user.pickaxe == 0) return conn.reply(m.chat, 'You don't have Pickaxe', m)
                            if (user.diamond > uppickaxe) {
                                user.pickaxe += 1
                                user.diamond -= uppickaxe * 1
                                user.pickaxedurability = durpickaxe
                                conn.reply(m.chat, `✔️ Sukses upgrade Pickaxe ⛏️ worth ${uppickaxe} Diamond 💎` ,m)
                            } else conn.reply(m.chat, `Your Diamonds Are Not Enough To Upgrade Pickaxe ⛏️  worth ${uppickaxe} Diamond 💎`, m)
                            break
                            default:
                           return conn.reply(m.chat, list,m)
         }
                            
        console.log(e)
        if (DevMode) {
            for (let jid of global.owner.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').filter(v => v != conn.user.jid)) {
                conn.sendMessage(jid, 'shop.js error\nNo: *' + m.sender.split`@`[0] + '*\nCommand: *' + m.text + '*\n\n*' + e + '*', MessageType.text)
            }
        }
    }
}

handler.help = ['repair','upgrade']
handler.tags = ['rpg']
    
handler.command = /^(up|upgrade|repair)$/i
module.exports = handler

let wm = global.botwm