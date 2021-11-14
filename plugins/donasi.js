let handler = async m => m.reply(`
╭─「 Donasi 」
│ • Indosat [081515589573]
│ • Gopay [ Ga Ada ]
│ • Saweria [https://saweria.co/yo]
╰────
╭─「 Hubungi 」
│ > Ingin donasi? Wa.me/6281515589573
╰────
`.trim()) // Tambah sendiri kalo mau
handler.help = ['donasi']
handler.tags = ['info']
handler.command = /^dona(te|si)$/i

module.exports = handler
