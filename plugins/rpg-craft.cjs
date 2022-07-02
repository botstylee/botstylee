let handler = async (m, {
	command,
	usedPrefix,
	args
}) => {
  let type = (args[0] || '').toLowerCase()
  let _type = (args[0] || '').toLowerCase()
  let user = db.data.users[m.sender]
  user.pickaxe = user.pickaxe || 0
  user.pedang = user.pedang || 0
  user.fishingrod = user.fishingrod || 0
  user.axe = user.axe || 0

  let list = `
 [ Crafting ]
⛏️  pickaxe
⚔️  sword
🎣  fishingrod
`

  try {
    if (/craft|Crafting/i.test(command)) {
        switch (type) {
          case 'pickaxe':
            if(user.wood < 10 || user.iron < 15) return m.reply(`Not enough items to make a pickaxe. you need : 10 wood dan 15 iron`)
            user.wood -= 10
            user.iron -= 15
            user.pickaxe += 1
            user.pickaxedurability +=
            m.reply("Sukses membuat pickaxe")
            break
          case 'sword':
            if(user.wood < 5 || user.iron < 10) return m.reply(`Not enough items to make a sword. you need : 5 wood dan 10 iron `)
            user.wood -= 5
            user.iron -= 10
            user.sword += 1
            user.sworddurabiliry += 20
            m.reply("Sukses membuat sword")
            break
          case 'fishingrod':
            if(user.wood < 10 || user.string < 20) return m.reply(`Not enough items to make a fishing rod. you need :10 wood dan 20 String`)
            user.wood -= 10
            user.string -= 20
            user.fishingrod += 1
            user.fishingroddurability += 20
            m.reply("Sukses membuat fishing rod")
            break

          default:
            return conn.reply(m.chat, list,m)
        }
    } else if (/enchant|enchan/i.test(command)) {
      switch (_type) {
        case '':
          break

        default:
          return conn.reply(m.chat, list,m)
      }
    }
  } catch (err) {
    m.reply("Error\n\n\n" + err.stack)
  }
}

handler.help = ['craft']
handler.tags = ['rpg']
handler.command = /^(craft|crafting)/i

module.exports = handler