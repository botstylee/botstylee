import { createRequire } from 'module'
import db from '../lib/database.js'

// ✅ proto tidak tersedia sebagai named export ESM di @whiskeysockets/baileys
const _require = createRequire(import.meta.url)
const { proto } = _require('@whiskeysockets/baileys')

// ✅ named export diimpor statis (bukan lewat .default yang bisa undefined)
import {
	generateWAMessage,
	areJidsSameUser
} from '@whiskeysockets/baileys'

export async function all(m, chatUpdate) {
	if (m.isBaileys) return
	if (!m.message || !m.msg || !m.msg.fileSha256) return
	if (!(Buffer.from(m.msg.fileSha256).toString('base64') in db.data.sticker)) return

	var hash = db.data.sticker[Buffer.from(m.msg.fileSha256).toString('base64')]
	var { text, mentionedJid } = hash
	var messages = await generateWAMessage(m.chat, { text: text, mentions: mentionedJid }, {
		userJid: this.user.id,
		quoted: m.quoted && m.quoted.fakeObj
	})
	messages.key.fromMe = areJidsSameUser(m.sender, this.user.id || this.user.jid)
	messages.key.id = m.key.id
	messages.pushName = m.pushName
	if (m.isGroup) messages.participant = m.sender
	var msg = {
		...chatUpdate,
		messages: [proto.WebMessageInfo.fromObject(messages)],
		type: 'append'
	}
	this.ev.emit('messages.upsert', msg)
}
