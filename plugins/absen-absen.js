
let handler = async (m, { conn, usedPrefix }) => {
	 let id = m.chat
	 conn.absen = conn.absen ? conn.absen : {}
	 if (!(id in conn.absen)) {
		  await conn.reply(m.chat, `Tidak ada absen berlangsung!\n\n untuk memulai absen ketik\n${usedPrefix}mulaiabsen`, m)
		  throw false
	 }
	 let absen = conn.absen[id][1]
	 if (absen.includes(m.sender)) throw 'Kamu sudah absen!'
	 absen.push(m.sender)
	 let d = new Date
	 let date = d.toLocaleDateString('id', {
		  day: 'numeric',
		  month: 'long',
		  year: 'numeric'
	 })
	 
	 let list = absen.map((v, i) => `${cmenub} ${i + 1}.  @${v.split`@`[0]}`).join('\n')
				let caption = `*${htjava} TANGGAL ${htjava}*\n${date}
${conn.absen[id][2]}

*${htjava} DAFTAR ABSEN ${htjava}*
*Total:* ${absen.length}

${cmenut}
${list}
${cmenuf}

ikut absen => *${usedPrefix}absen*
cek absen => *${usedPrefix}cekabsen*
`
await conn.reply(m.chat, caption, m, { mentions: conn.parseMention(caption) })


}
handler.help = ['absen']
handler.tags = ['main']
handler.command = /^(absen|hadir)$/i

export default handler
