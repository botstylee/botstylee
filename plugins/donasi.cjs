let handler = async m => m.reply(`
╭─「 Donasi 」
│ • TELKOMSEL [082331033919]
│ • DANA [082331033919]
│ • Saweria [https://saweria.co/nightsleep1]
╰────
╭─「 Hubungi 」
│ > Ingin donasi? Wa.me/6282331033919
╰────
`.trim()) // Tambah sendiri kalo mau
handler.help = ['donasi']
handler.tags = ['info']
handler.command = /^dona(te|si)$/i

module.exports = handler