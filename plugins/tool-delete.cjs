var handler = async (m, { conn, usedPrefix }) => {
    // 1. Cek apakah ada quoted
    if (!m.quoted) {
        return conn.reply(m.chat, `Reply pesan bot yang mau dihapus dengan command *${usedPrefix}del*`, m)
    }

    // 2. Cek apakah pesan itu dari bot
    var { fromMe, isBaileys } = m.quoted
    if (!fromMe && !isBaileys) {
        return conn.reply(m.chat, 'Pesan tersebut bukan dikirim oleh bot!', m)
    }

    // 3. Ambil key dari quoted (pakai m.quoted.vM.key atau m.quoted.key)
    var quotedKey = m.quoted.vM?.key || m.quoted.key
    if (!quotedKey) {
        return conn.reply(m.chat, 'Gagal mendapatkan ID pesan yang mau dihapus.', m)
    }

    // 4. Tentukan target chat (biasanya m.chat, tapi ikuti quoted)
    var targetChat = m.quoted.chat || m.chat

    try {
        await conn.sendMessage(targetChat, {
            delete: quotedKey
        })
    } catch (e) {
        console.error('[delete] Error:', e)
        await conn.reply(m.chat, 'Gagal menghapus pesan: ' + (e.message || e), m)
    }
}

handler.help = ['del (reply)', 'delete (reply)']
handler.tags = ['tools']
handler.command = /^del(ete)?$/i

module.exports = handler
