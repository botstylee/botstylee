var handler = async (m, {
	conn,
	participants,
	groupMetadata
}) => {
	var _p = await conn.profilePictureUrl(m.chat, 'image').catch(_ => null) || profil
	var pp = /^https?:\/\//.test(_p) ? await getbuffer(_p) : _p
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
${grouprental ? '*Expired Group:*\nExpired: ' + await msToDate(expired - new Date() * 1)+ '\n' : ''}
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
				showAdAttribution: true, // false
				//renderLargerThumbnail: true // false
			}
		}
	})
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
	// +minutes+":"+sec;
}