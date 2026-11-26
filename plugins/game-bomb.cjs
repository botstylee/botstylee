// Thanks To Kasan

let handler = async (m, { conn, usedPrefix }) => {
    // Pastikan objek bomb ada
    conn.bomb = conn.bomb ? conn.bomb : {}

    let id = m.sender
    let timeout = 180000

    if (id in conn.bomb) {
        return conn.reply(m.chat, '*^ sesi ini belum selesai!*', conn.bomb[id][0])
    }

    const bom = ['💥', '✅', '✅', '✅', '✅', '✅', '✅', '✅', '✅'].sort(() => Math.random() - 0.5)
    const number = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣']

    const array = bom.map((v, i) => ({
        emot: v,
        number: number[i],
        position: i + 1,
        state: false
    }))

    let teks = `乂  *B O M B*\n\nKirim angka *1* - *9* untuk membuka *9* kotak nomor di bawah ini :\n\n`
    for (let i = 0; i < array.length; i += 3)
        teks += array.slice(i, i + 3).map(v => v.state ? v.emot : v.number).join('') + '\n'

    teks += `\nTimeout : [ *${((timeout / 1000) / 60)} menit* ]\nApabila mendapat kotak yang berisi bom maka point akan di kurangi. Ketik ${usedPrefix}suren untuk menyerah.`

    let msg = await conn.sendMessage(m.chat, {
        text: teks,
        contextInfo: {
            externalAdReply: {
                title: "",
                body: 'Bomb',
                thumbnailUrl: "https://telegra.ph/file/58253bd9ec6935f321474.jpg",
                sourceUrl: "",
                mediaType: 1,
                renderLargerThumbnail: true
            }
        }
    }, { quoted: m })

    let { key } = msg

    conn.bomb[id] = [
        msg,
        array,
        setTimeout(() => {
            let v = array.find(v => v.emot == '💥')
            if (conn.bomb[id]) conn.reply(m.chat, `*Waktu habis!*, Bom berada di kotak nomor ${v.number}.`, conn.bomb[id][0].key)
            delete conn.bomb[id]
        }, timeout),
        key
    ]
}

handler.help = ["bomb"]
handler.tags = ["game"]
handler.command = /^(bomb)$/i
handler.group = true

// ✅ Handler input angka 1-9
handler.before = async function (m, { conn }) {
    if (!m.isGroup) return !1
    if (!(m.sender in conn.bomb)) return !1

    let id = m.sender
    let session = conn.bomb[id]
    if (!session) return !1

    let [msg, array, timeout, key] = session
    let txt = m.text?.trim()

    // Cek apakah user kirim angka 1-9
    if (!/^[1-9]$/.test(txt)) return !1

    let index = parseInt(txt) - 1
    if (isNaN(index) || index < 0 || index > 8) return !1

    let box = array[index]
    if (!box || box.state) return !1

    box.state = true

    // Cek bom
    if (box.emot === '💥') {
        clearTimeout(timeout)
        delete conn.bomb[id]

        let teks = `乂  *B O M B*\n\n💥 *BOOM!* Kamu membuka kotak nomor ${box.number} yang berisi BOM!\n\n`
        for (let i = 0; i < array.length; i += 3)
            teks += array.slice(i, i + 3).map(v => v.state ? v.emot : v.number).join('') + '\n'
        teks += `\nGame selesai. Ketik ${usedPrefix}bomb untuk main lagi.`

        return conn.reply(m.chat, teks, m)
    }

    // Cek apakah semua kotak sudah dibuka (kecuali bom)
    let allOpened = array.every(v => v.state || v.emot === '💥')
    if (allOpened) {
        clearTimeout(timeout)
        delete conn.bomb[id]

        let v = array.find(v => v.emot == '💥')
        let teks = `乂  *B O M B*\n\n✅ *Selamat!* Kamu berhasil membuka semua kotak aman.\n\n`
        for (let i = 0; i < array.length; i += 3)
            teks += array.slice(i, i + 3).map(v => v.state ? v.emot : v.number).join('') + '\n'
        teks += `\nBom berada di kotak nomor ${v.number}.\nGame selesai. Ketik ${usedPrefix}bomb untuk main lagi.`

        return conn.reply(m.chat, teks, m)
    }

    // Update papan
    let teks = `乂  *B O M B*\n\n`
    for (let i = 0; i < array.length; i += 3)
        teks += array.slice(i, i + 3).map(v => v.state ? v.emot : v.number).join('') + '\n'
    teks += `\nKotak ${box.number} aman! Lanjutkan membuka kotak lain.`

    await conn.reply(m.chat, teks, m)

    return !0
}

module.exports = handler
