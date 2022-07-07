let handler = async (m, {
	command,
	usedPrefix,
	args
}) => {
	let user = db.data.users[m.sender]
	let author = global.author
	let upgrd = (args[0] || '').toLowerCase()
    let type = (args[0] || '').toLowerCase()
    let _type = (args[1] || '').toLowerCase()
    let jualbeli = (args[0] || '').toLowerCase()
    const list = `
╭──『 ғᴏᴏᴅ 』
│⬡typing command↓
│   ${usedPrefix + command } rendang
│
│⬡ 🍖 *Ayambakar*
│⬡ 🍗 *Ayamgoreng*
│⬡ 🥘 *Rendang*
│⬡ 🥩 *Steak*
│⬡ 🥠 *Babipanggang*
│⬡ 🍲 *Gulaiayam*
│⬡ 🍜 *Oporayam*
│⬡ 🍷 *Vodka*
│⬡ 🍣 *Sushi*
│⬡ 💉 *Bandage*
│⬡ ☘️ *Ganja*
│⬡ 🍺 *Soda*
│⬡  🍞 *Roti*
╰───────────────
`.trim()
    //try {
    if (/makan|eat/i.test(command)) {
      const count = args[1] && args[1].length > 0 ? Math.min(99999999, Math.max(parseInt(args[1]), 1)) : !args[1] || args.length < 3 ? 1 : Math.min(1, count)
        switch (type) {
          case 'ayamgoreng':
        if (user.stamina < 100) {
        	if (user.ayamgoreng >= count * 1) {
                            user.ayamgoreng -= count * 1
                            user.stamina += 20 * count
                            conn.reply(m.chat, `Nyam nyam`, m)
                            } else conn.reply(m.chat, ` Ayam goreng kamu kurang` ,m)
        } else conn.reply( m.chat, `Stamina kamu sudah penuh`, m)
        break
        case 'ayambakar':
        if (user.stamina < 100) {
        	if (user.ayambakar >= count * 1) {
                            user.ayambakar -= count * 1
                            user.stamina += 20 * count
                            conn.reply(m.chat, `Nyam nyam`, m)
                            } else conn.reply(m.chat, ` Ayam bakar kamu kurang` ,m)
        } else conn.reply( m.chat, `Stamina kamu sudah penuh`, m)
        break
        case 'oporayam':
        if (user.stamina < 100) {
        	if (user.oporayam >= count * 1) {
                            user.oporayam -= count * 1
                            user.stamina += 20 * count
                            conn.reply(m.chat, `Nyam nyam`, m)
                            } else conn.reply(m.chat, ` Opor ayam kamu kurang` ,m)
        } else conn.reply( m.chat, `Stamina kamu sudah penuh`, m)
        break
        case 'rendang':
        if (user.stamina < 100) {
        	if (user.rendang >= count * 1) {
                            user.rendang -= count * 1
                            user.stamina += 20 * count
                            conn.reply(m.chat, `Nyam nyam`, m)
                            } else conn.reply(m.chat, ` Rendang kamu kurang` ,m)
        } else conn.reply( m.chat, `Stamina kamu sudah penuh`, m)
        break
        case 'steak':
        if (user.stamina < 100) {
        	if (user.steak >= count * 1) {
                            user.steak -= count * 1
                            user.stamina += 20 * count
                            conn.reply(m.chat, `Nyam nyam`, m)
                            } else conn.reply(m.chat, ` Steak kamu kurang` ,m)
        } else conn.reply( m.chat, `Stamina kamu sudah penuh`, m)
        break
        case 'gulaiayam':
        if (user.stamina < 100) {
        	if (user.gulaiayam >= count * 1) {
                            user.gulaiayam -= count * 1
                            user.stamina += 20 * count
                            conn.reply(m.chat, `Nyam nyam`, m)
                            } else conn.reply(m.chat, ` Gulai ayam kamu kurang` ,m)
        } else conn.reply( m.chat, `Stamina kamu sudah penuh`, m)
        break
        case 'babipanggang':
        if (user.stamina < 100) {
        	if (user.babipanggang >= count * 1) {
                            user.babipanggang -= count * 1
                            user.stamina += 20 * count
                            conn.reply(m.chat, `Nyam nyam`, m)
                            } else conn.reply(m.chat, ` Babi panggang kamu kurang` ,m)
        } else conn.reply( m.chat, `Stamina kamu sudah penuh`, m)
        break
        case 'soda':
        if (user.stamina < 100) {
        	if (user.soda >= count * 1) {
                            user.soda -= count * 1
                            user.stamina += 20 * count
                            conn.reply(m.chat, `Glek glek glek`, m)
                            } else conn.reply(m.chat, ` Soda kamu kurang` ,m)
        } else conn.reply( m.chat, `Stamina kamu sudah penuh`, m)
        break
        case 'vodka':
        if (user.stamina < 100) {
        	if (user.vodka >= count * 1) {
                            user.vodka -= count * 1
                            user.stamina += 25 * count
                            conn.reply(m.chat, `Glek Glek Glek`, m)
                            } else conn.reply(m.chat, ` Vodka kamu kurang` ,m)
        } else conn.reply( m.chat, `Stamina kamu sudah penuh`, m)
        break
        case 'ganja':
        if (user.stamina < 100) {
        	if (user.ganja >= count * 1) {
                            user.ganja -= count * 1
                            user.healt += 90 * count
                            conn.reply(m.chat, `ngefly`, m)
                            } else conn.reply(m.chat, ` Ganja kamu kurang` ,m)
        } else conn.reply( m.chat, `Stamina kamu sudah penuh`, m)
        break
        case 'bandage':
        if (user.stamina < 100) {
        	if (user.bandage >= count * 1) {
                            user.bandage -= count * 1
                            user.healt += 25 * count
                            conn.reply(m.chat, `Sretset`, m)
                            } else conn.reply(m.chat, ` Bandage kamu kurang` ,m)
        } else conn.reply( m.chat, `Healt kamu sudah penuh`, m)
        break
        case 'sushi':
        if (user.stamina < 100) {
        	if (user.sushi >= count * 1) {
                            user.sushi -= count * 1
                            user.stamina += 20 * count
                            conn.reply(m.chat, `Nyam nyam`, m)
                            } else conn.reply(m.chat, ` Sushi kamu kurang` ,m)
        } else conn.reply( m.chat, `Stamina kamu sudah penuh`, m)
        break
        break
        case 'roti':
        if (user.stamina < 100) {
        	if (user.roti >= count * 1) {
                            user.roti -= count * 1
                            user.stamina += 20 * count
                            conn.reply(m.chat, `Nyam nyam`, m)
                            } else conn.reply(m.chat, ` Roti kamu kurang` ,m)
        } else conn.reply( m.chat, `Stamina kamu sudah penuh`, m)
        break
          default:
       await conn.sendMessage(m.chat, {
				text: list,
				footer: author,
				title: '「 *E A T I N G* 」',
				buttonText: "E A T",
				sections: [{
					title: "List Featured",
					rows: [{
					title: "Ayam Bakar 🍖",
				rowId: ".eat ayambakar",
				description: "Memakan Ayam Bakar +20 Stamina"
			},{
				title: "Ayam Goreng 🍗",
				rowId: ".eat ayambakar",
				description: "Memakan Ayam Goreng +20 Stamina"
			},{
				title: "Opor Ayam 🍜",
				rowId: ".eat oporayam",
				description: "Memakan Opor Ayam +20 Stamina"
			},{
				title: "Steak 🥩",
				rowId: ".eat steak",
				description: "Memakan Steak +20 Stamina"
			},{
				title: "Rendang 🥘",
				rowId: ".eat rendang",
				description: "Memakan Rendang +20 Stamina"
			},{
				title: "Gulai Ayam 🍲",
				rowId: ".eat gulaiayam",
				description: "Memakan Gulai Ayam +20 Stamina"
			},{
				title: "Babi Panggang 🥠",
				rowId: ".eat babipanggang",
				description: "Memakan Babi Panggang +20 Stamina"
			},{
				title: "Roti 🍞",
				rowId: ".eat roti",
				description: "Memakan Roti +20 Stamina"
			},{
				title: "Sushi 🍣",
				rowId: ".eat sushi",
				description: "Memakan Sushi +20 Stamina"
			},{
				title: "Soda 🍺",
				rowId: ".eat soda",
				description: "Meminum Soda +20 Stamina"
			},{
				title: "Bandage 💉",
				rowId: ".eat bandage",
				description: "Memakai Bandage +25 Healt"
			},{
				title: "Ganja ☘️",
				rowId: ".eat ganja",
				description: "Mengonsumsi Ganja +90 Healt"
			},{
				title: "Vodka 🍷",
				rowId: ".eat vodka",
				description: "Meminum Vodka +25 Stamina"
			}
					]
				}]
			})
            }
    } else if (/p/i.test(command)) {
      const count = args[2] && args[2].length > 0 ? Math.min(99999999, Math.max(parseInt(args[2]), 1)) : !args[2] || args.length < 4 ? 1 :Math.min(1, count)
      switch (_type) {
        case 'p':
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

handler.help = ['eat', 'makan']
handler.tags = ['rpg']
handler.register = true
handler.command = /^(eat|makan)$/i
module.exports = handler