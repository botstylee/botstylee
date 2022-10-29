/*//////////////////////////////////

Cretor : Hairul Lana
https://github.com/hairullana 

/*/ ///////////////////////////////*/

var handler = async (m, {
	conn,
	usedPrefix,
	text
}) => {
	if (isNaN(text)) {
		var number = text.split`@` [1]
	} else if (!isNaN(text)) {
		var number = text
	}

	if (!text && !m.quoted) return conn.reply(m.chat, `Masukan nomor, tag target atau balas pesan target`, m)

	if (isNaN(number)) return conn.reply(m.chat, `_*Nomor tidak valid.*_`, m)
	if (number.length > 15) return conn.reply(m.chat, `*_Format Tidak Valid.*_`, m)
	try {
		if (text) {
			var user = number + '@s.whatsapp.net'
		} else if (m.quoted.sender) {
			var user = m.quoted.sender
		} else if (m.mentionedJid) {
			var user = number + '@s.whatsapp.net'
		}
	} catch (e) {} finally {
		var groupMetadata = (m.isGroup ? ((store.chats[m.chat] || {}).metadata || await this.groupMetadata(m.chat).catch(_ => null)) : {}) || {}
		var participants = (m.isGroup ? groupMetadata.participants : []) || []
		var users = (m.isGroup ? participants.find(u => conn.decodeJid(u.id) === user) : {}) || {}
		if (!users) return conn.reply(m.chat, `*_Target atau Nomor tidak ditemukan, mungkin sudah keluar atau bukan anggota grup ini.*_`, m)
		if (user === m.sender) return conn.reply(m.chat, `_*Tidak bisa berpacaran dengan diri sendiri.*_`, m)
		if (user === conn.user.jid) return conn.reply(m.chat, `_*Tidak bisa berpacaran dengan saya. :')*_`, m)
		if (user === '6282331033919@s.whatsapp.net') return conn.reply(m.chat, `_*Dia gak ingin pacaran bang*_`, m)
		if (typeof db.data.users[user] == "undefined") return m.reply("_*Orang yang anda tag tidak terdaftar di dalam database.*_")

		if (db.data.users[m.sender].pasangan != "" && db.data.users[db.data.users[m.sender].pasangan].pasangan == m.sender && db.data.users[m.sender].pasangan != user) {
			conn.reply(m.chat, `Kamu sudah berpacaran dengan @${db.data.users[m.sender].pasangan.split('@')[0]}\n\nSilahkan putus dulu (ketik .putus untuk memutuskan hubungan) untuk menembak @${user.split('@')[0]}\n\nBtw yang setia dikit banget!`, m, {
				mentions: [user, db.data.users[m.sender].pasangan]
			})
		} else if (db.data.users[user].pasangan != "") {
			var pacar = db.data.users[user].pasangan
			if (db.data.users[pacar].pasangan == user) {
				if (m.sender == pacar && db.data.users[m.sender].pasangan == user) return conn.reply(m.chat, `Anda sudah berpacaran dengan @${beb.split('@')[0]}`, m, {
					mentions: [beb]
				})
				conn.reply(m.chat, `Maaf, @${user.split('@')[0]} sudah berpacaran dengan @${pacar.split('@')[0]}\nSilahkan cari pasangan lain!`, m, {
					mentions: [user, pacar]
				})
			} else {
				db.data.users[m.sender].pasangan = user
				conn.reply(m.chat, `Anda baru saja mengajak @${user.split('@')[0]} berpacaran\n\nSilahkan menunggu jawaban darinya!\n\nKetik *${usedPrefix}terima @user* untuk menerima\n*${usedPrefix}tolak @user untuk menolak*`, m, {
					mentions: [user]
				})
			}
		} else if (db.data.users[user].pasangan == m.sender) {
			db.data.users[m.sender].pasangan = user
			conn.reply(m.chat, `Selamat anda resmi berpacaran dengan @${user.split('@')[0]}\n\nSemoga langgeng dan bahagia selalu 🥳🥳🥳`, m, {
				mentions: [user]
			})
		} else {
			db.data.users[m.sender].pasangan = user
			conn.reply(m.chat, `Kamu baru saja mengajak @${user.split('@')[0]} berpacaran\n\nSilahkan menunggu jawaban darinya!\n\nKetik *${usedPrefix}terima @user* untuk menerima\n*${usedPrefix}tolak @user untuk menolak*`, m, {
				mentions: [user]
			})
		}
	}
}
handler.help = ['tembak *@tag*']
handler.tags = ['jadian']
handler.command = /^(tembak)$/i
handler.group = true
handler.limit = false
handler.fail = null
module.exports = handler