let handler = async m => m.reply(`
╭─「 Donasi 」
│ • TELKOMSEL [082114499086]
│ • DANA [082114499086]
│ • GOPAY [082114499086]
│ • OVO [082114499086]
│ • Saweria [https://saweria.co/botstyle]
╰────
╭─「 Hubungi 」
│ > Ingin donasi? Wa.me/6282114499086
╰────
`.trim()) // Tambah sendiri kalo mau
handler.help = ['donasi']
handler.tags = ['info']
handler.command = /^dona(te|si)$/i

module.exports = handler
