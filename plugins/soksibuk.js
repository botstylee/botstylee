let handler = async (m, { conn, args, participants }) => {
  function msToDate(ms) {
		temp = ms
		days = Math.floor(ms / (24*60*60*1000));
		daysms = ms % (24*60*60*1000);
		hours = Math.floor((daysms)/(60*60*1000));
		hoursms = ms % (60*60*1000);
		minutes = Math.floor((hoursms)/(60*1000));
		minutesms = ms % (60*1000);
		sec = Math.floor((minutesms)/(1000));
		if (days == 0 && hours == 0 && minutes == 0){
			return "Baru Saja"
		}else {
			return days+" Hari "+hours+" Jam " + minutes + " Menit";
		}
		// +minutes+":"+sec;
  }

  let member = participants.map(u => u.jid)
  let memberGC = {}
  for (i=0;i<member.length;i++){
    var b = {}
    if (typeof global.db.data.users[member[i]] != "undefined"){
      memberGC[member[i]] = {
        lastseen: global.db.data.users[member[i]].lastseen
      }
    }
  }
  
  let sortedLS = Object.entries(memberGC).sort((a, b) => a[1].lastseen - b[1].lastseen)
  let usersLS = sortedLS.map(v => v[0])
  let len = args[0] && args[0].length > 0 ? Math.min(1000, Math.max(parseInt(args[0]), 5)) : Math.min(10, sortedLS.length)

  let text = `
❏ MEMBER SOK SIBUK
${sortedLS.slice(0, len).map(([user, data], i) => (i + 1) + '. '  + conn.getName(user) + '\n    wa.me/' + user.split('@')[0] + '\n    *' + msToDate(new Date() - data.lastseen) + '*').join`\n`}
`.trim()

  conn.reply(m.chat, text, m)
}

handler.help = ['soksibuk','soksibuk *total*']
handler.tags = ['group']
handler.command = /^(soksibuk)$/i
handler.group = true
handler.fail = null
module.exports = handler
