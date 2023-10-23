let handler = async (m, { usedPrefix }) => {
    let id = m.chat
    conn.absen = conn.absen ? conn.absen : {}
    if (!(id in conn.absen)) await conn.reply(m.chat, `_*Tidak ada absen berlangsung digrup ini!*_\n\n*${usedPrefix}mulaiabsen* - untuk memulai absen`, m)
    delete conn.absen[id]
    m.reply(`Berhasil!`)
}
handler.help = ['hapusabsen']
handler.tags = ['main']
handler.command = /^(delete|hapus)absen$/i
handler.group = true
handler.admin = true
export default handler
