module.exports = Object.assign(m => global.DATABASE.data.sticker ? m.reply(`
*DAFTAR HASH*
\`\`\`
${Object.entries(global.DATABASE.data.sticker).map(([key, value], index) => `${index + 1}. ${value.locked ? `(Terkunci) ${key}` : key} : ${value.text}`).join('\n')}
\`\`\`
`.trim(), null, {
    contextInfo: {
        mentionedJid: Object.values(global.DATABASE.data.sticker).map(x => x.mentionedJid).reduce((a, b) => [...a, ...b], [])
    }
}) : m.reply('Tidak ada 🤷🏻‍♂️'), {
    help: ['cmd'].map(v => 'list' + v + ' <text>'),
    tags: ['database'],
    command: ['listcmd']
})
