let handler = async m => m.reply(`
╭─「 Donasi 」
│ • TELKOMSEL [082114499086]
│ • DANA [082114499086]
│ • OVO [082114499086]
│ • GOPAY [082114499086]
│ • Saweria [https://saweria.co/botstyle]
│ • Paypal [paypal.me/Benniismael]
╰────
╭─「 Hubungi 」
│ > Ingin donasi? Wa.me/62895368900456
╰────
`.trim()) // Tambah sendiri kalo mau
handler.help = ['donasi']
handler.tags = ['info']
handler.command = /^dona(te|si)$/i

module.exports = handler
