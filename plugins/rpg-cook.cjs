let handler = async (m, {
	command,
	usedPrefix,
	DevMode,
	args
}) => {
	let type = (args[0] || '').toLowerCase()
    let msk = (args[0] || '').toLowerCase()
    let user = db.data.users[m.sender]
    let author = global.author
let cok = `
▧ ayambakar 🍖
〉 Need 2 ayam 🐓 & 1 Coal 🕳️
▧ ayamgoreng 🍗
 〉 Need 2 ayam 🐓 & 1 Coal 🕳️
▧ oporayam 🍜
 〉 Need 2 ayam 🐓 & 1 Coal 🕳️
▧ steak 🥩
 〉 Need 2 sapi 🐮 & 1 Coal 🕳️
▧ rendang 🥘
 〉 Need 2 sapi 🐮 & 1 Coal 🕳️
▧ gulaiayam 🍲
 〉 Need 2 ayam 🐓 & 1 Coal 🕳️
▧ babipanggang 🥠
 〉 Need 2 babi 🐖 & 1 Coal 🕳️
`

try {
       if (/masak|cook/i.test(command)) {
            const count = args[1] && args[1].length > 0 ? Math.min(5, Math.max(parseInt(args[1]), 1)) : !args[1] || args.length < 3 ? 1 : Math.min(1, count)
            switch (type) {
            	case 'ayambakar':
            if (user.ayam < count * 2 || user.coal < 1 * count) {
                           user.ayam >= count * 1
                            user.ayam -= count * 2
                            user.coal -= count * 1
                            user.ayambakar += count * 1
                            conn.reply(m.chat, `Sukses memasak ${count} ayam bakar🍖`, m)
                       } else conn.reply(m.chat, `Anda tidak memiliki bahan untuk memasak ayam bakar\nAnda butuh 2 ayam dan 1 coal untuk memasak`, m)
					break
				  case 'gulaiayam':
            if (user.ayam < count * 2 || user.coal < 1 * count) {
                            user.ayam >= count * 1
                            user.ayam -= count * 2
                            user.coal -= count * 1
                            user.gulai += count * 1
                            conn.reply(m.chat, `Sukses memasak ${ count } Gulai Ayam🍜`, m)
                       } else conn.reply(m.chat, `Anda tidak memiliki bahan untuk memasak gulai ayam\nAnda butuh 2 ayam dan 1 coal untuk memasak`, m)
					break
                  case 'rendang':
            if (user.sapi < count * 2 || user.coal < 1 * count) {
                            user.sapi >= count * 1
                            user.sapi -= count * 2
                            user.coal -= count * 1
                            user.rendang += count * 1
                            conn.reply(m.chat, `Sukses memasak ${ count } Rendang 🍜`, m)
                       } else conn.reply(m.chat, `Anda tidak memiliki bahan untuk memasak dimasak rendang\nAnda butuh 2 sapi dan 1 coal untuk memasak`, m)
					break
                   case 'ayamgoreng':
            if (user.ayam < count * 2 || user.coal < 1 * count) {
                           user.ayam >= count * 1
                            user.ayam -= count * 2
                            user.coal -= count * 1
                            user.ayamgoreng += count * 1
                            conn.reply(m.chat, `Sukses memasak ${ count } ayam goreng🍗`, m)
                       } else conn.reply(m.chat, `Anda tidak memiliki bahan untuk memasak ayam goreng\nAnda butuh 2 ayam dan 1 coal untuk memasak`, m)
					break
                        case 'oporayam':
            if (user.lele < count * 2 || user.coal < 1 * count) {
                          user.lele >= count * 1
                            user.lele -= count * 2
                            user.coal -= count * 1
                            user.oporayam += count * 1
                            conn.reply(m.chat, `Sukses memasak ${ count } opor ayam`, m)
                       } else conn.reply(m.chat, `Anda tidak memiliki bahan untuk memasak opor ayam\nAnda butuh 2 ayam dan 1 coal untuk memasak`, m)
					break
                        case 'steak':
            if (user.sapi < count * 2 || user.coal < 1 * count) {
                            user.sapi >= count * 1
                            user.sapi -= count * 2
                            user.coal -= count * 1
                            user.steak += count * 1
                            conn.reply(m.chat, `Sukses memasak ${ count } Steak`, m)
                       } else conn.reply(m.chat, `Anda tidak memiliki bahan untuk memasak steak\nAnda butuh 2 sapi dan 1 coal untuk memasak`, m)
				break
             case 'babipanggang':
            if (user.babi < count * 2 || user.coal < 1 * count) {
                            user.babi >= count * 1
                            user.babi -= count * 2
                            user.coal -= count * 1
                            user.babipanggang += count * 1
                            conn.reply(m.chat, `Sukses memasak ${ count } babi panggang`, m)
                       } else conn.reply(m.chat, `Anda tidak memiliki bahan untuk memasak babi panggang\nAnda butuh 2 babi dan 1 coal untuk memasak`, m)
				break
                default:
                await conn.sendMessage(m.chat, {
				text: cok,
				footer: author,
				title: '「 *C O O K I N G* 」',
				buttonText: "C O O K I N G",
				sections: [{
					title: "List Featured",
					rows: [{
				title: "Ayam Bakar 🍖",
				rowId: ".cook ayambakar",
				description: "Cooking Ayam Bakar"
			},{
				title: "Ayam Goreng 🍗",
				rowId: ".cook ayambakar",
				description: "Cooking Ayam Goreng"
			},{
				title: "Opor Ayam 🍜",
				rowId: ".cook oporayam",
				description: "Cooking Opor Ayam"
			},{
				title: "Steak 🥩",
				rowId: ".cook steak",
				description: "Cooking Steak"
			},{
				title: "Rendang 🥘",
				rowId: ".cook rendang",
				description: "Cooking Rendang"
			},{
				title: "Gulai Ayam 🍲",
				rowId: ".cook gulaiayam",
				description: "Cooking Gulai Ayam"
			},{
				title: "Babi Panggang 🥠",
				rowId: ".cook babipanggang",
				description: "Cooking Babi Panggang"
			}
					]
				}]
			})
            }
        }
    } catch (e) {
        conn.reply(m.chat, `Sepertinya ada yg eror,coba laporin ke owner deh`, m)
        console.log(e)
        if (DevMode) {
            for (let jid of global.owner.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').filter(v => v != conn.user.jid)) {
                conn.sendMessage(jid, 'shop.js error\nNo: *' + m.sender.split`@`[0] + '*\nCommand: *' + m.text + '*\n\n*' + e + '*', MessageType.text)
            }
        }
    }
}

handler.help = ['masak <masakan> <args>', 'cook <masakan> <args>']
handler.tags = ['rpg']
handler.register = true
handler.command = /^(masak|cook)$/i
let wm = global.botwm 
module.exports = handler