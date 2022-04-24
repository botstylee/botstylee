const { MessageType } = require('@adiwajshing/baileys')
const { sticker: TES } = require('../lib/sticker')
const util = require('util')
const fs = require('fs')
let handler = async (m, { conn, participants, args }) => {
let stiker = false
     await m.reply(global.wait)
  try {
	let q = { message: { [m.quoted.mtype]: m.quoted }}
	if (!m.quoted) return m.reply('Tag Stickernya!')
  //if (m.quoted != /sticker/.test(m.quoted.mtype)) return m.reply('Sticker Aja Ya')
	if (/sticker/.test(m.quoted.mtype)) {
    let stick = await conn.downloadM(q)
    if (!stick) throw "Sticker Tidak Ditemukan!"
	let users = (await conn.groupMetadata(m.chat)).participants.map(u => u.jid)
	stiker = await TES(stick, false, global.packname, global.author)
	conn.sendMessage(m.chat, stiker, MessageType.sticker, {
              contextInfo: { 
                     mentionedJid: users
               }
          })
       } else {
	    m.reply('_Khusus Sticker Aja Ya_')
      }
   } catch (e) {
   	m.reply('```Error```')
   console.log ('Error\n\n', e)
   }
}
    })
    else throw 'Conversion failed'
  }
}
handler.help = ['stag <reply sticker>', 'stickertag <replay sticker>', 'stikertag <reply sticker>']
handler.tags = ['sticker']
handler.command = /^(s(tag|tickertag|tikertag))$/
handler.group = true
module.exports = handler
