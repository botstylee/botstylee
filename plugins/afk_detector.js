export var before = (m) => {
	try {
		var afk = [...new Set([...(m.mentionedJid || []), ...(m.quoted ? [m.quoted.sender] : [])])];
		for (var jid of afk) {
			var is_user = db.data.users[jid];
			if (!is_user) continue;
			var afkTime = is_user.afk;
			if (!afkTime || afkTime < 0) continue;
			var reason = is_user.afkReason || '';
			if (!m.fromMe) {
				conn.reply(m.chat, `*Away From Keyboard* : @${jid.split('@')[0]}\n• *Reason* : ${reason ? reason : '-'}\n• *During* : [ ${(new Date - afkTime).toTimeString()} ]`, m, {
					mentions: [jid]
				}).then(async () => {
					conn.reply(jid, `Someone from *${await (await conn.groupMetadata(m.chat)).subject}*'s group, tagged or mentioned you.\n\n• *Sender* : @${m.sender.split('@')[0]}`, m, {
						mentions: [m.sender]
					}).then(async () => {
						await conn.copyNForward(jid, m);
					});
				});
			}
		}
	} catch (e) {
		return conn.reply(nomorown + '@s.whatsapp.net', e, m);
	}
	return true;
};
