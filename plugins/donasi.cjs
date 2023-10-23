var handler = async m => m.reply(`
╭─「 Donasi 」
│ • DANA [082256080304]
│ • GOPAY [tidak terdaftar]
│ • OVO [tidak terdaftar]
╰────
╭─「 Hubungi 」
│ > Ingin donasi? Wa.me/6282256080304
╰────
`.trim()) // Tambah sendiri kalo mau
handler.help = ['donasi']
handler.tags = ['']
handler.command = /^dona(te|si)$/i

module.exports = handler