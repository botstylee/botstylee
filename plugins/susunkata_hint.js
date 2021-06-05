let handler = async (m, { conn }) => {
    conn.susunkata = conn.susunkata ? conn.susunkata : {}
    let id = m.chat
    if (!(id in conn.susunkata)) throw false
    let json = conn.susunkata[id][1]
    let nya = json.result.jawaban
    let nyanya = nya.replace(/[BCDFGHJKLMNPQRSTVWXYZ]/g, '_')
    m.reply('```' + nyanya + '```')
}
handler.command = /^skhint$/i
handler.limit = true
module.exports = handler
