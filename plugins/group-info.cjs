var handler = async (m, {
	conn,
	participants,
	groupMetadata
}) => {
	// ✅ profil fallback — cegah ReferenceError jika global.profil tidak ada
	var profil = global.profil || 'https://telegra.ph/file/24fa902ead26340f3df2c.png'
	
	// ✅ Ambil profile picture dengan aman
	var _p = await conn.profilePictureUrl(m.chat, 'image').catch(_ => null) || profil
	
	// ✅ getbuffer bisa dari Helper atau fallback ke conn.getFile
	var pp = /^https?:\/\//.test(_p) ? await getBuffer(_p) : _p
	
	var {
		isBanned,
		welcome,
		antiLink,
		grouprental,
		expired
	} = db.data.chats[m.chat]
	
	var groupAdmins = participants.filter(p => p.admin)
	var listAdmin = groupAdmins.map((v, i) => `${i + 1}. @${v.id.split('@')[0]}`).join('\n')
	var owner = groupMetadata.owner || groupAdmins.find(p => p.admin === 'superadmin')?.id || m.chat.split`-` [0] + '@s.whatsapp.net'
	
	// ✅ msToDate tidak async, jadi tidak perlu await
	var expiredText = grouprental && expired ? '*Expired Group:*\nExpired: ' + msToDate(expired - new Date() * 1) + '\n' : ''
	
	var text = `*「 Group Information 」*\n
*ID:* 
${groupMetadata.id}
*Name:* 
${groupMetadata.subject}
*Description:* 
${groupMetadata.desc?.toString() || 'unknown'}
*Total Members:*
${participants.length} Members
*Group Owner:* 
@${owner.split('@')[0]}
*Group Admins:*
${listAdmin}
${expiredText}
*Group Settings:*
${isBanned ? '✅' : '❌'} Banned
${welcome ? '✅' : '❌'} Welcome
${antiLink ? '✅' : '❌'} AntiLink
`.trim()
	
	conn.reply(m.chat, text, m, {
		contextInfo: {
			mentionedJid: [...groupAdmins.map(v => v.id), owner],
			externalAdReply: {
				mediaType: 2,
				description: 'info group',
				title: conn.getName(m.chat),
				mediaUrl: "",
				body: '𓃗𓅜',
				thumbnail: pp,
				sourceUrl: "",
				showAdAttribution: true,
			}
		}
	})
}

// ✅ getBuffer helper — pakai axios yang sudah ada di global
async function getBuffer(url) {
	try {
		var res = await global.axios.get(url, { responseType: 'arraybuffer' })
		return Buffer.from(res.data)
	} catch (e) {
		console.error('[group-info] getBuffer:', e.message)
		return global.profil || 'https://telegra.ph/file/24fa902ead26340f3df2c.png'
	}
}

handler.help = ['infogrup']
handler.tags = ['group']
handler.command = /^(gro?upinfo|info(gro?up|gc))$/i

handler.group = true

module.exports = handler

function msToDate(ms) {
	var temp = ms,
	days = Math.floor((ms) / (24 * 60 * 60 * 1000)),
	daysms = ms % (24 * 60 * 60 * 1000),
	hours = Math.floor((daysms) / (60 * 60 * 1000)),
	hoursms = ms % (60 * 60 * 1000),
	minutes = Math.floor((hoursms) / (60 * 1000)),
	minutesms = ms % (60 * 1000),
	sec = Math.floor((minutesms) / (1000))
	return days + " Hari " + hours + " Jam " + minutes + " Menit";
}
