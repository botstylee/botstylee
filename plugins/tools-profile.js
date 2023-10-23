import PhoneNumber from 'awesome-phonenumber'
import levelling from '../../lib/levelling.js'
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
		var setAt = (await conn.fetchStatus(who).catch(console.error) || {}).setAt || ''
		var pp = /^https?:\/\//.test(_p) ? await getbuffer(_p) : _p
		if (typeof db.data.users[who] == "undefined") {
			db.data.users[who] = {
				role: 'user',
				limit: 50,
				exp: 0,
				premium: false,
				expired: 0,
				level: 0,
				coin: 0,
				ruby: 0,
				mp: 0,
				banned: false,
				banexpired: 0,
				tokenpremium: 0,
				tokenfree: 1,
				tokenupgrade: 0,
				hit: 0,
				lastseen: 0,
				usebot: 0,
				afk: -1,
				afkReason: '',
				afkObj: {},
				pet: [{
					petname: 'ayam',
					level: 0,
					production: 0,
					hasproduction: 0,
					active: false
				}, {
					petname: 'kucing',
					level: 0,
					production: 0,
					hasproduction: 0,
					active: false
				}, {
					petname: 'kambing',
					level: 0,
					production: 0,
					hasproduction: 0,
					active: false
				}, {
					petname: 'sapi',
					level: 0,
					production: 0,
					hasproduction: 0,
					active: false
				}, {
					petname: 'kuda',
					level: 0,
					production: 0,
					hasproduction: 0,
					active: false
				}]
			}
		}
		var {
			limit,
			exp,
			level,
			role,
			banned,
			premium,
			expired,
			coin,
			ruby,
			mp,
			banexpired,
			tokenpremium,
			tokenfree,
			tokenupgrade,
			hit,
			usebot,
			pet
		} = db.data.users[who]
		var {
			min,
			xp,
			max
		} = levelling.xpRange(level, global.multiplier)
		var username = conn.getName(who)
		var math = max - xp
		var str = `
• *[ Nama ]* => ${username} (@${who.replace(/@.+/, '')})${about ? '\n• *[ Info ]* => ' + about + '\n• *[ SetInfo ]* => ' + new Intl.DateTimeFormat('id', {
	day: 'numeric',
	month: 'long',
	weekday: 'long',
	year: 'numeric'
}).format(moment(setAt).tz('asia/jakarta')) : ''}
• *[ Nomor ]* => ${PhoneNumber('+' + who.replace('@s.whatsapp.net', '')).getNumber('international')}
• *[ Link ]* => https://wa.me/${who.split`@`[0]}


• *[ Exp ]* => ${exp} *[ ${exp - min} / ${xp} ]* [${math <= 0 ? `Siap untuk *${usedPrefix}levelup*` : `${math} Exp lagi untuk levelup`}]
• *[ Level ]* => ${level}
• *[ Role ]* => ${role}
• *[ Limit ]* => ${limit}
• *[ Mp ]* => ${mp}
• *[ Coin ]* => ${coin}
• *[ Ruby ]* => ${ruby}
• *[ Tokenfree ]* => ${tokenfree}
• *[ Tokenpremium ]* => ${tokenpremium}
• *[ Tokenupgrade ]* => ${tokenupgrade}
• *[ TotalHit ]* => ${hit}
• *[ Status ]* => ${premium ? 'premium' : 'gratisan'}
${premium ? `• *[ expired ]* => ${(expired - Date.now()).toTimeString()}` : ''}
${pet.filter(v=> v.level > 0).length < 1 ? '' : '• *[ total pet ]* => ' + pet.filter(v=> v.level > 0).length + '\n• *[ pet active ]* => ' + (pet.find(v=> v.active == true) ? pet.find(v=> v.active == true).petname : 'gak ada' ) + (pet.find(v=> v.active == true) ? '\n• *[ pet level ]* => ' + (pet.find(v=> v.active == true).level == 5 ? 'Maximum' : pet.find(v=> v.active == true).level) + '\n• *[ production ]* => ' + pet.find(v=> v.active == true).production + ' MP / 30 menit' + '\n• *[ total production ]* => ' + pet.find(v=> v.active == true).hasproduction + ' MP' : '')}
`.trim()
		var mentions = [who]
		conn.reply(m.chat, banned ? 'kena banned bot' : str, m, {
			contextInfo: {
				mentionedJid: [who],
				externalAdReply: {
					mediaType: 2,
					description: 'profile ' + username,
					title: 'hai ' + username,
					mediaUrl: '',
					body: '',
					thumbnail: pp,
					sourceUrl: '',
					showAdAttribution: true, // false
					//renderLargerThumbnail: true // false
				}
			}
		})
	}
}
handler.help = ['profile *@user*']
handler.tags = ['tools']
handler.command = /^profile$/i
export default handler