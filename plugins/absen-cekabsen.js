
let handler = async (m, { conn, usedPrefix }) => {
    let id = m.chat
    conn.absen = conn.absen ? conn.absen : {}
    if (!(id in conn.absen)) await conn.reply(m.chat, `_*Tidak ada absen berlangsung digrup ini!*_\n\n*${usedPrefix}mulaiabsen* - untuk memulai absen`, m)
            
    let d = new Date
    let date = d.toLocaleDateString('id', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    })
    let absen = conn.absen[id][1]
    let list = absen.map((v, i) => `${cmenub} ${i + 1}.  @${v.split`@`[0]}`).join('\n')
            let caption = `*${htjava} TANGGAL ${htjava}*\n${date}
${conn.absen[id][2]}

*${htjava} SUDAH ABSEN ${htjava}*
*Total:* ${absen.length}

${cmenut}
${list}
${cmenuf}

ikut absen => *${usedPrefix}absen*
cek absen => *${usedPrefix}cekabsen*
delete absen => *${usedPrefix}hapusabsen*
`

await conn.reply(m.chat, caption, m, { mentions: conn.parseMention(caption) })

}
handler.help = ['cekabsen']
handler.tags = ['main']
handler.command = /^cekabsen$/i
handler.group = true
export default handler
