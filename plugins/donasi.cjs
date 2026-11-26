var handler = async m => m.reply(`
╭─「 Donasi 」
│ • TELKOMSEL [08211499086]
│ • DANA [08211499086]
│ • OVO [08211499086]
│ • GOPAY [08211499086]
│ • SHOPPY PAY [08211499086]
│ • Saweria [https://saweria.co/botstyle]
│ • DANA [0808211499086]
│ • GOPAY [08211499086]
│ • OVO [08211499086]
╰────
╭─「 Hubungi 」
│ > Ingin donasi? Wa.me/62895368900456
│ > Ingin donasi? Wa.me/62895368900456
╰────
`.trim()) // Tambah sendiri kalo mau
handler.help = ['donasi']
handler.tags = ['']
handler.command = /^dona(te|si)$/i

module.exports = handler
