// Thanks To Kasan

const util = require('util')

let handler = m => m

handler.before = async function (m, { conn }) {
    try {
        // ✅ Pastikan conn tersedia
        if (!conn) return !1

        // ✅ Pastikan db tersedia
        const db = global.db || (await import('./lib/database.js')).default
        if (!db?.data?.users?.[m.sender]) return !1

        let id = m.sender
        let timeout = 180000
        let reward = randomInt(100, 800)
        let users = db.data.users[m.sender]
        let body = (typeof m.text === 'string' ? m.text.trim() : '')

        conn.bomb = conn.bomb ? conn.bomb : {}

        // ✅ Inisialisasi exp kalau belum ada
        if (typeof users.exp !== 'number') users.exp = 0

        // ✅ Cek surrender hanya kalau user punya sesi aktif
        let isSurrender = /^(suren)$/i.test(body)
        if (isSurrender) {
            if (!(id in conn.bomb)) return !1
            await conn.reply(m.chat, `🚩 Menyerah`, m)
            clearTimeout(conn.bomb[id][2])
            delete conn.bomb[id]
            return !0
        }

        // ✅ Cek input angka valid (1-9) DAN user punya sesi
        if ((id in conn.bomb) && /^[1-9]$/.test(body)) {
            let json = conn.bomb[id][1].find(v => v.position == body)
            if (!json) return conn.reply(m.chat, `🚩 Untuk membuka kotak kirim angka 1 - 9`, m)

            if (json.emot == '💥') {
                json.state = true
                let bomb = conn.bomb[id][1]
                let teks = `乂  *B O M B*\n\n`
                teks += bomb.slice(0, 3).map(v => v.state ? v.emot : v.number).join('') + '\n'
                teks += bomb.slice(3, 6).map(v => v.state ? v.emot : v.number).join('') + '\n'
                teks += bomb.slice(6).map(v => v.state ? v.emot : v.number).join('') + '\n\n'
                teks += `Timeout : [ *${((timeout / 1000) / 60)} menit* ]\n`
                teks += `*Permainan selesai!*, kotak berisi bom terbuka : (- *${formatNumber(reward)}*)`

                await conn.sendMessage(m.chat, {
                    text: teks,
                    contextInfo: {
                        externalAdReply: {
                            title: "DUARRRRR",
                            body: "",
                            thumbnailUrl: "https://telegra.ph/file/70d62508854ab59c43602.jpg",
                            sourceUrl: "",
                            mediaType: 1,
                            showAdAttribution: false,
                            renderLargerThumbnail: true
                        }
                    }
                }, { quoted: m })

                users.exp = Math.max(0, users.exp - reward)
                clearTimeout(conn.bomb[id][2])
                delete conn.bomb[id]
            } else if (json.state) {
                return conn.reply(m.chat, `🚩 Kotak ${json.number} sudah di buka silahkan pilih kotak yang lain.`, m)
            } else {
                json.state = true
                let changes = conn.bomb[id][1]
                let open = changes.filter(v => v.state && v.emot != '💥').length

                if (open >= 8) {
                    let teks = `乂  *B O M B*\n\n`
                    teks += `Kirim angka *1* - *9* untuk membuka *9* kotak nomor di bawah ini :\n\n`
                    teks += changes.slice(0, 3).map(v => v.state ? v.emot : v.number).join('') + '\n'
                    teks += changes.slice(3, 6).map(v => v.state ? v.emot : v.number).join('') + '\n'
                    teks += changes.slice(6).map(v => v.state ? v.emot : v.number).join('') + '\n\n'
                    teks += `Timeout : [ *${((timeout / 1000) / 60)} menit* ]\n`
                    teks += `*Permainan selesai!* kotak berisi bom tidak terbuka : (+ *${formatNumber(reward)}*)`

                    await conn.reply(m.chat, teks, m)
                    users.exp += reward
                    clearTimeout(conn.bomb[id][2])
                    delete conn.bomb[id]
                } else {
                    let teks = `乂  *B O M B*\n\n`
                    teks += `Kirim angka *1* - *9* untuk membuka *9* kotak nomor di bawah ini :\n\n`
                    teks += changes.slice(0, 3).map(v => v.state ? v.emot : v.number).join('') + '\n'
                    teks += changes.slice(3, 6).map(v => v.state ? v.emot : v.number).join('') + '\n'
                    teks += changes.slice(6).map(v => v.state ? v.emot : v.number).join('') + '\n\n'
                    teks += `Timeout : [ *${((timeout / 1000) / 60)} menit* ]\n`
                    teks += `Kotak berisi bom tidak terbuka : (+ *${formatNumber(reward)}*)`

                    await conn.reply(m.chat, teks, m)
                }
            }
            return !0
        }
    } catch (e) {
        console.error('[bomb] Error:', e)
        return conn.reply(m.chat, util.format(e), m)
    }
    return !0
}

handler.exp = 0

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function formatNumber(number) {
    return number.toLocaleString()
}

module.exports = handler
