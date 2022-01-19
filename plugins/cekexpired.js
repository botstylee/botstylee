let handler = async (m, { conn, isGroup, groupMetadata }) => {
  let grup = global.db.data.chats[m.chat].expired
  if (grup == 0) throw 'Grup ini belum ada batasan waktu pada bot'
  let sisa = msToDate(grup - new Date()*1)
  conn.send2Button(m.chat, `Sisa waktu Bot ada digrup *${groupMetadata.subject}*\n\n${sisa}`, 'Silahkan perpanjang ke Owner', 'Perpanjang', '.owner')
}
handler.help = ['cekexpired']
handler.tags = ['main']
handler.command = /^cekexpired$/
handler.register = true
handler.group = true

module.exports = handler

function msToDate(ms) {
    temp = ms
    days = Math.floor(ms / (24 * 60 * 60 * 1000));
    daysms = ms % (24 * 60 * 60 * 1000);
    hours = Math.floor((daysms) / (60 * 60 * 1000));
    hoursms = ms % (60 * 60 * 1000);
    minutes = Math.floor((hoursms) / (60 * 1000));
    minutesms = ms % (60 * 1000);
    sec = Math.floor((minutesms) / (1000));
    return days + " hari " + hours + " jam " + minutes + " menit";
    // +minutes+":"+sec;
}
