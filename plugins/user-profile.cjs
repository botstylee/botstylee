var PhoneNumber = require('awesome-phonenumber')
var levelling = require('../lib/levelling.cjs')
var handler = async (m, {
	conn,
	usedPrefix
}) => {
	var _p = profil
	var who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.quoted ? m.quoted.sender : m.sender
	try {
		_p = await conn.profilePictureUrl(who, 'image')
	} catch (e) {

	} finally {
		var about = (await conn.fetchStatus(who).catch(console.error) || {}).status || ''
		var pp = /^https?:\/\//.test(_p) ? await getbuffer(_p) : _p
		if (typeof db.data.users[who] == "undefined") {
			db.data.users[who] = {
				exp: 0,
				limit: 10,
				lastclaim: 0,
				registered: false,
				name: conn.getName(m.sender),
				age: -1,
				regTime: -1,
				afk: -1,
				afkReason: '',
				banned: false,
				level: 0,
				role: 'Warrior V',
				autolevelup: false
			}
		}
		var {
			name,
			limit,
			exp,
			lastclaim,
			registered,
			regTime,
			age,
			level,
			role,
			banned,
			pasangan,
			premium
		} = db.data.users[who]
		var {
			min,
			xp,
			max
		} = levelling.xpRange(level, global.multiplier)
		var username = conn.getName(who)
		var math = max - xp
		var jodoh
		if (pasangan == "") {
			jodoh = `Gak punya`
		} else if (db.data.users[db.data.users[who].pasangan].pasangan != who) {
			jodoh = `sedang menunggu jawaban dari @${pasangan.split('@')[0]}`
		} else {
			jodoh = `@${pasangan.split('@')[0]}`
		}
		var str = `
Nama: ${username} ${registered ? '(' + name + ') ' : ''}(@${who.replace(/@.+/, '')})${about != 401 ? '\nInfo: ' + about : ''}
Nomor: ${PhoneNumber('+' + who.replace('@s.whatsapp.net', '')).getNumber('international')}
Link: https://wa.me/${who.split`@`[0]}${registered ? '\nUmur: ' + age : ''}
XP: TOTAL ${exp} (${exp - min} / ${xp}) [${math <= 0 ? `Siap untuk *${usedPrefix}levelup*` : `${math} XP lagi untuk levelup`}]
Level: ${level}
Role: *${role}*
Limit: ${limit}
Premium: ${premium ? 'Ya' : 'Tidak'}
Terdaftar: ${registered ? 'Ya (' + new Date(regTime).toLocaleString() + ')' : 'Tidak'}${lastclaim > 0 ? '\nTerakhir Klaim: ' + new Date(lastclaim).toLocaleString() : ''}
Pasangan: ${jodoh}
`.trim()
		var mentions = pasangan ? [who, pasangan] : [who]
		conn.reply(m.chat, banned ? 'jiakh ke banned' : str, m, {
			mentions,
			contextInfo: {
				externalAdReply: {
					mediaType: 2,
					description: 'anu',
					title: await tiny('hai' + username),
					mediaUrl: yt,
					body: '𓃗𓅜',
					thumbnail: pp,
					sourceUrl: gc,
					showAdAttribution: true, // false
					//renderLargerThumbnail: true // false
				}
			}
		})
	}
}
handler.help = ['profile *@user*']
handler.tags = ['user']
handler.command = /^profile$/i
module.exports = handler